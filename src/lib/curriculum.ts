import rawCurriculum from "../generated/curriculum.json";
import type {
  Assessment,
  Challenge,
  CurriculumModule,
  LearningPath,
  Lesson,
  MapNode,
  PathArtKey,
  SystemCard,
} from "../types";

interface RawPath {
  id: string;
  title: string;
  tier: string;
  position: number;
  moduleIds: string[];
  lessonIds: string[];
}

interface RawModule {
  id: string;
  title: string;
  pathId: string;
  position: number;
  lessonIds: string[];
}

interface RawLesson {
  id: string;
  title: string;
  moduleId: string;
  pathId: string;
  scope: string;
  classification: string;
  prerequisites: string[];
  contentMarkdown: string;
  estimatedMinutes: number;
  durationLabel: string;
  sourceFile: string;
  assessmentId: string | null;
  solutionAvailable: boolean;
  position: number;
  modulePosition: number;
}

interface CurriculumData {
  meta: {
    generatedAt: string;
    source: string;
    manifestSha256: string;
    counts: {
      paths: number;
      modules: number;
      lessons: number;
      assessments: number;
      solutions: number;
      questions: number;
      multipleChoiceQuestions: number;
      freeResponseQuestions: number;
    };
    caveats: string[];
  };
  paths: RawPath[];
  modules: RawModule[];
  lessons: RawLesson[];
  assessments: Assessment[];
}

export const curriculum = rawCurriculum as unknown as CurriculumData;

const artOrder: PathArtKey[] = [
  "architecture",
  "environment",
  "git",
  "network",
];

const shortLabels: Record<string, string> = {
  "path-comp-foundations": "Computing & OS",
  "path-dev-toolchain": "Dev Environment",
  "path-git-collab": "Git & Collaboration",
  "path-net-comms": "Networking",
  "path-web-arch": "Web Architecture",
  "path-web-frontend": "Frontend",
  "path-backend-apis": "Backend & APIs",
  "path-db-sql": "Databases & SQL",
  "path-orm-data-access": "ORMs & Data Access",
  "path-sys-design": "System Design",
  "path-app-security": "Security",
  "path-testing-quality": "Testing & Quality",
  "path-deploy-infra": "Deploy & Infra",
  "path-ops-sre": "Operations & SRE",
  "path-dist-systems": "Distributed Systems",
  "path-data-engineering": "Data Engineering",
  "path-specializations": "Specializations",
};

const tierNames: Record<string, string> = {
  "Tier 1 - Foundations": "Foundations",
  "Tier 2 - Core Application Engineering": "Core Application Engineering",
  "Tier 3 - Production Engineering": "Production Engineering",
  "Tier 4 - Scaling & Specializations": "Scaling & Specializations",
};

const mapLabels: Record<string, string> = {
  "path-comp-foundations": "Computing",
  "path-dev-toolchain": "Toolchain",
  "path-git-collab": "Git",
  "path-net-comms": "Networking",
  "path-web-arch": "Web arch",
  "path-web-frontend": "Frontend",
  "path-backend-apis": "Backend",
  "path-db-sql": "Databases",
  "path-orm-data-access": "ORMs",
  "path-sys-design": "Sys design",
  "path-app-security": "Security",
  "path-testing-quality": "Testing",
  "path-deploy-infra": "Deploy",
  "path-ops-sre": "Ops & SRE",
  "path-dist-systems": "Distributed",
  "path-data-engineering": "Data eng",
  "path-specializations": "Specialize",
};

const lessonById = new Map(curriculum.lessons.map((lesson) => [lesson.id, lesson]));
const moduleById = new Map(curriculum.modules.map((module) => [module.id, module]));
const pathById = new Map(curriculum.paths.map((path) => [path.id, path]));
const assessmentByLessonId = new Map(
  curriculum.assessments.map((assessment) => [assessment.lessonId, assessment]),
);
const assessmentById = new Map(
  curriculum.assessments.map((assessment) => [assessment.id, assessment]),
);

const sortedModules = [...curriculum.modules].sort((a, b) => a.position - b.position);
const sortedLessons = [...curriculum.lessons].sort((a, b) => a.position - b.position);
const sortedPaths = [...curriculum.paths].sort((a, b) => a.position - b.position);

