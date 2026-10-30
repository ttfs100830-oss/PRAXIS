import { useEffect, useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  HelpCircle,
  Layers3,
  ListChecks,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import type {
  Activity,
  AssessmentAttempt,
  AssessmentReview,
  Challenge,
  Discussion,
  DiscussionReply,
  LearningPath,
  Lesson,
  MapNode,
  SystemCard,
} from "../../types";
import {
  curriculumCaveats,
  curriculumStats,
  getAssessment,
  getAssessmentForLesson,
  getPath,
  getPathModules,
  missingPrerequisites,
} from "../../lib/curriculum";
import { useLearner } from "../../context/LearnerContext";
import { createReply, fetchAttemptReview, fetchDiscussionThread } from "../../lib/api";
import { formatDate, formatRelativeTime, percent } from "../../lib/format";
import { Modal } from "../ui/Modal";
import { PathArt } from "../illustrations/PathArt";

/* ---------------------------------------------------------------- Path ---- */

interface PathDetailModalProps {
  path: LearningPath;
  onClose: () => void;
  onOpenLesson: (path: LearningPath, lesson: Lesson) => void;
}

const statusTone = (status: LearningPath["status"]): string => {
  if (status === "Completed") return "bg-forest-800 text-cream-50";
  if (status === "In Progress") return "bg-rust-500 text-cream-50";
  return "bg-[#e5e9da] text-forest-800";
};

export function PathDetailModal({
  path,
  onClose,
  onOpenLesson,
}: PathDetailModalProps) {
  const { completedLessonIds } = useLearner();
  const completion = percent(path.completedLessons, path.totalLessons);
  const nextLesson =
    path.lessons.find(
      (lesson) =>
        !lesson.completed &&
        missingPrerequisites(lesson.id, completedLessonIds).length === 0,
    ) ?? path.lessons.find((lesson) => !lesson.completed) ?? path.lessons[0];

  return (
    <Modal
      open
      onClose={onClose}
      title={path.title}
      eyebrow="Learning path"
      size="lg"
    >
      <div className="flex items-center gap-4 rounded-xl border border-sand/80 bg-cream-100/70 p-3.5">
        <div className="hidden h-[74px] w-[112px] shrink-0 items-center justify-center rounded-lg sm:flex">
          <PathArt variant={path.art} className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${statusTone(path.status)}`}
            >
              {path.status}
            </span>
            <span className="text-[11px] text-muted">
              {path.completedLessons} of {path.totalLessons} lessons · your
              progress
            </span>
          </div>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-cream-300"
            role="progressbar"
            aria-label={`${path.title} progress`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={completion}
          >
            <div
              className="h-full rounded-full bg-forest-800"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10.5px] text-muted">{completion}% complete</p>
        </div>
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
        {path.tier} · {path.modules.length} modules · {path.totalLessons} lessons.
        Lessons marked with a lock are waiting on their prerequisite lessons.
      </p>

      <div className="mt-5 flex items-center justify-between">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-forest-800">
          Modules and lessons
        </h3>
        <span className="text-[10px] text-muted">
          {path.completedLessons} / {path.totalLessons} complete
        </span>
      </div>

      <div className="mt-2 space-y-3">
        {path.modules.map((module) => {
          const lessons = path.lessons.filter(
            (lesson) => lesson.moduleId === module.id,
          );
          return (
            <section
              key={module.id}
              className="rounded-xl border border-sand/80 bg-cream-100/40 p-2.5"
            >
              <div className="flex items-center justify-between gap-3 px-1.5 pb-1.5">
                <h4 className="truncate text-[11.5px] font-semibold text-forest-900">
                  {module.title}
                </h4>
                <span className="shrink-0 text-[10px] text-muted">
                  {lessons.filter((lesson) => lesson.completed).length} /{" "}
                  {lessons.length}
                </span>
              </div>
              <ul className="space-y-1">
                {lessons.map((lesson) => {
                  const missing = missingPrerequisites(
                    lesson.id,
                    completedLessonIds,
                  );
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        onClick={() => onOpenLesson(path, lesson)}
                        className="group flex w-full items-center gap-3 rounded-lg border border-transparent bg-cream-50/80 px-2.5 py-2 text-left transition-colors hover:border-sand hover:bg-cream-50"
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                            lesson.completed
                              ? "bg-forest-700 text-cream-50"
                              : missing.length > 0
                                ? "border border-sand bg-cream-100 text-muted"
                                : "border border-sand bg-cream-50 text-muted"
                          }`}
                        >
                          {lesson.completed ? (
                            <Check size={12} strokeWidth={2.6} />
                          ) : missing.length > 0 ? (
                            <LockKeyhole size={11} />
                          ) : (
                            <Play size={10} className="-ml-px" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] font-medium text-ink">
                            {lesson.title}
                          </span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted">
                            <Clock3 size={10} /> {lesson.duration}
                            {lesson.completed && (
                              <span className="text-forest-600">· completed</span>
                            )}
                            {!lesson.completed && missing.length > 0 && (
                              <span className="text-[#9a6b3f]">
                                · {missing.length} prerequisite
                                {missing.length === 1 ? "" : "s"} missing
                              </span>
                            )}
                            {lesson.assessmentId && (
                              <span className="flex items-center gap-1">
                                · <ListChecks size={10} /> assessment
                              </span>
                            )}
                          </span>
                        </span>
                        <ArrowRight
                          size={13}
                          className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-forest-800"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 border-t border-sand/80 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10.5px] leading-relaxed text-muted">
          Lesson bodies, assessments and solutions come from the imported
          TechStructure curriculum.
        </p>
        {nextLesson && (
          <button
            type="button"
            onClick={() => onOpenLesson(path, nextLesson)}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full bg-forest-900 px-4 text-[11.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800"
          >
            <Play size={12} />
            {path.completedLessons > 0 ? "Continue path" : "Open first lesson"}
          </button>
        )}
      </div>
    </Modal>
  );
}

/* --------------------------------------------------------------- Node ----- */

interface ConceptModalProps {
  node: MapNode;
  onClose: () => void;
  onOpenPath: (pathId: string) => void;
}

export function ConceptModal({
  node,
  onClose,
  onOpenPath,
}: ConceptModalProps) {
  const { paths, completedLessonIds } = useLearner();
  const path = paths.find((item) => item.id === node.pathId);
  const rawPath = getPath(node.pathId);
  const modules = path?.modules ?? getPathModules(node.pathId);
  const completion = percent(node.completedLessons, node.totalLessons);
  const prerequisites = path
    ? Array.from(
        new Set(
          path.lessons.flatMap((lesson) =>
            lesson.prerequisites.filter(
              (prerequisite) =>
                !path.lessons.some((item) => item.id === prerequisite),
            ),
          ),
        ),
      )
    : [];
  const prerequisiteLessons = prerequisites
    .map((id) => {
      const owner = paths.find((item) =>
        item.lessons.some((lesson) => lesson.id === id),
      );
      return owner?.lessons.find((lesson) => lesson.id === id);
    })
    .filter((lesson): lesson is Lesson => Boolean(lesson));
  const completedPrerequisites = prerequisiteLessons.filter((lesson) =>
    completedLessonIds.has(lesson.id),
  ).length;

  return (
    <Modal
      open
      onClose={onClose}
      title={path?.title ?? rawPath?.title ?? node.label}
      eyebrow={`Learning map · ${path?.tier ?? node.tier}`}
      size="md"
    >
      <div className="rounded-xl border border-sand/80 bg-cream-100/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-rust-500">
            Path progress
          </p>
          <span className="text-[10.5px] text-muted">
            {node.completedLessons} / {node.totalLessons} lessons
          </span>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-cream-300"
          role="progressbar"
          aria-label={`${node.label} completion`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completion}
        >
          <div
            className="h-full rounded-full bg-forest-800"
            style={{ width: `${completion}%` }}
          />
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-[#4f5f51]">
          {path
            ? `${path.modules.length} modules covering ${path.totalLessons} lessons. Select a lesson from the path overview to read it and work through its assessment.`
            : "This path is present in the bundled curriculum but not in the current learner state."}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-sand/80 bg-cream-50 px-3 py-2.5">
          <p className="text-[9.5px] uppercase tracking-[0.1em] text-muted">
            Modules
          </p>
          <p className="mt-0.5 text-[15px] font-semibold text-forest-900">
            {modules.length}
          </p>
        </div>
        <div className="rounded-lg border border-sand/80 bg-cream-50 px-3 py-2.5">
          <p className="text-[9.5px] uppercase tracking-[0.1em] text-muted">
            Prerequisites met
          </p>
          <p className="mt-0.5 text-[15px] font-semibold text-forest-900">
            {prerequisiteLessons.length === 0
              ? "No cross-path prerequisites"
              : `${completedPrerequisites} / ${prerequisiteLessons.length}`}
          </p>
        </div>
      </div>

      {prerequisiteLessons.length > 0 && (
        <div className="mt-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">
            Paths that feed into this one
          </p>
          <ul className="mt-2 space-y-1.5">
            {prerequisiteLessons.map((lesson) => {
              const done = completedLessonIds.has(lesson.id);
              return (
                <li
                  key={lesson.id}
                  className="flex items-start gap-2 rounded-lg border border-sand/70 bg-cream-50 px-2.5 py-2 text-[11px] leading-snug text-[#576456]"
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                      done
                        ? "bg-forest-700 text-cream-50"
                        : "border border-sand bg-cream-100"
                    }`}
                  >
                    {done && <Check size={9} strokeWidth={3} />}
                  </span>
                  <span>
                    <span className="block font-medium text-ink">
                      {lesson.title}
                    </span>
                    <span className="text-[10px] text-muted">
                      {done ? "Completed" : "Required before this path's lessons"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {modules.length > 0 && (
        <div className="mt-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">
            Modules
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {modules.map((module) => (
              <span
                key={module.id}
                className="rounded-full border border-sand bg-cream-50 px-2.5 py-1 text-[10.5px] text-forest-800"
              >
                {module.title}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-sand/80 pt-4">
        <p className="text-[10.5px] text-muted">
          Completion is stored on your account.
        </p>
        <button
          type="button"
          onClick={() => onOpenPath(node.pathId)}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-forest-900 px-4 text-[11.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800"
        >
          Open path overview
          <ArrowRight size={12} />
        </button>
      </div>
    </Modal>
  );
}

/* ----------------------------------------------------------- Challenge ---- */

interface ChallengeModalProps {
  challenge: Challenge;
  onClose: () => void;
  onBegin: (challenge: Challenge) => void;
}

export function ChallengeModal({
  challenge,
  onClose,
  onBegin,
}: ChallengeModalProps) {
  const assessment = getAssessmentForLesson(challenge.lessonId);
  const multipleChoice =
    assessment?.questions.filter((question) => question.autoGradable).length ?? 0;
  const written =
    assessment?.questions.filter((question) => !question.autoGradable).length ?? 0;
  const locked = challenge.status === "Locked";

  return (
    <Modal
      open
      onClose={onClose}
      title={challenge.title}
      eyebrow={`${challenge.pathTitle} · Challenge`}
      size="md"
    >
      <div className="flex flex-wrap gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-cream-200/80 px-2.5 py-1 text-[10.5px] text-forest-800">
          <Trophy size={11} className="text-[#a97634]" />
          {challenge.level}
        </span>
        <span className="rounded-full bg-cream-200/80 px-2.5 py-1 text-[10.5px] text-forest-800">
          {challenge.questions} questions
        </span>
        <span className="rounded-full bg-cream-200/80 px-2.5 py-1 text-[10.5px] text-forest-800">
          Pass {challenge.passingScorePercent}%
        </span>
        <span className="rounded-full border border-sand px-2.5 py-1 text-[10.5px] text-muted">
          {challenge.status}
        </span>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-muted">
        {challenge.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-sand/80 bg-cream-100/60 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.1em] text-muted">
            <CheckCircle2 size={11} /> Auto-graded
          </p>
          <p className="mt-0.5 text-[15px] font-semibold text-forest-900">
            {multipleChoice} question{multipleChoice === 1 ? "" : "s"}
          </p>
        </div>
        <div className="rounded-lg border border-sand/80 bg-cream-100/60 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.1em] text-muted">
            <FileText size={11} /> Written review
          </p>
          <p className="mt-0.5 text-[15px] font-semibold text-forest-900">
            {written} question{written === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <p className="mt-3 rounded-lg bg-cream-100/70 px-3 py-2.5 text-[11px] leading-relaxed text-[#6d6a58]">
        Multiple-choice answers are checked by trusted database logic. Written
        answers are stored and shown beside the curriculum's model answer and
        rubric — PRAXIS does not claim automated semantic grading.
      </p>

      {locked && (
        <p className="mt-3 flex items-start gap-2 rounded-lg border border-[#e6cfae] bg-[#f8eedf] px-3 py-2.5 text-[11px] leading-relaxed text-[#715c3d]">
          <LockKeyhole size={13} className="mt-0.5 shrink-0" />
          This challenge is locked because the lesson still has incomplete
          prerequisites. Open the lesson to see what comes first.
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-sand/80 pt-4">
        <p className="text-[10.5px] text-muted">
          {challenge.autoGradableQuestions} auto-graded · about{" "}
          {challenge.minutes} min
        </p>
        <button
          type="button"
          onClick={() => onBegin(challenge)}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-forest-900 px-4 text-[11.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800"
        >
          {locked ? "Open lesson" : challenge.status === "Completed" ? "Review challenge" : "Begin challenge"}
          <ArrowRight size={12} />
        </button>
      </div>
    </Modal>
  );
}

/* -------------------------------------------------------------- System ---- */

interface SystemModalProps {
  system: SystemCard;
  onClose: () => void;
  onOpenPath: (pathId: string) => void;
}

export function SystemModal({
  system,
  onClose,
  onOpenPath,
}: SystemModalProps) {
  const { paths } = useLearner();
  const domainPaths = paths.filter((path) => system.pathIds.includes(path.id));

  return (
    <Modal
      open
      onClose={onClose}
      title={system.name}
      eyebrow="System Explorer · Curriculum domain"
      size="md"
    >
      <div className="rounded-xl border border-sand/80 bg-cream-100/60 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8ecdd] text-forest-700">
            <Layers3 size={20} strokeWidth={1.7} />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-medium text-ink">{system.tier}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
              {system.detail} · {system.completedLessons} lessons completed
            </p>
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {domainPaths.map((path) => {
          const completion = percent(
            path.completedLessons,
            path.totalLessons,
          );
          return (
            <li key={path.id}>
              <button
                type="button"
                onClick={() => onOpenPath(path.id)}
                className="group flex w-full items-center gap-3 rounded-xl border border-sand/80 bg-cream-50 px-3 py-2.5 text-left transition-colors hover:border-forest-300 hover:bg-cream-100"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e8ecdd] text-forest-700">
                  <BookOpen size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-medium text-ink">
                    {path.title}
                  </span>
                  <span className="mt-0.5 block text-[10.5px] text-muted">
                    {path.modules.length} modules · {path.totalLessons} lessons ·{" "}
                    {completion}% complete
                  </span>
                </span>
                <ArrowRight
                  size={13}
                  className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-forest-800"
                />
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 flex items-start gap-2 text-[10.5px] leading-relaxed text-muted">
        <ShieldCheck size={12} className="mt-0.5 shrink-0" />
        This explorer groups the real curriculum paths by tier. It does not run
        live infrastructure simulations.
      </p>

      <div className="mt-5 flex justify-end border-t border-sand/80 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-sand bg-cream-50 px-4 text-[11.5px] font-medium text-forest-800 transition-colors hover:bg-cream-100"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------ Activity ---- */

interface ActivityModalProps {
  activity: Activity;
  onClose: () => void;
  onOpenProgress: () => void;
  onOpenLesson: (lessonId: string) => void;
}

export function ActivityModal({
  activity,
  onClose,
  onOpenProgress,
  onOpenLesson,
}: ActivityModalProps) {
  const Icon =
    activity.kind === "achievement"
      ? Trophy
      : activity.kind === "quiz"
        ? ListChecks
        : activity.kind === "started"
          ? Play
          : Check;

  return (
    <Modal
      open
      onClose={onClose}
      title={activity.title}
      eyebrow="Activity detail"
      size="md"
    >
      <div className="flex items-center gap-3 rounded-xl border border-sand/80 bg-cream-100/60 p-4">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-cream-50 ${
            activity.kind === "quiz" || activity.kind === "achievement"
              ? "bg-rust-500"
              : "bg-forest-700"
          }`}
        >
          <Icon size={17} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-ink">{activity.detail}</p>
          <p className="mt-0.5 text-[10.5px] text-muted">
            {activity.time}
            {typeof activity.xpDelta === "number" && activity.xpDelta !== 0
              ? ` · ${activity.xpDelta > 0 ? "+" : ""}${activity.xpDelta} XP`
              : ""}
          </p>
        </div>
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
        This event was recorded by the database when you completed a lesson,
        submitted an assessment or unlocked an achievement. It is part of your
        private account timeline.
      </p>

      {activity.occurredAt && (
        <p className="mt-2 text-[10.5px] text-muted">
          Recorded {formatDate(activity.occurredAt)} ·{" "}
          {new Date(activity.occurredAt).toLocaleTimeString()}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-sand/80 pt-4">
        <button
          type="button"
          onClick={onOpenProgress}
          className="inline-flex h-9 items-center gap-2 rounded-full border border-sand bg-cream-50 px-4 text-[11px] font-medium text-forest-800 transition-colors hover:bg-cream-100"
        >
          View progress overview
        </button>
        {activity.lessonId && (
          <button
            type="button"
            onClick={() => onOpenLesson(activity.lessonId as string)}
            className="inline-flex h-9 items-center gap-2 rounded-full bg-forest-900 px-4 text-[11.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800"
          >
            Open lesson
            <ArrowRight size={12} />
          </button>
        )}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------- Attempt review ---- */

interface AttemptReviewModalProps {
  attempt: AssessmentAttempt;
  onClose: () => void;
}

export function AttemptReviewModal({
  attempt,
  onClose,
}: AttemptReviewModalProps) {
  const [review, setReview] = useState<AssessmentReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchAttemptReview(attempt.id)
      .then((data) => {
        if (active) setReview(data);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load this attempt.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [attempt.id]);

  const assessment = getAssessment(attempt.assessmentId);
  const questions = review?.questions ?? [];

  const optionText = (questionId: string, optionId: string | null) => {
    if (!optionId) return "No option selected";
    const question = assessment?.questions.find((item) => item.id === questionId);
    return (
      question?.options.find((option) => option.id === optionId)?.text ??
      `Option ${optionId}`
    );
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={attempt.lessonTitle}
      eyebrow="Assessment attempt"
      size="lg"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-sand/80 bg-cream-100/60 p-4">
        <div>
          <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
            {attempt.passed === true ? (
              <CheckCircle2 size={15} className="text-forest-700" />
            ) : attempt.passed === false ? (
              <Target size={15} className="text-rust-600" />
            ) : (
              <FileText size={15} className="text-muted" />
            )}
            {attempt.passed === true
              ? "Passed"
              : attempt.passed === false
                ? "Not passed"
                : "Submitted for review"}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            {attempt.autoGraded
              ? `${attempt.scorePoints} / ${attempt.autoGradedPoints} auto-graded points · ${attempt.percentage ?? 0}%`
              : "No auto-graded questions — written answers are stored for review."}
            {attempt.xpAwarded > 0 ? ` · +${attempt.xpAwarded} XP` : ""}
          </p>
        </div>
        <p className="text-[10px] text-muted">
          {formatRelativeTime(attempt.submittedAt)}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-[12px] text-muted">
          <Loader2 size={15} className="animate-spin" />
          Loading your answers…
        </div>
      ) : error ? (
        <div className="mt-4 rounded-lg border border-rust-200 bg-rust-50 px-3 py-2.5 text-[11.5px] leading-relaxed text-rust-700">
          {error}
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setError(null);
              fetchAttemptReview(attempt.id)
                .then(setReview)
                .catch((retryError) =>
                  setError(
                    retryError instanceof Error
                      ? retryError.message
                      : "Could not load this attempt.",
                  ),
                )
                .finally(() => setLoading(false));
            }}
            className="ml-2 inline-flex items-center gap-1 underline underline-offset-2"
          >
            <RefreshCw size={10} /> Retry
          </button>
        </div>
      ) : (
        <>
          <ol className="mt-4 space-y-3">
            {questions.map((question, index) => {
              const correct = question.reviewRequired
                ? null
                : question.isCorrect === true;
              return (
                <li
                  key={question.questionId}
                  className="rounded-xl border border-sand/80 bg-cream-50 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10.5px] font-semibold ${
                          correct === true
                            ? "bg-forest-700 text-cream-50"
                            : correct === false
                              ? "bg-rust-100 text-rust-600"
                              : "bg-cream-300 text-forest-800"
                        }`}
                      >
                        {correct === true ? <Check size={12} /> : index + 1}
                      </span>
                      <div className="lesson-prose lesson-prose-compact min-w-0">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                          {question.prompt}
                        </ReactMarkdown>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-cream-100 px-2 py-0.5 text-[9.5px] text-muted">
                      {question.pointsAwarded} / {question.pointsPossible} pts
                    </span>
                  </div>

                  {question.reviewRequired ? (
                    <div className="mt-3 space-y-2 pl-8">
                      <AnswerBlock
                        label="Your answer"
                        value={question.answerText}
                      />
                      <AnswerBlock
                        label="Model answer / guidance"
                        value={question.expectedAnswer}
                        tone="model"
                      />
                      <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-muted">
                        <ShieldCheck size={11} className="mt-0.5 shrink-0" />
                        This response was stored but is not automatically scored.
                        Compare it with the supplied model answer and rubric.
                      </p>
                      {question.gradingRubric &&
                        question.gradingRubric.length > 0 && (
                          <div className="rounded-lg bg-cream-100/70 px-3 py-2">
                            <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                              Grading rubric
                            </p>
                            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-[#5e6b5c]">
                              {question.gradingRubric.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2 pl-8">
                      <AnswerBlock
                        label={
                          correct ? "Your answer (correct)" : "Your answer"
                        }
                        value={optionText(
                          question.questionId,
                          question.selectedOptionId,
                        )}
                        tone={correct ? "correct" : "wrong"}
                      />
                      {!correct && (
                        <AnswerBlock
                          label="Correct answer"
                          value={optionText(
                            question.questionId,
                            question.correctOptionId,
                          )}
                          tone="model"
                        />
                      )}
                      {question.explanation && (
                        <p className="rounded-lg bg-cream-100/70 px-3 py-2 text-[11px] leading-relaxed text-[#5e6b5c]">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {review?.solution && (
            <details
              open
              className="mt-4 rounded-xl border border-sand/80 bg-cream-100/60 p-4"
            >
              <summary className="cursor-pointer text-[12.5px] font-semibold text-forest-900">
                Worked solution from the curriculum
              </summary>
              <div className="lesson-prose mt-3">
                <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                  {review.solution}
                </ReactMarkdown>
              </div>
            </details>
          )}
        </>
      )}

      <div className="mt-5 flex justify-end border-t border-sand/80 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-forest-900 px-4 text-[11.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800"
        >
          Close review
        </button>
      </div>
    </Modal>
  );
}

function AnswerBlock({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string | null;
  tone?: "default" | "model" | "correct" | "wrong";
}) {
  const toneClass =
    tone === "correct"
      ? "border-forest-200 bg-[#eef3e6]"
      : tone === "wrong"
        ? "border-rust-200 bg-rust-50"
        : tone === "model"
          ? "border-[#d7dfca] bg-[#f2f5ec]"
          : "border-sand bg-cream-100/60";
  return (
    <div className={`rounded-lg border px-3 py-2 ${toneClass}`}>
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </p>
      <p className="mt-1 whitespace-pre-wrap text-[11.5px] leading-relaxed text-[#4f5f51]">
        {value && value.trim() ? value : "No answer supplied."}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------- Discussion ---- */

interface DiscussionModalProps {
  discussion: Discussion;
  onClose: () => void;
  onToast: (message: string) => void;
}

export function DiscussionModal({
  discussion,
  onClose,
  onToast,
}: DiscussionModalProps) {
  const [thread, setThread] = useState<Discussion>(discussion);
  const [replies, setReplies] = useState<DiscussionReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchDiscussionThread(discussion.id)
      .then((data) => {
        if (!active) return;
        setThread({
          ...data.thread,
          time: formatRelativeTime(data.thread.createdAt),
          replies: data.replies.length,
        });
        setReplies(data.replies);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load this discussion.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [discussion.id]);

  const addReply = async (event: FormEvent) => {
    event.preventDefault();
    if (busy || !draft.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await createReply(discussion.id, draft.trim());
      setDraft("");
      const data = await fetchDiscussionThread(discussion.id);
      setThread({
        ...data.thread,
        time: formatRelativeTime(data.thread.createdAt),
        replies: data.replies.length,
      });
      setReplies(data.replies);
      onToast("Reply published to the discussion.");
    } catch (replyError) {
      setError(
        replyError instanceof Error
          ? replyError.message
          : "Could not publish the reply.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={thread.title}
      eyebrow={`${thread.tag} · Community discussion`}
      size="lg"
    >
      <div className="flex flex-wrap items-center gap-2 text-[10.5px] text-muted">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e4ead9] text-[10px] font-semibold text-forest-700">
          {thread.author.slice(0, 1)}
        </span>
        <span>Started by {thread.author}</span>
        <span>·</span>
        <span>{formatRelativeTime(thread.createdAt) || thread.time}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <MessageCircle size={11} /> {replies.length} repl
          {replies.length === 1 ? "y" : "ies"}
        </span>
      </div>

      {thread.body && (
        <p className="mt-4 whitespace-pre-wrap rounded-xl border border-sand/80 bg-cream-100/60 p-3.5 text-[12.5px] leading-relaxed text-[#4f5f51]">
          {thread.body}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-[12px] text-muted">
          <Loader2 size={15} className="animate-spin" /> Loading replies…
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {replies.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[#d8cdb9] bg-cream-100/50 px-4 py-5 text-center text-[11.5px] text-muted">
              No replies yet. Add the first one below.
            </p>
          ) : (
            replies.map((reply) => (
              <div
                key={reply.id}
                className="rounded-xl border border-sand/70 bg-cream-50 p-3.5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-300 text-[10px] font-semibold text-forest-700">
                    {reply.author.slice(0, 1)}
                  </span>
                  <span className="text-[11.5px] font-medium text-ink">
                    {reply.author}
                  </span>
                  <span className="text-[10px] text-muted">
                    {formatRelativeTime(reply.createdAt)}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-[12px] leading-relaxed text-muted">
                  {reply.body}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 rounded-lg border border-rust-200 bg-rust-50 px-3 py-2 text-[11px] text-rust-700">
          {error}
        </p>
      )}

      <form onSubmit={addReply} className="mt-4">
        <label htmlFor="community-reply" className="sr-only">
          Add a reply
        </label>
        <textarea
          id="community-reply"
          rows={3}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={5000}
          placeholder="Add a reply…"
          className="w-full resize-none rounded-xl border border-sand bg-cream-50 px-3 py-2.5 text-[12px] text-ink placeholder:text-muted/70 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
        />
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-[10px] text-muted">
            Replies are stored in Supabase and attributed to your display name.
          </p>
          <button
            type="submit"
            disabled={busy || !draft.trim()}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-forest-900 px-3.5 text-[10.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <>
                <Loader2 size={11} className="animate-spin" /> Publishing…
              </>
            ) : (
              <>
                Add reply
                <ArrowRight size={11} />
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* --------------------------------------------------------------- About ---- */

interface AboutModalProps {
  onClose: () => void;
}

export function AboutModal({ onClose }: AboutModalProps) {
  return (
    <Modal
      open
      onClose={onClose}
      title="About PRAXIS"
      eyebrow="Learning platform"
      size="md"
    >
      <p className="text-[13px] leading-relaxed text-muted">
        PRAXIS is a multi-user learning platform built on the supplied
        TechStructure curriculum. Browsing and search use the bundled curriculum;
        accounts, progress, assessments, XP, achievements, streaks and community
        threads use Supabase.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { label: "Learning paths", value: curriculumStats.paths },
          { label: "Modules", value: curriculumStats.modules },
          { label: "Lessons", value: curriculumStats.lessons },
          { label: "Assessments", value: curriculumStats.assessments },
          { label: "Questions", value: curriculumStats.questions },
          {
            label: "Multiple choice",
            value: curriculumStats.multipleChoiceQuestions,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-sand/80 bg-cream-100/60 px-3 py-2"
          >
            <p className="text-[9.5px] uppercase tracking-[0.1em] text-muted">
              {stat.label}
            </p>
            <p className="mt-0.5 text-[15px] font-semibold text-forest-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {[
          {
            icon: ShieldCheck,
            label: "Private, per-user data",
            text: "Row Level Security scopes progress, answers, achievements and notifications to the signed-in account. The browser never supplies XP or a user ID.",
          },
          {
            icon: ListChecks,
            label: "Trusted grading",
            text: "Multiple-choice answers are graded inside database functions. Correct answers and solutions are withheld from the public curriculum bundle and released only after a submission.",
          },
          {
            icon: HelpCircle,
            label: "Honest free-response handling",
            text: "Written answers are stored and displayed next to the supplied model answer and rubric. They are not semantically graded.",
          },
          {
            icon: Trophy,
            label: "Your progress",
            text: "New accounts start at 0 XP with no lessons, streak or achievements. Lesson completion awards server-defined XP and updates streaks and achievements.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-xl border border-sand/70 bg-cream-100/60 p-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e6ebdc] text-forest-700">
                <Icon size={15} />
              </span>
              <div>
                <p className="text-[11.5px] font-semibold text-ink">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {curriculumCaveats.length > 0 && (
        <details className="mt-4 rounded-xl border border-sand/70 bg-cream-100/50 p-3">
          <summary className="cursor-pointer text-[11.5px] font-semibold text-forest-900">
            Imported-content caveats ({curriculumCaveats.length})
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-[10.5px] leading-relaxed text-muted">
            {curriculumCaveats.map((caveat) => (
              <li key={caveat}>{caveat}</li>
            ))}
          </ul>
        </details>
      )}

      <p className="mt-4 flex items-start gap-2 text-[10px] leading-relaxed text-muted">
        <Sparkles size={12} className="mt-0.5 shrink-0 text-rust-400" />
        Curriculum content is reproduced from the supplied archive. Caveats from
        that archive are documented rather than rewritten.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-5 inline-flex h-9 items-center gap-2 rounded-full bg-forest-900 px-4 text-[11.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800"
      >
        Continue exploring
        <ArrowRight size={12} />
      </button>
    </Modal>
  );
}
