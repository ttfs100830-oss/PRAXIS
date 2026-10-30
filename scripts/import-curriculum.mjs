#!/usr/bin/env node
/**
 * PRAXIS curriculum importer.
 *
 * Reads the authoritative TechStructure archive extracted under
 * content/techstructure-content, validates the manifest/index/file graph,
 * normalises the assessment schema variants supplied by the archive, and
 * writes:
 *
 *   src/generated/curriculum.json   public curriculum used by the UI
 *   supabase/seed.sql               idempotent curriculum seed
 *   reports/import-report.json      machine-readable import report
 *   reports/import-report.md        human-readable import report
 *
 * Answer keys, expected answers, rubrics and solution Markdown are written
 * only to supabase/seed.sql (server-side). They are never included in the
 * public curriculum bundle.
 *
 * The importer is intentionally repeatable: all SQL statements use stable
 * primary keys and ON CONFLICT upserts.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROJECT_ROOT = path.resolve(__dirname, "..");
export const DEFAULT_SOURCE = path.join(
  PROJECT_ROOT,
  "content",
  "techstructure-content",
);

const MC_TYPE = "multiple_choice";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function unique(values) {
  return [...new Set(values)];
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function safeInt(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : fallback;
}

function extractEstimatedMinutes(markdown, fallback) {
  const row = markdown.match(/\|\s*Estimated Time\s*\|\s*([^|\n]+)\|/i);
  if (!row) return { minutes: fallback, label: `${fallback} min` };
  const label = row[1].trim();
  const numbers = [...label.matchAll(/\d+/g)].map((match) => Number(match[0]));
  if (!numbers.length) return { minutes: fallback, label: `${fallback} min` };
  return { minutes: Math.max(...numbers), label };
}

export function sqlLiteral(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function jsonLiteral(value) {
  return `${sqlLiteral(JSON.stringify(value))}::jsonb`;
}

function boolLiteral(value) {
  return value ? "true" : "false";
}

function textArrayLiteral(values) {
  if (!values.length) return "array[]::text[]";
  return `array[${values.map(sqlLiteral).join(",")}]::text[]`;
}

/**
 * Validate and normalise the archive. Everything returned is derived from the
 * supplied files; this function never invents lesson text or answers.
 */