const searchIndex = sortedLessons.map((lesson) => {
  const path = pathById.get(lesson.pathId);
  return {
    lesson,
    title: lesson.title.toLowerCase(),
    scope: lesson.scope.toLowerCase(),
    content: lesson.contentMarkdown.toLowerCase(),
    path: (path?.title ?? "").toLowerCase(),
    prerequisites: lesson.prerequisites.join(" ").toLowerCase(),
  };
});

export const curriculumStats = curriculum.meta.counts;
export const curriculumCaveats = curriculum.meta.caveats;

export function getPathMapLabel(pathId: string): string {
  const path = pathById.get(pathId);
  return mapLabels[pathId] ?? path?.title ?? pathId;
}

export function pathMatchesSearch(pathId: string, query: string): boolean {
  const term = query.trim().toLowerCase();
  if (!term) return true;
  const path = pathById.get(pathId);
  if (!path) return false;
  if (path.title.toLowerCase().includes(term)) return true;
  if (path.tier.toLowerCase().includes(term)) return true;
  return searchIndex.some(
    (entry) =>
      entry.lesson.pathId === pathId &&
      (entry.title.includes(term) ||
        entry.scope.includes(term) ||
        entry.content.includes(term)),
  );
}

export function lessonMatchesSearch(lessonId: string, query: string): boolean {
  const term = query.trim().toLowerCase();
  if (!term) return true;
  const entry = searchIndex.find((item) => item.lesson.id === lessonId);
  if (!entry) return false;
  return (
    entry.title.includes(term) ||
    entry.scope.includes(term) ||
    entry.path.includes(term) ||
    entry.content.includes(term)
  );
}

export function getLesson(lessonId: string): RawLesson | undefined {
  return lessonById.get(lessonId);
}

export function getPath(pathId: string): RawPath | undefined {
  return pathById.get(pathId);
}

export function getModule(moduleId: string): RawModule | undefined {
  return moduleById.get(moduleId);
}

export function getAssessment(assessmentId: string): Assessment | undefined {
  return assessmentById.get(assessmentId);
}

export function getAssessmentForLesson(lessonId: string): Assessment | undefined {
  return assessmentByLessonId.get(lessonId);
}

export function getSortedLessons(): RawLesson[] {
  return sortedLessons;
}

export function getSortedPaths(): RawPath[] {
  return sortedPaths;
}

export function getSortedModules(): RawModule[] {
  return sortedModules;
}

export function getPathLessons(pathId: string): RawLesson[] {
  return sortedLessons.filter((lesson) => lesson.pathId === pathId);
}

export function getPathModules(pathId: string): RawModule[] {
  return sortedModules.filter((module) => module.pathId === pathId);
}

export function buildUiPaths(completedLessonIds: Iterable<string>): LearningPath[] {
  const completed = new Set(completedLessonIds);
  return sortedPaths.map((path, index) => {
    const lessons: Lesson[] = getPathLessons(path.id).map((lesson) => ({
      ...lesson,
      completed: completed.has(lesson.id),
      duration: lesson.durationLabel,
    }));
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter((lesson) => lesson.completed).length;
    const modules: CurriculumModule[] = getPathModules(path.id).map((module) => ({
      ...module,
      lessonIds: module.lessonIds.filter((lessonId) => lessonById.has(lessonId)),
    }));
    const status =
      totalLessons > 0 && completedLessons === totalLessons
        ? "Completed"
        : completedLessons > 0
          ? "In Progress"
          : "Not Started";
    return {
      id: path.id,
      title: path.title,
      blurb: `${path.tier} · ${modules.length} modules · ${totalLessons} lessons`,
      status,
      completedLessons,
      totalLessons,
      art: artOrder[index % artOrder.length],
      lessons,
      modules,
      tier: path.tier,
    };
  });
}

export function findUiPath(paths: LearningPath[], pathId: string): LearningPath | undefined {
  return paths.find((path) => path.id === pathId);
}

export function findUiLesson(paths: LearningPath[], lessonId: string): {
  path: LearningPath;
  lesson: Lesson;
} | null {
  for (const path of paths) {
    const lesson = path.lessons.find((item) => item.id === lessonId);
    if (lesson) return { path, lesson };
  }
  return null;
}

export function missingPrerequisites(
  lessonId: string,
  completedLessonIds: Iterable<string>,
): string[] {
  const completed = new Set(completedLessonIds);
  const lesson = lessonById.get(lessonId);
  if (!lesson) return [];
  return lesson.prerequisites.filter((prerequisite) => !completed.has(prerequisite));
}

