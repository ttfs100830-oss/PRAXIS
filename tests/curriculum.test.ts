import { describe, expect, it } from "vitest";
import {
  buildChallenges,
  buildMapGraph,
  buildSystems,
  buildUiPaths,
  curriculum,
  curriculumStats,
  findUiLesson,
  getAssessmentForLesson,
  getPathLessons,
  getSortedPaths,
  missingPrerequisites,
  pathMatchesSearch,
  searchCurriculum,
} from "../src/lib/curriculum";

describe("bundled curriculum", () => {
  it("exposes the verified counts from the import", () => {
    expect(curriculumStats).toMatchObject({
      paths: 17,
      modules: 48,
      lessons: 166,
      assessments: 166,
      solutions: 166,
      questions: 830,
      multipleChoiceQuestions: 182,
      freeResponseQuestions: 648,
    });
    expect(curriculum.lessons).toHaveLength(166);
    expect(curriculum.assessments).toHaveLength(166);
    expect(getSortedPaths()).toHaveLength(17);
  });

  it("links every lesson to an assessment and preserves lesson Markdown", () => {
    for (const lesson of curriculum.lessons) {
      expect(lesson.contentMarkdown.trim().length).toBeGreaterThan(0);
      expect(getAssessmentForLesson(lesson.id)).toBeDefined();
    }
    expect(curriculum.lessons.every((lesson) => lesson.solutionAvailable)).toBe(
      true,
    );
  });

  it("does not include correct answers in the bundled assessment data", () => {
    for (const assessment of curriculum.assessments) {
      for (const question of assessment.questions) {
        expect(question).not.toHaveProperty("correctOptionId");
        expect(question).not.toHaveProperty("expectedAnswer");
        expect(question).not.toHaveProperty("explanation");
        for (const option of question.options) {
          expect(option).not.toHaveProperty("correct");
        }
      }
    }
  });
});

describe("learner projections", () => {
  it("starts every path at zero for a brand-new account", () => {
    const paths = buildUiPaths([]);
    expect(paths).toHaveLength(17);
    for (const path of paths) {
      expect(path.completedLessons).toBe(0);
      expect(path.status).toBe("Not Started");
      expect(path.lessons.every((lesson) => !lesson.completed)).toBe(true);
    }
  });

  it("returns Completed only when every lesson in a path is complete", () => {
    const target = getSortedPaths()[0];
    const lessonIds = getPathLessons(target.id).map((lesson) => lesson.id);
    const partiallyDone = buildUiPaths(lessonIds.slice(0, 1));
    expect(
      partiallyDone.find((path) => path.id === target.id)?.status,
    ).toBe("In Progress");

    const fullyDone = buildUiPaths(lessonIds);
    const path = fullyDone.find((item) => item.id === target.id);
    expect(path?.status).toBe("Completed");
    expect(path?.completedLessons).toBe(lessonIds.length);
  });

  it("enforces prerequisites from the supplied curriculum", () => {
    const lessonWithPrerequisite = curriculum.lessons.find(
      (lesson) => lesson.prerequisites.length > 0,
    );
    expect(lessonWithPrerequisite).toBeDefined();
    if (!lessonWithPrerequisite) return;
    expect(
      missingPrerequisites(lessonWithPrerequisite.id, []).length,
    ).toBe(lessonWithPrerequisite.prerequisites.length);
    expect(
      missingPrerequisites(
        lessonWithPrerequisite.id,
        lessonWithPrerequisite.prerequisites,
      ),
    ).toEqual([]);
  });

  it("finds lessons by id inside the UI projection", () => {
    const paths = buildUiPaths([]);
    const lesson = paths[3].lessons[0];
    const found = findUiLesson(paths, lesson.id);
    expect(found?.path.id).toBe(paths[3].id);
    expect(found?.lesson.title).toBe(lesson.title);
  });
});

describe("search and navigation", () => {
  it("searches real lesson bodies, not placeholder text", () => {
    const paths = buildUiPaths([]);
    const hits = searchCurriculum("HTTP", paths, 20);
    expect(hits.length).toBeGreaterThan(0);
    expect(
      hits.some((hit) => hit.kind === "lesson" || hit.kind === "path"),
    ).toBe(true);
    expect(pathMatchesSearch("path-net-comms", "HTTP")).toBe(true);
    expect(pathMatchesSearch("path-net-comms", "zzzz-no-match")).toBe(false);
  });

  it("builds a 17-node map with deduplicated cross-path edges", () => {
    const paths = buildUiPaths([]);
    const graph = buildMapGraph(paths);
    expect(graph.nodes).toHaveLength(17);
    expect(graph.connections.length).toBeGreaterThan(0);
    const keys = graph.connections.map(([from, to]) => `${from}->${to}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const [from, to] of graph.connections) {
      expect(graph.nodes.some((node) => node.id === from)).toBe(true);
      expect(graph.nodes.some((node) => node.id === to)).toBe(true);
    }
  });

  it("groups the curriculum into four tier domains", () => {
    const paths = buildUiPaths([]);
    const systems = buildSystems(paths);
    expect(systems).toHaveLength(4);
    expect(systems.reduce((sum, item) => sum + item.pathIds.length, 0)).toBe(17);
    expect(systems.every((item) => item.lessonCount > 0)).toBe(true);
  });

  it("only exposes auto-graded lessons as challenges", () => {
    const paths = buildUiPaths([]);
    const challenges = buildChallenges(paths, [], []);
    expect(challenges.length).toBeGreaterThan(0);
    expect(challenges.every((item) => item.autoGradableQuestions > 0)).toBe(true);
    expect(challenges.some((item) => item.status === "Ready")).toBe(true);
    expect(challenges.some((item) => item.status === "Locked")).toBe(true);
  });
});