export function importCurriculum(sourceDir = DEFAULT_SOURCE) {
  const startedAt = new Date().toISOString();
  const manifestPath = path.join(sourceDir, "manifest.json");
  const indexPath = path.join(sourceDir, "content-index.json");

  const report = {
    startedAt,
    source: sourceDir,
    sourceFiles: {
      manifest: "manifest.json",
      contentIndex: "content-index.json",
    },
    archiveIntegrity: {},
    counts: {
      source: { paths: 0, modules: 0, lessons: 0, assessments: 0, solutions: 0, questions: 0 },
      imported: { paths: 0, modules: 0, lessons: 0, assessments: 0, solutions: 0, questions: 0, options: 0, prerequisites: 0 },
      rejected: { paths: 0, modules: 0, lessons: 0, assessments: 0, solutions: 0, questions: 0 },
      skipped: { paths: 0, modules: 0, lessons: 0, assessments: 0, solutions: 0, questions: 0 },
      duplicateRecords: 0,
      warnings: 0,
    },
    rejectionReasons: [],
    rejectedRecords: [],
    skippedRecords: [],
    warnings: [],
    schemaVariants: {},
    questionTypes: {},
    prerequisites: { edges: 0, missing: [], selfReferences: [], cycles: [] },
    checks: {
      manifestIndexAgreement: true,
      missingLessonFiles: 0,
      missingAssessmentFiles: 0,
      missingSolutionFiles: 0,
      invalidMultipleChoiceOptions: 0,
    },
  };

  const reject = (kind, id, reason, details = null) => {
    report.counts.rejected[kind] = (report.counts.rejected[kind] ?? 0) + 1;
    report.counts.warnings += 1;
    const record = { kind, id, reason, details };
    report.rejectedRecords.push(record);
    const found = report.rejectionReasons.find((item) => item.reason === reason);
    if (found) found.count += 1;
    else report.rejectionReasons.push({ reason, count: 1 });
  };

  const skip = (kind, id, reason, details = null) => {
    report.counts.skipped[kind] = (report.counts.skipped[kind] ?? 0) + 1;
    report.skippedRecords.push({ kind, id, reason, details });
  };

  const warn = (code, message) => {
    report.counts.warnings += 1;
    report.warnings.push({ code, message });
  };

  if (!fs.existsSync(manifestPath) || !fs.existsSync(indexPath)) {
    throw new Error(
      `Curriculum source is incomplete. Expected manifest.json and content-index.json in ${sourceDir}`,
    );
  }

  const manifestText = fs.readFileSync(manifestPath, "utf8");
  const indexText = fs.readFileSync(indexPath, "utf8");
  const manifest = JSON.parse(manifestText);
  const index = JSON.parse(indexText);

  report.archiveIntegrity.manifestSha256 = sha256(manifestText);
  report.archiveIntegrity.contentIndexSha256 = sha256(indexText);
  report.archiveIntegrity.recordedManifestSha256 = readRecordedManifestHash(sourceDir);
  report.archiveIntegrity.checksumMatchesRecorded =
    report.archiveIntegrity.recordedManifestSha256 ===
    report.archiveIntegrity.manifestSha256;

  report.counts.source.paths = Array.isArray(manifest.paths) ? manifest.paths.length : 0;
  report.counts.source.modules = Array.isArray(manifest.modules) ? manifest.modules.length : 0;
  report.counts.source.lessons = Array.isArray(manifest.lessons) ? manifest.lessons.length : 0;
  report.counts.source.assessments = Array.isArray(index.lessons) ? index.lessons.length : 0;
  report.counts.source.solutions = Array.isArray(index.lessons) ? index.lessons.length : 0;

  if (!Array.isArray(manifest.paths) || !Array.isArray(manifest.modules) || !Array.isArray(manifest.lessons)) {
    throw new Error("manifest.json does not contain paths, modules and lessons arrays.");
  }
  if (!Array.isArray(index.lessons)) {
    throw new Error("content-index.json does not contain a lessons array.");
  }

  const indexById = new Map();
  for (const lesson of index.lessons) {
    if (indexById.has(lesson.id)) {
      skip("lessons", lesson.id, "Duplicate lesson id in content-index.json");
      report.counts.duplicateRecords += 1;
      continue;
    }
    indexById.set(lesson.id, lesson);
  }

  const pathIds = new Set();
  const paths = [];
  for (const [position, sourcePath] of manifest.paths.entries()) {
    if (!nonEmptyString(sourcePath.id) || !nonEmptyString(sourcePath.title)) {
      reject("paths", sourcePath.id ?? `path-${position}`, "Path is missing id or title", sourcePath);
      continue;
    }
    if (pathIds.has(sourcePath.id)) {
      skip("paths", sourcePath.id, "Duplicate path id in manifest.json");
      report.counts.duplicateRecords += 1;
      continue;
    }
    pathIds.add(sourcePath.id);
    paths.push({
      id: sourcePath.id,
      title: sourcePath.title,
      tier: sourcePath.tier ?? "Unspecified",
      position: report.counts.imported.paths,
    });
    report.counts.imported.paths += 1;
  }

  const moduleIds = new Set();
  const modules = [];
  for (const [position, sourceModule] of manifest.modules.entries()) {
    const id = sourceModule.id ?? `module-${position}`;
    if (!nonEmptyString(sourceModule.id) || !nonEmptyString(sourceModule.title)) {
      reject("modules", id, "Module is missing id or title", sourceModule);
      continue;
    }
    if (!pathIds.has(sourceModule.path_id)) {
      reject("modules", id, `Module references unknown path ${sourceModule.path_id}`, sourceModule);
      continue;
    }
    if (moduleIds.has(sourceModule.id)) {
      skip("modules", id, "Duplicate module id in manifest.json");
      report.counts.duplicateRecords += 1;
      continue;
    }
    moduleIds.add(sourceModule.id);
    modules.push({
      id: sourceModule.id,
      title: sourceModule.title,
      pathId: sourceModule.path_id,
      position: report.counts.imported.modules,
    });
    report.counts.imported.modules += 1;
  }

  const lessons = [];
  const assessments = [];
  const privateAssessments = [];
  const solutions = [];
  const lessonIds = new Set();
  const moduleLessonCounts = new Map();
  const pathById = new Map(paths.map((item) => [item.id, item]));
  const moduleById = new Map(modules.map((item) => [item.id, item]));
  const manifestLessonIds = new Set(manifest.lessons.map((item) => item.id));

  for (const [sourcePosition, sourceLesson] of manifest.lessons.entries()) {
    const id = sourceLesson.id ?? `lesson-${sourcePosition}`;
    if (!nonEmptyString(sourceLesson.id) || !nonEmptyString(sourceLesson.title)) {
      reject("lessons", id, "Lesson is missing id or title", sourceLesson);
      continue;
    }
    const indexEntry = indexById.get(sourceLesson.id);
    if (!indexEntry) {
      reject("lessons", id, "Lesson is missing from content-index.json", sourceLesson);
      continue;
    }
    if (!moduleById.has(sourceLesson.module_id)) {
      reject("lessons", id, `Lesson references unknown module ${sourceLesson.module_id}`, sourceLesson);
      continue;
    }
    if (lessonIds.has(id)) {
      skip("lessons", id, "Duplicate lesson id in manifest.json");
      report.counts.duplicateRecords += 1;
      continue;
    }

    for (const key of ["title", "module_id", "scope", "classification"]) {
      if ((indexEntry[key] ?? null) !== (sourceLesson[key] ?? null)) {
        report.checks.manifestIndexAgreement = false;
        warn(
          "manifest-index-mismatch",
          `${id}: manifest ${key} differs from content-index.json; manifest value retained.`,
        );
      }
    }

    const lessonFile = indexEntry.lesson_file;
    const lessonPath = lessonFile ? path.join(sourceDir, lessonFile) : "";
    if (!lessonFile || !fs.existsSync(lessonPath)) {
      reject("lessons", id, "Referenced lesson Markdown file does not exist", { file: lessonFile });
      report.checks.missingLessonFiles += 1;
      continue;
    }

    const contentMarkdown = fs.readFileSync(lessonPath, "utf8");
    if (!contentMarkdown.trim()) {
      reject("lessons", id, "Referenced lesson Markdown file is empty", { file: lessonFile });
      continue;
    }

    const module = moduleById.get(sourceLesson.module_id);
    const pathRecord = pathById.get(module.pathId);
    const estimated = extractEstimatedMinutes(contentMarkdown, 20);
    const moduleLessonIndex = moduleLessonCounts.get(module.id) ?? 0;
    moduleLessonCounts.set(module.id, moduleLessonIndex + 1);

    const assessmentFile = indexEntry.assessment_file;
    const assessmentPath = assessmentFile ? path.join(sourceDir, assessmentFile) : "";
    let assessmentRecord = null;

    if (!assessmentFile || !fs.existsSync(assessmentPath)) {
      reject("assessments", id, "Referenced assessment JSON does not exist", { file: assessmentFile });
      report.checks.missingAssessmentFiles += 1;
    } else {
      try {
        const sourceAssessment = readJson(assessmentPath);
        assessmentRecord = normaliseAssessment({
          sourceAssessment,
          lesson: sourceLesson,
          assessmentFile,
          reject,
          report,
        });
        if (assessmentRecord) {
          assessments.push(assessmentRecord.publicAssessment);
          privateAssessments.push(assessmentRecord.privateAssessment);
          report.counts.imported.assessments += 1;
          report.counts.imported.questions += assessmentRecord.publicAssessment.questions.length;
          report.counts.imported.options += assessmentRecord.publicAssessment.questions.reduce(
            (sum, question) => sum + question.options.length,
            0,
          );
        }
      } catch (error) {
        reject("assessments", id, `Assessment JSON could not be parsed: ${String(error)}`, {
          file: assessmentFile,
        });
      }
    }

    const solutionFile = indexEntry.solution_file;
    const solutionPath = solutionFile ? path.join(sourceDir, solutionFile) : "";
    let solutionAvailable = false;
    if (!solutionFile || !fs.existsSync(solutionPath)) {
      reject("solutions", id, "Referenced solution Markdown does not exist", { file: solutionFile });
      report.checks.missingSolutionFiles += 1;
    } else {
      const content = fs.readFileSync(solutionPath, "utf8");
      if (!content.trim()) {
        reject("solutions", id, "Referenced solution Markdown is empty", { file: solutionFile });
      } else {
        solutions.push({
          lessonId: id,
          sourceFile: solutionFile,
          contentMarkdown: content,
        });
        solutionAvailable = true;
        report.counts.imported.solutions += 1;
      }
    }

    const prerequisites = unique(
      (Array.isArray(sourceLesson.prerequisites) ? sourceLesson.prerequisites : []).filter(
        (value) => typeof value === "string",
      ),
    );
    for (const prerequisite of prerequisites) {
      if (prerequisite === id) {
        report.prerequisites.selfReferences.push(id);
        report.counts.warnings += 1;
      } else if (!manifestLessonIds.has(prerequisite)) {
        report.prerequisites.missing.push({ lessonId: id, prerequisite });
        report.counts.warnings += 1;
      } else {
        report.counts.imported.prerequisites += 1;
      }
    }

    lessons.push({
      id,
      title: sourceLesson.title,
      moduleId: module.id,
      pathId: pathRecord.id,
      scope: sourceLesson.scope ?? "",
      classification: sourceLesson.classification ?? "core",
      prerequisites,
      contentMarkdown,
      estimatedMinutes: estimated.minutes,
      durationLabel: estimated.label,
      sourceFile: lessonFile,
      assessmentId: assessmentRecord ? assessmentRecord.publicAssessment.id : null,
      solutionAvailable,
      position: report.counts.imported.lessons,
      modulePosition: moduleLessonIndex,
    });
    lessonIds.add(id);
    report.counts.imported.lessons += 1;
    report.counts.source.questions += assessmentRecord?.publicAssessment.questions.length ?? 0;
  }

  report.prerequisites.edges = report.counts.imported.prerequisites;
  report.prerequisites.cycles = detectPrerequisiteCycles(lessons);
  if (report.prerequisites.cycles.length) {
    warn("prerequisite-cycle", `${report.prerequisites.cycles.length} prerequisite cycle(s) detected.`);
  }

  // Attach ordered lesson ids to modules and modules to paths for the UI.
  const enrichedModules = modules.map((module) => ({
    ...module,
    lessonIds: lessons
      .filter((lesson) => lesson.moduleId === module.id)
      .sort((a, b) => a.modulePosition - b.modulePosition)
      .map((lesson) => lesson.id),
  }));
  const enrichedPaths = paths.map((pathRecord) => ({
    ...pathRecord,
    moduleIds: enrichedModules
      .filter((module) => module.pathId === pathRecord.id)
      .sort((a, b) => a.position - b.position)
      .map((module) => module.id),
    lessonIds: lessons
      .filter((lesson) => lesson.pathId === pathRecord.id)
      .sort((a, b) => a.position - b.position)
      .map((lesson) => lesson.id),
  }));

  const meta = {
    generatedAt: startedAt,
    source: "techstructure-content-merged.zip",
    sourceDirectory: "content/techstructure-content",
    manifestSha256: report.archiveIntegrity.manifestSha256,
    contentIndexSha256: report.archiveIntegrity.contentIndexSha256,
    counts: {
      paths: enrichedPaths.length,
      modules: enrichedModules.length,
      lessons: lessons.length,
      assessments: assessments.length,
      solutions: solutions.length,
      questions: assessments.reduce((sum, item) => sum + item.questions.length, 0),
      multipleChoiceQuestions: assessments.reduce(
        (sum, item) => sum + item.questions.filter((question) => question.type === MC_TYPE).length,
        0,
      ),
      freeResponseQuestions: assessments.reduce(
        (sum, item) => sum + item.questions.filter((question) => question.type !== MC_TYPE).length,
        0,
      ),
    },
    caveats: [
      "The archive's own batch-01 report says the content still needs further review and is not release-ready.",
      "Batches 3 and 4 identify themselves as generated drafts.",
      "The archive records a stale manifest checksum; the checksum of the actual archived manifest was calculated during import.",
      "No supplied content was rewritten. Editorial limitations are reported rather than silently corrected.",
    ],
  };

  const publicCurriculum = {
    meta,
    paths: enrichedPaths,
    modules: enrichedModules,
    lessons,
    assessments,
  };

  const sql = buildSeedSql({ paths: enrichedPaths, modules: enrichedModules, lessons, assessments, privateAssessments, solutions });

  report.finishedAt = new Date().toISOString();
  report.curriculum = meta;
  report.counts.imported.paths = enrichedPaths.length;
  report.counts.imported.modules = enrichedModules.length;
  report.counts.imported.lessons = lessons.length;
  report.counts.imported.assessments = assessments.length;
  report.counts.imported.solutions = solutions.length;
  report.counts.imported.questions = meta.counts.questions;
  report.assessmentSchemas = report.schemaVariants;
  report.checks.invalidMultipleChoiceOptions =
    report.rejectedRecords.filter((item) => item.reason.includes("option")).length;
  report.checks.noMissingReferences =
    report.checks.missingLessonFiles === 0 &&
    report.checks.missingAssessmentFiles === 0 &&
    report.checks.missingSolutionFiles === 0;

  return { publicCurriculum, privateAssessments, solutions, sql, report };
}