export function arePrerequisitesMet(
  lessonId: string,
  completedLessonIds: Iterable<string>,
): boolean {
  return missingPrerequisites(lessonId, completedLessonIds).length === 0;
}

export function prerequisitesFor(lessonId: string): Array<{ id: string; title: string }> {
  const lesson = lessonById.get(lessonId);
  if (!lesson) return [];
  return lesson.prerequisites
    .map((id) => lessonById.get(id))
    .filter((item): item is RawLesson => Boolean(item))
    .map((item) => ({ id: item.id, title: item.title }));
}

export interface LessonNeighbours {
  previous: Lesson | null;
  next: Lesson | null;
  path: LearningPath;
}

export function getLessonNeighbours(
  paths: LearningPath[],
  lessonId: string,
): LessonNeighbours | null {
  for (const path of paths) {
    const index = path.lessons.findIndex((lesson) => lesson.id === lessonId);
    if (index >= 0) {
      return {
        previous: index > 0 ? path.lessons[index - 1] : null,
        next: index < path.lessons.length - 1 ? path.lessons[index + 1] : null,
        path,
      };
    }
  }
  return null;
}

export function buildMapGraph(paths: LearningPath[]): {
  nodes: MapNode[];
  connections: Array<[string, string]>;
} {
  const tiers = [...new Set(sortedPaths.map((path) => path.tier))];
  const groups = tiers.map((tier) => sortedPaths.filter((path) => path.tier === tier));
  const nodes: MapNode[] = [];
  const activePathId = sortedPaths.find((path) => {
    const ui = paths.find((item) => item.id === path.id);
    return ui ? ui.status !== "Completed" : false;
  })?.id;

  groups.forEach((group, tierIndex) => {
    group.forEach((path, pathIndex) => {
      const ui = paths.find((item) => item.id === path.id);
      const completedLessons = ui?.completedLessons ?? 0;
      const totalLessons = ui?.totalLessons ?? getPathLessons(path.id).length;
      const status: MapNode["status"] =
        totalLessons > 0 && completedLessons === totalLessons
          ? "done"
          : path.id === activePathId || completedLessons > 0
            ? "active"
            : "locked";
      nodes.push({
        id: path.id,
        pathId: path.id,
        label: mapLabels[path.id] ?? shortLabels[path.id] ?? path.title,
        tier: path.tier,
        status,
        x: 12 + (group.length === 1 ? 38 : (76 / (group.length - 1)) * pathIndex),
        y: 14 + tierIndex * 23,
        completedLessons,
        totalLessons,
      });
    });
  });

  const edges = new Set<string>();
  const connections: Array<[string, string]> = [];
  for (const lesson of sortedLessons) {
    for (const prerequisite of lesson.prerequisites) {
      const prerequisiteLesson = lessonById.get(prerequisite);
      if (!prerequisiteLesson || prerequisiteLesson.pathId === lesson.pathId) continue;
      const key = `${prerequisiteLesson.pathId}->${lesson.pathId}`;
      if (!edges.has(key)) {
        edges.add(key);
        connections.push([prerequisiteLesson.pathId, lesson.pathId]);
      }
    }
  }

  return { nodes, connections };
}

export function compactMap(
  nodes: MapNode[],
  connections: Array<[string, string]>,
  limit = 8,
): { nodes: MapNode[]; connections: Array<[string, string]> } {
  const preferred = [
    ...nodes.filter((node) => node.status === "active"),
    ...nodes.filter((node) => node.status === "done"),
    ...nodes.filter((node) => node.status === "locked"),
  ].slice(0, limit);
  const ids = new Set(preferred.map((node) => node.id));
  const selected = nodes.filter((node) => ids.has(node.id));
  return {
    nodes: selected,
    connections: connections.filter(([from, to]) => ids.has(from) && ids.has(to)),
  };
}

export interface SearchHit {
  kind: "path" | "lesson";
  path: LearningPath;
  lesson?: Lesson;
}

