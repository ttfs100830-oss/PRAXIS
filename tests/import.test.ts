import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_SOURCE,
  importCurriculum,
  sqlLiteral,
} from "../scripts/import-curriculum.mjs";

const result = importCurriculum(DEFAULT_SOURCE);
const publicCurriculum = result.publicCurriculum;

const PRIVATE_QUESTION_KEYS = [
  "correctOptionId",
  "correct_option_id",
  "expectedAnswer",
  "expected_answer",
  "explanation",
  "gradingRubric",
  "grading_rubric",
];

describe("curriculum importer", () => {
  it("imports every structurally valid record from the archive", () => {
    expect(result.report.counts.imported).toMatchObject({
      paths: 17,
      modules: 48,
      lessons: 166,
      assessments: 166,
      solutions: 166,
      questions: 830,
      options: 728,
      prerequisites: 228,
    });
    expect(result.report.counts.rejected).toMatchObject({
      paths: 0,
      modules: 0,
      lessons: 0,
      assessments: 0,
      solutions: 0,
      questions: 0,
    });
    expect(result.report.counts.skipped).toMatchObject({
      paths: 0,
      modules: 0,
      lessons: 0,
      assessments: 0,
      solutions: 0,
      questions: 0,
    });
  });

  it("records the supplied schema variants and question types", () => {
    expect(result.report.schemaVariants).toEqual({
      v2: 19,
      v1: 48,
      "legacy-free-response": 99,
    });
    expect(result.report.questionTypes).toEqual({
      multiple_choice: 182,
      short_answer: 274,
      scenario: 118,
      practical: 58,
      application: 99,
      debugging: 99,
    });
  });

  it("reports structural integrity checks without hiding archive caveats", () => {
    expect(result.report.checks).toMatchObject({
      manifestIndexAgreement: true,
      missingLessonFiles: 0,
      missingAssessmentFiles: 0,
      missingSolutionFiles: 0,
      invalidMultipleChoiceOptions: 0,
    });
    expect(result.report.archiveIntegrity.checksumMatchesRecorded).toBe(false);
    expect(result.report.archiveIntegrity.manifestSha256).toHaveLength(64);
    expect(publicCurriculum.meta.caveats.length).toBeGreaterThan(0);
  });

  it("never publishes private grading data in the browser bundle", () => {
    const serialised = JSON.stringify(publicCurriculum);
    for (const key of PRIVATE_QUESTION_KEYS) {
      expect(serialised).not.toContain(`"${key}"`);
    }
    expect(serialised).not.toContain("answer_keys");
    expect(serialised).not.toContain("lesson_solutions");
    for (const assessment of publicCurriculum.assessments) {
      for (const question of assessment.questions) {
        expect(question).not.toHaveProperty("correctOptionId");
        expect(question).not.toHaveProperty("expectedAnswer");
      }
    }
  });

  it("keeps private answer keys and solutions in the database seed", () => {
    expect(result.sql).toContain("insert into public.answer_keys");
    expect(result.sql).toContain("insert into public.lesson_solutions");
    expect(result.sql).toContain("on conflict (id) do update");
    expect(result.sql).not.toMatch(/service_role|SUPABASE_SERVICE_ROLE/i);
    expect(result.sql).not.toMatch(/sb_secret_/);
    expect(result.sql.length).toBeGreaterThan(1_000_000);
  });

  it("writes an idempotent seed with escaped SQL literals", () => {
    expect(sqlLiteral("O'Brien")).toBe("'O''Brien'");
    expect(sqlLiteral(null)).toBe("null");
    expect(sqlLiteral(42)).toBe("'42'");
    expect(sqlLiteral("two 'quotes'")).toBe("'two ''quotes'''");
  });

  it("produces the same output for the same source", () => {
    const second = importCurriculum(DEFAULT_SOURCE);
    expect(second.report.counts.imported).toEqual(result.report.counts.imported);
    expect(second.publicCurriculum.paths.map((item: { id: string }) => item.id)).toEqual(
      publicCurriculum.paths.map((item) => item.id),
    );
    expect(second.sql.length).toBeGreaterThan(1_000_000);
    expect(fs.existsSync(path.join(DEFAULT_SOURCE, "manifest.json"))).toBe(true);
  });
});