function readRecordedManifestHash(sourceDir) {
  const candidate = path.join(sourceDir, "reports", "manifest-current-sha256.txt");
  if (!fs.existsSync(candidate)) return null;
  const text = fs.readFileSync(candidate, "utf8");
  const match = text.match(/\b[a-f0-9]{64}\b/i);
  return match ? match[0].toLowerCase() : null;
}

function normaliseAssessment({ sourceAssessment, lesson, assessmentFile, reject, report }) {
  if (!sourceAssessment || typeof sourceAssessment !== "object") {
    reject("assessments", lesson.id, "Assessment is not a JSON object", { file: assessmentFile });
    return null;
  }
  if (sourceAssessment.lesson_id && sourceAssessment.lesson_id !== lesson.id) {
    reject(
      "assessments",
      lesson.id,
      `Assessment lesson_id ${sourceAssessment.lesson_id} does not match lesson ${lesson.id}`,
      { file: assessmentFile },
    );
    return null;
  }
  if (!Array.isArray(sourceAssessment.questions) || sourceAssessment.questions.length === 0) {
    reject("assessments", lesson.id, "Assessment has no questions", { file: assessmentFile });
    return null;
  }

  const schemaVersion =
    sourceAssessment.assessment_version !== undefined
      ? `v${sourceAssessment.assessment_version}`
      : sourceAssessment.version !== undefined
        ? "legacy-free-response"
        : "unknown";
  const variantKey = schemaVersion;
  report.schemaVariants[variantKey] = (report.schemaVariants[variantKey] ?? 0) + 1;

  const questions = [];
  const privateQuestions = [];
  const seenQuestionIds = new Set();
  const assessmentId = lesson.id;

  for (const [position, sourceQuestion] of sourceAssessment.questions.entries()) {
    const sourceId = nonEmptyString(sourceQuestion.id) ? sourceQuestion.id : `q${position + 1}`;
    let questionId = `${assessmentId}:${sourceId}`;
    if (seenQuestionIds.has(questionId)) {
      const duplicate = questionId;
      questionId = `${questionId}#${position + 1}`;
      report.counts.duplicateRecords += 1;
      report.skippedRecords.push({
        kind: "questions",
        id: duplicate,
        reason: "Duplicate question id; a stable occurrence-suffixed id was used.",
      });
    }
    seenQuestionIds.add(questionId);

    if (!nonEmptyString(sourceQuestion.prompt)) {
      reject("questions", questionId, "Question is missing a prompt", { assessmentId });
      continue;
    }

    const type = nonEmptyString(sourceQuestion.type) ? sourceQuestion.type : "short_answer";
    report.questionTypes[type] = (report.questionTypes[type] ?? 0) + 1;
    const points = safeInt(sourceQuestion.points, 1);
    if (points <= 0) {
      reject("questions", questionId, "Question has invalid points", { assessmentId });
      continue;
    }

    const options = [];
    let correctOptionId = null;
    if (type === MC_TYPE) {
      const sourceOptions = Array.isArray(sourceQuestion.options) ? sourceQuestion.options : [];
      const optionIds = new Set();
      for (const [optionPosition, option] of sourceOptions.entries()) {
        if (!nonEmptyString(option.id) || !nonEmptyString(option.text)) {
          reject("questions", questionId, "Multiple-choice option is missing id or text", {
            assessmentId,
            option,
          });
          continue;
        }
        if (optionIds.has(option.id)) {
          reject("questions", questionId, `Duplicate multiple-choice option id ${option.id}`, {
            assessmentId,
          });
          continue;
        }
        optionIds.add(option.id);
        options.push({
          id: option.id,
          text: option.text,
          position: optionPosition,
        });
      }
      if (options.length < 2) {
        reject("questions", questionId, "Multiple-choice question has fewer than two valid options", {
          assessmentId,
        });
        continue;
      }
      if (!nonEmptyString(sourceQuestion.correct_option_id)) {
        reject("questions", questionId, "Multiple-choice question is missing correct_option_id", {
          assessmentId,
        });
        continue;
      }
      if (!options.some((option) => option.id === sourceQuestion.correct_option_id)) {
        reject("questions", questionId, "correct_option_id is not one of the supplied options", {
          assessmentId,
        });
        continue;
      }
      correctOptionId = sourceQuestion.correct_option_id;
    } else if (!nonEmptyString(sourceQuestion.expected_answer) && !nonEmptyString(sourceQuestion.expected_answer_guidance)) {
      reject("questions", questionId, "Free-response question has neither expected_answer nor expected_answer_guidance", {
        assessmentId,
      });
      continue;
    }

    questions.push({
      id: questionId,
      sourceId,
      type,
      prompt: sourceQuestion.prompt,
      points,
      options,
      autoGradable: type === MC_TYPE,
      position,
    });
    privateQuestions.push({
      questionId,
      correctOptionId,
      expectedAnswer:
        sourceQuestion.expected_answer ?? sourceQuestion.expected_answer_guidance ?? null,
      explanation: sourceQuestion.explanation ?? null,
      gradingRubric: Array.isArray(sourceQuestion.grading_rubric)
        ? sourceQuestion.grading_rubric
        : null,
    });
  }

  if (!questions.length) {
    reject("assessments", lesson.id, "No questions survived validation", { file: assessmentFile });
    return null;
  }

  const totalPoints = questions.reduce((sum, question) => sum + question.points, 0);
  const suppliedTotal = sourceAssessment.total_points;
  if (suppliedTotal !== undefined && safeInt(suppliedTotal) !== totalPoints) {
    report.skippedRecords.push({
      kind: "assessment-metadata",
      id: lesson.id,
      reason: "Supplied total_points differed from the sum of validated question points; the computed value was used.",
      details: { suppliedTotal, computed: totalPoints },
    });
  }

  return {
    publicAssessment: {
      id: assessmentId,
      lessonId: lesson.id,
      title:
        sourceAssessment.title ??
        sourceAssessment.assessment_title ??
        lesson.title,
      instructions: sourceAssessment.instructions ?? sourceAssessment.grading_note ?? "",
      passingScorePercent: safeInt(sourceAssessment.passing_score_percent, 70),
      totalPoints,
      schemaVersion,
      sourceFile: assessmentFile,
      questions,
    },
    privateAssessment: {
      assessmentId,
      questions: privateQuestions,
    },
  };
}