export function searchCurriculum(
  query: string,
  paths: LearningPath[],
  limit = 8,
): SearchHit[] {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  const pathMap = new Map(paths.map((path) => [path.id, path]));
  const hits: Array<{ hit: SearchHit; rank: number }> = [];

  for (const path of paths) {
    const title = path.title.toLowerCase();
    if (title.includes(term)) {
      hits.push({ hit: { kind: "path", path }, rank: 0 });
    }
  }

  for (const entry of searchIndex) {
    const path = pathMap.get(entry.lesson.pathId);
    if (!path) continue;
    let rank = 99;
    if (entry.title.includes(term)) rank = 1;
    else if (entry.scope.includes(term)) rank = 2;
    else if (entry.path.includes(term)) rank = 3;
    else if (entry.content.includes(term)) rank = 4;
    if (rank < 99) {
      const lesson = path.lessons.find((item) => item.id === entry.lesson.id);
      if (lesson) hits.push({ hit: { kind: "lesson", path, lesson }, rank });
    }
    if (hits.length > 160) break;
  }

  return hits
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((item) => item.hit);
}

export function searchSnippet(lessonId: string, query: string): string {
  const lesson = lessonById.get(lessonId);
  const term = query.trim().toLowerCase();
  if (!lesson || !term) return lesson?.scope ?? "";
  const lower = lesson.contentMarkdown.toLowerCase();
  const index = lower.indexOf(term);
  if (index < 0) return lesson.scope;
  const start = Math.max(0, index - 70);
  const end = Math.min(lesson.contentMarkdown.length, index + term.length + 110);
  return `${start > 0 ? "…" : ""}${lesson.contentMarkdown
    .slice(start, end)
    .replace(/\s+/g, " ")
    .trim()}${end < lesson.contentMarkdown.length ? "…" : ""}`;
}

export function buildChallenges(
  paths: LearningPath[],
  attempts: Array<{ assessmentId: string; passed: boolean | null }>,
  completedLessonIds: Iterable<string>,
): Challenge[] {
  const passed = new Set(
    attempts.filter((attempt) => attempt.passed === true).map((attempt) => attempt.assessmentId),
  );
  const completed = new Set(completedLessonIds);

  return curriculum.assessments
    .map((assessment) => {
      const lesson = lessonById.get(assessment.lessonId);
      const path = lesson ? pathById.get(lesson.pathId) : undefined;
      const uiPath = path ? paths.find((item) => item.id === path.id) : undefined;
      if (!lesson || !path || !uiPath) return null;
      const autoGradableQuestions = assessment.questions.filter(
        (question) => question.autoGradable,
      ).length;
      if (autoGradableQuestions === 0) return null;
      const locked = lesson.prerequisites.some(
        (prerequisite) => !completed.has(prerequisite),
      );
      const level: Challenge["level"] =
        path.tier.startsWith("Tier 1")
          ? "Beginner"
          : path.tier.startsWith("Tier 2")
            ? "Intermediate"
            : "Advanced";
      return {
        id: `challenge-${assessment.id}`,
        title: lesson.title,
        description: lesson.scope,
        level,
        questions: assessment.questions.length,
        minutes: Math.max(5, Math.ceil(lesson.estimatedMinutes / 3)),
        status: passed.has(assessment.id)
          ? "Completed"
          : locked
            ? "Locked"
            : "Ready",
        lessonId: lesson.id,
        pathTitle: path.title,
        autoGradableQuestions,
        passingScorePercent: assessment.passingScorePercent,
      } satisfies Challenge;
    })
    .filter((challenge): challenge is Challenge => Boolean(challenge));
}

export function buildSystems(paths: LearningPath[]): SystemCard[] {
  const tiers = [...new Set(sortedPaths.map((path) => path.tier))];
  return tiers.map((tier, index) => {
    const tierPaths = paths.filter((path) => path.tier === tier);
    const moduleCount = tierPaths.reduce((sum, path) => sum + path.modules.length, 0);
    const lessonCount = tierPaths.reduce((sum, path) => sum + path.totalLessons, 0);
    const completedLessons = tierPaths.reduce(
      (sum, path) => sum + path.completedLessons,
      0,
    );
    return {
      id: `domain-${index + 1}`,
      name: tierNames[tier] ?? tier,
      role: "Curriculum domain",
      status: "Curriculum index",
      tier,
      detail: `${tierPaths.length} learning paths · ${moduleCount} modules · ${lessonCount} lessons`,
      pathIds: tierPaths.map((path) => path.id),
      moduleCount,
      lessonCount,
      completedLessons,
    };
  });
}

export const searchSuggestions = [
  "processes",
  "HTTP",
  "SQL",
  "Git",
  "authentication",
  "testing",
];