function detectPrerequisiteCycles(lessons) {
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const state = new Map();
  const stack = [];
  const cycles = [];
  const visit = (id) => {
    if (state.get(id) === "done") return;
    if (state.get(id) === "active") {
      const index = stack.indexOf(id);
      if (index >= 0) cycles.push(stack.slice(index).concat(id));
      return;
    }
    state.set(id, "active");
    stack.push(id);
    for (const prerequisite of byId.get(id)?.prerequisites ?? []) {
      if (byId.has(prerequisite)) visit(prerequisite);
    }
    stack.pop();
    state.set(id, "done");
  };
  for (const lesson of lessons) visit(lesson.id);
  return cycles;
}

export const ACHIEVEMENTS = [
  {
    id: "first-lesson",
    title: "First step",
    description: "Complete your first lesson.",
    criteria: { lessons: 1 },
    sortOrder: 1,
  },
  {
    id: "five-lessons",
    title: "Finding a rhythm",
    description: "Complete five lessons.",
    criteria: { lessons: 5 },
    sortOrder: 2,
  },
  {
    id: "twenty-five-lessons",
    title: "Deep foundations",
    description: "Complete twenty-five lessons.",
    criteria: { lessons: 25 },
    sortOrder: 3,
  },
  {
    id: "first-assessment",
    title: "Checked your understanding",
    description: "Pass your first auto-graded assessment.",
    criteria: { assessments: 1 },
    sortOrder: 4,
  },
  {
    id: "streak-3",
    title: "Three-day streak",
    description: "Learn on three consecutive days.",
    criteria: { streak: 3 },
    sortOrder: 5,
  },
  {
    id: "streak-7",
    title: "Seven-day streak",
    description: "Learn on seven consecutive days.",
    criteria: { streak: 7 },
    sortOrder: 6,
  },
  {
    id: "xp-500",
    title: "500 XP",
    description: "Earn 500 verified XP.",
    criteria: { xp: 500 },
    sortOrder: 7,
  },
];

export function buildSeedSql({ paths, modules, lessons, assessments, privateAssessments, solutions }) {
  const lines = [];
  lines.push("-- PRAXIS curriculum seed. Generated by scripts/import-curriculum.mjs.");
  lines.push("-- This file contains answer keys and model answers. Apply it only in the");
  lines.push("-- Supabase SQL editor or a trusted server environment. Never ship it to a browser.");
  lines.push("begin;");
  lines.push("set local standard_conforming_strings = on;");
  lines.push("");

  lines.push("-- Shared curriculum: paths");
  for (const item of paths) {
    lines.push(
      `insert into public.paths (id, title, tier, position) values (${sqlLiteral(item.id)}, ${sqlLiteral(item.title)}, ${sqlLiteral(item.tier)}, ${item.position}) on conflict (id) do update set title = excluded.title, tier = excluded.tier, position = excluded.position;`,
    );
  }
  lines.push("");

  lines.push("-- Shared curriculum: modules");
  for (const item of modules) {
    lines.push(
      `insert into public.modules (id, path_id, title, position) values (${sqlLiteral(item.id)}, ${sqlLiteral(item.pathId)}, ${sqlLiteral(item.title)}, ${item.position}) on conflict (id) do update set path_id = excluded.path_id, title = excluded.title, position = excluded.position;`,
    );
  }
  lines.push("");

  lines.push("-- Shared curriculum: lessons (Markdown preserved verbatim)");
  for (const item of lessons) {
    lines.push(
      `insert into public.lessons (id, module_id, title, scope, classification, content_md, estimated_minutes, duration_label, source_file, position) values (${sqlLiteral(item.id)}, ${sqlLiteral(item.moduleId)}, ${sqlLiteral(item.title)}, ${sqlLiteral(item.scope)}, ${sqlLiteral(item.classification)}, ${sqlLiteral(item.contentMarkdown)}, ${item.estimatedMinutes}, ${sqlLiteral(item.durationLabel)}, ${sqlLiteral(item.sourceFile)}, ${item.position}) on conflict (id) do update set module_id = excluded.module_id, title = excluded.title, scope = excluded.scope, classification = excluded.classification, content_md = excluded.content_md, estimated_minutes = excluded.estimated_minutes, duration_label = excluded.duration_label, source_file = excluded.source_file, position = excluded.position;`,
    );
  }
  lines.push("");

  lines.push("-- Prerequisites");
  for (const lesson of lessons) {
    for (const prerequisite of lesson.prerequisites) {
      if (!lessons.some((item) => item.id === prerequisite)) continue;
      lines.push(
        `insert into public.lesson_prerequisites (lesson_id, prerequisite_id) values (${sqlLiteral(lesson.id)}, ${sqlLiteral(prerequisite)}) on conflict (lesson_id, prerequisite_id) do nothing;`,
      );
    }
  }
  lines.push("");

  lines.push("-- Assessments (public metadata only)");
  for (const item of assessments) {
    lines.push(
      `insert into public.assessments (id, lesson_id, title, instructions, passing_score_percent, total_points, schema_version, source_file) values (${sqlLiteral(item.id)}, ${sqlLiteral(item.lessonId)}, ${sqlLiteral(item.title)}, ${sqlLiteral(item.instructions)}, ${item.passingScorePercent}, ${item.totalPoints}, ${sqlLiteral(item.schemaVersion)}, ${sqlLiteral(item.sourceFile)}) on conflict (id) do update set lesson_id = excluded.lesson_id, title = excluded.title, instructions = excluded.instructions, passing_score_percent = excluded.passing_score_percent, total_points = excluded.total_points, schema_version = excluded.schema_version, source_file = excluded.source_file;`,
    );
  }
  lines.push("");

  lines.push("-- Questions (public prompts; answer keys are stored separately)");
  for (const assessment of assessments) {
    for (const question of assessment.questions) {
      lines.push(
        `insert into public.questions (id, assessment_id, source_id, position, type, prompt, points) values (${sqlLiteral(question.id)}, ${sqlLiteral(assessment.id)}, ${sqlLiteral(question.sourceId)}, ${question.position}, ${sqlLiteral(question.type)}, ${sqlLiteral(question.prompt)}, ${question.points}) on conflict (id) do update set assessment_id = excluded.assessment_id, source_id = excluded.source_id, position = excluded.position, type = excluded.type, prompt = excluded.prompt, points = excluded.points;`,
      );
      for (const [optionPosition, option] of question.options.entries()) {
        lines.push(
          `insert into public.question_options (question_id, id, text, position) values (${sqlLiteral(question.id)}, ${sqlLiteral(option.id)}, ${sqlLiteral(option.text)}, ${optionPosition}) on conflict (question_id, id) do update set text = excluded.text, position = excluded.position;`,
        );
      }
    }
  }
  lines.push("");

  lines.push("-- Private grading data. RLS gives browser clients no direct SELECT access.");
  for (const assessment of privateAssessments) {
    for (const question of assessment.questions) {
      lines.push(
        `insert into public.answer_keys (question_id, correct_option_id, expected_answer, explanation, grading_rubric) values (${sqlLiteral(question.questionId)}, ${sqlLiteral(question.correctOptionId)}, ${sqlLiteral(question.expectedAnswer)}, ${sqlLiteral(question.explanation)}, ${jsonLiteral(question.gradingRubric)}) on conflict (question_id) do update set correct_option_id = excluded.correct_option_id, expected_answer = excluded.expected_answer, explanation = excluded.explanation, grading_rubric = excluded.grading_rubric;`,
      );
    }
  }
  lines.push("");

  lines.push("-- Worked solutions; readable only through review RPCs after a submission.");
  for (const solution of solutions) {
    lines.push(
      `insert into public.lesson_solutions (lesson_id, content_md, source_file) values (${sqlLiteral(solution.lessonId)}, ${sqlLiteral(solution.contentMarkdown)}, ${sqlLiteral(solution.sourceFile)}) on conflict (lesson_id) do update set content_md = excluded.content_md, source_file = excluded.source_file;`,
    );
  }
  lines.push("");

  lines.push("-- Achievements");
  for (const achievement of ACHIEVEMENTS) {
    lines.push(
      `insert into public.achievements (id, title, description, criteria, sort_order) values (${sqlLiteral(achievement.id)}, ${sqlLiteral(achievement.title)}, ${sqlLiteral(achievement.description)}, ${jsonLiteral(achievement.criteria)}, ${achievement.sortOrder}) on conflict (id) do update set title = excluded.title, description = excluded.description, criteria = excluded.criteria, sort_order = excluded.sort_order;`,
    );
  }
  lines.push("");
  lines.push("commit;");
  return `${lines.join("\n")}\n`;
}

export function writeOutputs(result, projectRoot = PROJECT_ROOT) {
  const generatedDir = path.join(projectRoot, "src", "generated");
  const supabaseDir = path.join(projectRoot, "supabase");
  const reportsDir = path.join(projectRoot, "reports");
  fs.mkdirSync(generatedDir, { recursive: true });
  fs.mkdirSync(supabaseDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });

  fs.writeFileSync(
    path.join(generatedDir, "curriculum.json"),
    `${JSON.stringify(result.publicCurriculum, null, 2)}\n`,
    "utf8",
  );
  fs.writeFileSync(path.join(supabaseDir, "seed.sql"), result.sql, "utf8");
  fs.writeFileSync(
    path.join(reportsDir, "import-report.json"),
    `${JSON.stringify(result.report, null, 2)}\n`,
    "utf8",
  );
  fs.writeFileSync(
    path.join(reportsDir, "import-report.md"),
    buildMarkdownReport(result.report),
    "utf8",
  );
  return {
    curriculum: path.join(generatedDir, "curriculum.json"),
    seed: path.join(supabaseDir, "seed.sql"),
    report: path.join(reportsDir, "import-report.json"),
    markdown: path.join(reportsDir, "import-report.md"),
  };
}

export function buildMarkdownReport(report) {
  const lines = [];
  lines.push("# PRAXIS curriculum import report");
  lines.push("");
  lines.push(`Generated: ${report.finishedAt}`);
  lines.push(`Source: \`${report.source}\``);
  lines.push("");
  lines.push("## Imported records");
  lines.push("");
  lines.push("| Record type | Imported | Rejected | Skipped |");
  lines.push("|---|---:|---:|---:|");
  for (const kind of ["paths", "modules", "lessons", "assessments", "questions", "solutions"]) {
    lines.push(
      `| ${kind} | ${report.counts.imported[kind] ?? 0} | ${report.counts.rejected[kind] ?? 0} | ${report.counts.skipped[kind] ?? 0} |`,
    );
  }
  lines.push("");
  lines.push(`Answer options imported: **${report.counts.imported.options}**`);
  lines.push(`Prerequisite edges imported: **${report.counts.imported.prerequisites}**`);
  lines.push("");
  lines.push("## Validation");
  lines.push("");
  lines.push(`- Lesson / assessment / solution files missing: ${report.checks.missingLessonFiles} / ${report.checks.missingAssessmentFiles} / ${report.checks.missingSolutionFiles}`);
  lines.push(`- Manifest and index agreement: ${report.checks.manifestIndexAgreement ? "passed" : "failed"}`);
  lines.push(`- Multiple-choice option sets rejected: ${report.checks.invalidMultipleChoiceOptions}`);
  lines.push(`- Prerequisite cycles: ${report.prerequisites.cycles.length}`);
  lines.push(`- Duplicate source records: ${report.counts.duplicateRecords}`);
  lines.push(`- Structural rejections: ${report.rejectedRecords.length}`);
  lines.push("");
  lines.push("## Archive integrity");
  lines.push("");
  lines.push(
    `- Actual \`manifest.json\` SHA-256: \`${report.archiveIntegrity.manifestSha256}\``,
  );
  lines.push(
    `- Actual \`content-index.json\` SHA-256: \`${report.archiveIntegrity.contentIndexSha256}\``,
  );
  lines.push(
    `- Recorded manifest SHA-256 in archive: \`${report.archiveIntegrity.recordedManifestSha256 ?? "not supplied"}\``,
  );
  lines.push(
    `- Recorded checksum matches actual manifest: ${report.archiveIntegrity.checksumMatchesRecorded ? "yes" : "no (documented, not rewritten)"}`,
  );
  lines.push("");
  lines.push("## Assessment schema variants");
  lines.push("");
  for (const [variant, count] of Object.entries(report.schemaVariants)) {
    lines.push(`- Schema \`${variant}\`: ${count} assessments`);
  }
  lines.push("");
  lines.push("## Question types");
  lines.push("");
  for (const [type, count] of Object.entries(report.questionTypes)) {
    lines.push(`- \`${type}\`: ${count}`);
  }
  lines.push("");
  if (report.rejectedRecords.length) {
    lines.push("## Rejected records and reasons");
    lines.push("");
    for (const item of report.rejectedRecords) {
      lines.push(`- **${item.kind} \`${item.id}\`** — ${item.reason}`);
    }
    lines.push("");
  } else {
    lines.push("No structurally invalid records were rejected.");
    lines.push("");
  }
  if (report.skippedRecords.length) {
    lines.push("## Skipped or normalised records");
    lines.push("");
    for (const item of report.skippedRecords) {
      lines.push(`- **${item.kind} \`${item.id}\`** — ${item.reason}`);
    }
    lines.push("");
  } else {
    lines.push("No records were skipped.");
    lines.push("");
  }
  lines.push("## Archive caveats");
  lines.push("");
  for (const caveat of report.curriculum.caveats) {
    lines.push(`- ${caveat}`);
  }
  lines.push("");
  lines.push("## Public/private split");
  lines.push("");
  lines.push(
    "`src/generated/curriculum.json` contains lesson Markdown, prompts and options, but no correct option ids, expected answers, rubrics, explanations or solution Markdown.",
  );
  lines.push(
    "`supabase/seed.sql` contains the private grading material and must only be applied to the database. It is not imported by the frontend bundle.",
  );
  lines.push("");
  return `${lines.join("\n")}\n`;
}

export function main() {
  const args = new Set(process.argv.slice(2));
  const sourceArgIndex = process.argv.indexOf("--source");
  const source = sourceArgIndex >= 0 ? process.argv[sourceArgIndex + 1] : DEFAULT_SOURCE;
  const result = importCurriculum(source);
  if (args.has("--check")) {
    console.log(JSON.stringify(result.report, null, 2));
    return;
  }
  const outputs = writeOutputs(result);
  console.log(
    JSON.stringify(
      {
        imported: result.report.counts.imported,
        rejected: result.report.counts.rejected,
        skipped: result.report.counts.skipped,
        outputs,
      },
      null,
      2,
    ),
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
