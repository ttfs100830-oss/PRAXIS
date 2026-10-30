import { useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  CircleHelp,
  Clock3,
  FileText,
  ListChecks,
  Loader2,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import type {
  AssessmentResult,
  AssessmentReviewQuestion,
  LearningPath,
  Lesson,
} from "../types";
import { useLearner } from "../context/LearnerContext";
import {
  getAssessmentForLesson,
  getPathModules,
  missingPrerequisites,
  prerequisitesFor,
} from "../lib/curriculum";
import { percent } from "../lib/format";

interface LessonPageProps {
  path: LearningPath;
  lesson: Lesson;
  onBack: () => void;
  onOpenLesson: (lessonId: string) => void;
  onOpenPath: (path: LearningPath) => void;
  onToast: (message: string) => void;
}

export function LessonPage({
  path,
  lesson,
  onBack,
  onOpenLesson,
  onOpenPath,
  onToast,
}: LessonPageProps) {
  const {
    completedLessonIds,
    attempts,
    completeLesson,
    submitAssessment,
    setupRequired,
  } = useLearner();
  const assessment = getAssessmentForLesson(lesson.id);
  const modules = getPathModules(path.id);
  const prerequisiteList = prerequisitesFor(lesson.id);
  const missing = missingPrerequisites(lesson.id, completedLessonIds);
  const pathPercent = percent(path.completedLessons, path.totalLessons);

  const lessonAttempts = attempts.filter(
    (attempt) => attempt.lessonId === lesson.id,
  );
  const hasSubmitted = lessonAttempts.length > 0;
  const hasPassed = lessonAttempts.some((attempt) => attempt.passed === true);
  const autoGradableCount =
    assessment?.questions.filter((question) => question.autoGradable).length ?? 0;

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completionError, setCompletionError] = useState<string | null>(null);

  const answeredCount = Object.values(answers).filter(
    (value) => value.trim().length > 0,
  ).length;

  const canSubmit = Boolean(
    assessment && answeredCount > 0 && !submitting && !result,
  );

  const canComplete = (() => {
    if (lesson.completed || missing.length > 0 || completing) return false;
    if (!assessment) return true;
    if (autoGradableCount > 0) return hasPassed;
    return hasSubmitted;
  })();

  const completionHint = (() => {
    if (lesson.completed) return "This lesson is already complete.";
    if (missing.length > 0)
      return "Complete the prerequisite lessons before finishing this lesson.";
    if (assessment && autoGradableCount > 0 && !hasPassed)
      return "Pass the auto-graded questions to complete this lesson.";
    if (assessment && autoGradableCount === 0 && !hasSubmitted)
      return "Submit your written response to unlock completion.";
    return "Your completion is recorded by trusted database logic.";
  })();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!assessment || submitting) return;
    if (answeredCount === 0) {
      setError("Answer at least one question before submitting.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await submitAssessment(assessment.id, answers);
      setResult(response);
      const message =
        response.passed === true
          ? `Assessment passed with ${response.percentage ?? 0}% on auto-graded questions.`
          : response.passed === false
            ? `Assessment submitted. ${
                response.percentage ?? 0
              }% on auto-graded questions; the pass mark is ${
                response.passingScorePercent
              }%.`
            : "Assessment submitted. Free-response answers are stored for your review.";
      onToast(message);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not submit the assessment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const finishLesson = async () => {
    if (completing) return;
    setCompleting(true);
    setCompletionError(null);
    try {
      const response = await completeLesson(lesson.id);
      onToast(
        response.alreadyCompleted
          ? "This lesson was already complete."
          : `Lesson completed · +${response.xpAwarded} XP.`,
      );
    } catch (completeError) {
      setCompletionError(
        completeError instanceof Error
          ? completeError.message
          : "Could not complete the lesson.",
      );
    } finally {
      setCompleting(false);
    }
  };

  const retake = () => {
    setResult(null);
    setAnswers({});
    setError(null);
    window.requestAnimationFrame(() => {
      document
        .getElementById("assessment")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const moduleIndex = modules.findIndex((module) => module.id === lesson.moduleId);
  const lessonNumber = path.lessons.findIndex((item) => item.id === lesson.id) + 1;

  return (
    <div className="animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-sand bg-cream-50 px-3 py-1.5 text-[11.5px] font-medium text-forest-800 transition-colors hover:border-forest-300 hover:bg-cream-100"
      >
        <ArrowLeft size={13} />
        Back
      </button>

      <div className="mb-5 flex flex-col justify-between gap-4 border-b border-sand/80 pb-5 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-rust-500">
            {path.title} · Lesson {lessonNumber} of {path.totalLessons}
          </p>
          <h1 className="display-title mt-2 text-[34px] leading-[1.05] text-forest-950">
            {lesson.title}
          </h1>
          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">
            {lesson.scope}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10.5px]">
            <span className="flex items-center gap-1.5 rounded-full border border-sand bg-cream-100 px-2.5 py-1 text-forest-800">
              <Clock3 size={11} /> {lesson.duration}
            </span>
            <span className="rounded-full border border-sand bg-cream-100 px-2.5 py-1 text-forest-800">
              {lesson.classification}
            </span>
            <span className="rounded-full border border-sand bg-cream-100 px-2.5 py-1 text-forest-800">
              {moduleIndex >= 0 ? modules[moduleIndex].title : "Module"}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 ${
                lesson.completed
                  ? "bg-forest-800 text-cream-50"
                  : "bg-rust-50 text-rust-600"
              }`}
            >
              {lesson.completed ? "Completed" : "Not completed"}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onOpenPath(path)}
            className="rounded-full border border-sand bg-cream-50 px-3.5 py-2 text-[11px] font-medium text-forest-800 hover:bg-cream-100"
          >
            Path overview
          </button>
          <a
            href="#assessment"
            className="inline-flex items-center gap-1.5 rounded-full bg-forest-900 px-3.5 py-2 text-[11px] font-medium text-cream-50 hover:bg-forest-800"
          >
            <ListChecks size={12} />
            Go to assessment
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_312px]">
        <div className="min-w-0">
          <article id="lesson-content" className="panel px-5 py-6 sm:px-8 sm:py-8">
            <div className="lesson-prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                skipHtml
                components={{
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noreferrer noopener">
                      {children}
                    </a>
                  ),
                }}
              >
                {lesson.contentMarkdown}
              </ReactMarkdown>
            </div>
          </article>

          {assessment ? (
            <section
              id="assessment"
              className="panel mt-5 scroll-mt-5 px-5 py-6 sm:px-7"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10.5px] font-medium uppercase tracking-[0.16em] text-rust-500">
                    Assessment
                  </p>
                  <h2 className="mt-1 text-[19px] font-semibold text-ink">
                    {assessment.title}
                  </h2>
                  <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted">
                    {assessment.instructions ||
                      "Answer the questions below. Multiple-choice questions are graded by the database; written answers are stored for your review."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="rounded-full bg-cream-200 px-2.5 py-1 text-muted">
                    {assessment.questions.length} questions
                  </span>
                  <span className="rounded-full bg-cream-200 px-2.5 py-1 text-muted">
                    {assessment.totalPoints} points
                  </span>
                  <span className="rounded-full bg-cream-200 px-2.5 py-1 text-muted">
                    Pass {assessment.passingScorePercent}%
                  </span>
                  <span className="rounded-full bg-[#e8edde] px-2.5 py-1 text-forest-700">
                    {autoGradableCount} auto-graded
                  </span>
                </div>
              </div>

              {result ? (
                <AssessmentResultView
                  result={result}
                  assessmentQuestions={assessment.questions}
                  onRetake={retake}
                />
              ) : (
                <form onSubmit={submit} className="mt-5">
                  <ol className="space-y-4">
                    {assessment.questions.map((question, index) => (
                      <li
                        key={question.id}
                        className="rounded-xl border border-sand/80 bg-cream-100/45 p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream-50 text-[10.5px] font-semibold text-forest-800">
                              {index + 1}
                            </span>
                            <div className="lesson-prose lesson-prose-compact min-w-0">
                              <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                                {question.prompt}
                              </ReactMarkdown>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-1.5 text-[9.5px] text-muted">
                            <span className="rounded-full bg-cream-50 px-2 py-0.5">
                              {question.type.replace(/_/g, " ")}
                            </span>
                            <span className="rounded-full bg-cream-50 px-2 py-0.5">
                              {question.points} pt
                              {question.points === 1 ? "" : "s"}
                            </span>
                          </div>
                        </div>

                        {question.autoGradable ? (
                          <fieldset className="mt-3 space-y-1.5 pl-8">
                            <legend className="sr-only">
                              Choose one answer
                            </legend>
                            {question.options.map((option) => {
                              const checked = answers[question.id] === option.id;
                              return (
                                <label
                                  key={option.id}
                                  className={`flex cursor-pointer items-start gap-2.5 rounded-lg border px-3 py-2 text-[12px] leading-snug transition-colors ${
                                    checked
                                      ? "border-forest-400 bg-cream-50 text-forest-950"
                                      : "border-sand/80 bg-cream-50/60 text-[#536254] hover:border-forest-300 hover:bg-cream-50"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={question.id}
                                    value={option.id}
                                    checked={checked}
                                    onChange={() =>
                                      setAnswers((current) => ({
                                        ...current,
                                        [question.id]: option.id,
                                      }))
                                    }
                                    className="mt-0.5 h-3.5 w-3.5 accent-forest-800"
                                  />
                                  <span>
                                    <span className="mr-1.5 font-semibold text-forest-700">
                                      {option.id}.
                                    </span>
                                    {option.text}
                                  </span>
                                </label>
                              );
                            })}
                          </fieldset>
                        ) : (
                          <div className="mt-3 pl-8">
                            <label
                              htmlFor={`answer-${question.id}`}
                              className="sr-only"
                            >
                              Your answer to question {index + 1}
                            </label>
                            <textarea
                              id={`answer-${question.id}`}
                              value={answers[question.id] ?? ""}
                              onChange={(event) =>
                                setAnswers((current) => ({
                                  ...current,
                                  [question.id]: event.target.value,
                                }))
                              }
                              rows={4}
                              placeholder="Write your answer, reasoning or code here…"
                              className="w-full resize-y rounded-lg border border-sand bg-cream-50 px-3 py-2.5 text-[12px] leading-relaxed text-ink placeholder:text-muted/70 focus:border-forest-400 focus:outline-none focus:ring-2 focus:ring-forest-200"
                            />
                            <p className="mt-1 flex items-center gap-1.5 text-[10px] text-muted">
                              <ShieldCheck size={11} />
                              Stored with your attempt and shown beside the model
                              answer. PRAXIS does not claim automated semantic
                              grading for this question.
                            </p>
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>

                  {error && (
                    <p
                      role="alert"
                      className="mt-4 rounded-lg border border-rust-200 bg-rust-50 px-3 py-2 text-[11.5px] text-rust-700"
                    >
                      {error}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sand/80 pt-4">
                    <p className="text-[10.5px] text-muted">
                      {answeredCount} of {assessment.questions.length} questions
                      answered. Scores and XP are calculated by the database.
                    </p>
                    <button
                      type="submit"
                      disabled={!canSubmit}
                      className="inline-flex h-9 items-center gap-2 rounded-full bg-forest-900 px-4 text-[11.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          Submit assessment
                          <ArrowRight size={12} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </section>
          ) : (
            <section className="panel mt-5 px-5 py-5">
              <div className="flex items-start gap-2.5 rounded-lg bg-[#f6ead9] px-3 py-2.5 text-[11px] leading-relaxed text-[#7a6a55]">
                <CircleHelp size={14} className="mt-0.5 shrink-0" />
                No assessment is attached to this lesson in the supplied
                curriculum.
              </div>
            </section>
          )}

          <nav
            aria-label="Lesson navigation"
            className="mt-5 flex flex-wrap items-stretch justify-between gap-3"
          >
            <NeighbourButton
              direction="previous"
              path={path}
              currentIndex={lessonNumber - 1}
              onOpenLesson={onOpenLesson}
            />
            <NeighbourButton
              direction="next"
              path={path}
              currentIndex={lessonNumber - 1}
              onOpenLesson={onOpenLesson}
            />
          </nav>
        </div>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-4">
          <section className="panel p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-ink">
                Lesson completion
              </h2>
              {lesson.completed ? (
                <span className="flex items-center gap-1 rounded-full bg-forest-800 px-2.5 py-1 text-[10px] text-cream-50">
                  <Check size={11} /> Complete
                </span>
              ) : (
                <span className="rounded-full bg-cream-200 px-2.5 py-1 text-[10px] text-muted">
                  Open
                </span>
              )}
            </div>

            {missing.length > 0 ? (
              <div className="mt-3 rounded-lg border border-[#e6cfae] bg-[#f8eedf] px-3 py-2.5 text-[11px] leading-relaxed text-[#715c3d]">
                <p className="flex items-center gap-1.5 font-medium">
                  <LockKeyhole size={12} /> Prerequisites incomplete
                </p>
                <ul className="mt-1.5 space-y-1">
                  {prerequisiteList
                    .filter((item) => missing.includes(item.id))
                    .map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => onOpenLesson(item.id)}
                          className="text-left underline decoration-[#d9bd91] underline-offset-2 hover:text-[#4e3f28]"
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ) : prerequisiteList.length > 0 ? (
              <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                {prerequisiteList.length} prerequisite
                {prerequisiteList.length === 1 ? "" : "s"} met.
              </p>
            ) : (
              <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                This lesson has no prerequisites.
              </p>
            )}

            <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
              {completionHint}
            </p>

            {completionError && (
              <p className="mt-2 rounded-lg border border-rust-200 bg-rust-50 px-2.5 py-2 text-[10.5px] text-rust-700">
                {completionError}
              </p>
            )}

            {lesson.completed ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#e9efdf] px-3 py-2.5 text-[11px] text-forest-800">
                <CheckCircle2 size={14} />
                Recorded on your account.
              </div>
            ) : (
              <button
                type="button"
                onClick={() => void finishLesson()}
                disabled={!canComplete}
                className="mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-forest-900 px-4 text-[11.5px] font-medium text-cream-50 transition-colors hover:bg-forest-800 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {completing ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Recording…
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    Mark lesson complete
                  </>
                )}
              </button>
            )}

            {setupRequired && (
              <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-relaxed text-rust-600">
                <AlertTriangle size={11} className="mt-0.5 shrink-0" />
                Database setup is incomplete, so completion and grading cannot be
                saved yet.
              </p>
            )}

            {hasPassed && (
              <p className="mt-2 flex items-center gap-1.5 text-[10px] text-forest-700">
                <Trophy size={11} /> You have already passed this assessment.
              </p>
            )}
          </section>

          <section className="panel p-4">
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-forest-700" />
              <h2 className="text-[13px] font-semibold text-ink">
                Path progress
              </h2>
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-300">
                <div
                  className="h-full rounded-full bg-forest-800"
                  style={{ width: `${pathPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-muted">
                {path.completedLessons}/{path.totalLessons}
              </span>
            </div>
            <p className="mt-1.5 text-[10px] text-muted">
              {pathPercent}% of this path complete.
            </p>
          </section>

          <section className="panel p-3">
            <div className="flex items-center gap-2 px-1 pb-2">
              <FileText size={14} className="text-forest-700" />
              <h2 className="text-[13px] font-semibold text-ink">
                Path outline
              </h2>
            </div>
            <div className="max-h-[380px] space-y-2 overflow-y-auto pr-1 scrollbar-subtle">
              {path.modules.map((module) => (
                <div key={module.id}>
                  <p className="px-1 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-muted">
                    {module.title}
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {path.lessons
                      .filter((item) => item.moduleId === module.id)
                      .map((item) => {
                        const current = item.id === lesson.id;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => onOpenLesson(item.id)}
                              className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-[10.5px] leading-snug transition-colors ${
                                current
                                  ? "bg-[#e5eadb] font-medium text-forest-900"
                                  : "text-[#5e6b5c] hover:bg-cream-100"
                              }`}
                            >
                              <span
                                className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full ${
                                  item.completed
                                    ? "bg-forest-700 text-cream-50"
                                    : "border border-sand bg-cream-50"
                                }`}
                              >
                                {item.completed && (
                                  <Check size={8} strokeWidth={3} />
                                )}
                              </span>
                              <span className="line-clamp-2">{item.title}</span>
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function NeighbourButton({
  direction,
  path,
  currentIndex,
  onOpenLesson,
}: {
  direction: "previous" | "next";
  path: LearningPath;
  currentIndex: number;
  onOpenLesson: (lessonId: string) => void;
}) {
  const target =
    direction === "previous"
      ? path.lessons[currentIndex - 1]
      : path.lessons[currentIndex + 1];
  if (!target) {
    return (
      <div className="hidden flex-1 sm:block" aria-hidden="true" />
    );
  }
  return (
    <button
      type="button"
      onClick={() => onOpenLesson(target.id)}
      className={`group flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-sand bg-cream-50 px-4 py-3 text-left transition-colors hover:border-forest-300 hover:bg-cream-100 ${
        direction === "next" ? "sm:text-right" : ""
      }`}
    >
      {direction === "previous" && (
        <ArrowLeft
          size={15}
          className="shrink-0 text-muted transition-transform group-hover:-translate-x-0.5"
        />
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-[9.5px] uppercase tracking-[0.12em] text-muted">
          {direction === "previous" ? "Previous lesson" : "Next lesson"}
        </span>
        <span className="mt-0.5 block truncate text-[12px] font-medium text-ink">
          {target.title}
        </span>
      </span>
      {direction === "next" && (
        <ArrowRight
          size={15}
          className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
        />
      )}
    </button>
  );
}

function AssessmentResultView({
  result,
  assessmentQuestions,
  onRetake,
}: {
  result: AssessmentResult;
  assessmentQuestions: Array<{
    id: string;
    options: Array<{ id: string; text: string }>;
  }>;
  onRetake: () => void;
}) {
  const optionText = (questionId: string, optionId: string | null) => {
    if (!optionId) return "No option selected";
    const question = assessmentQuestions.find((item) => item.id === questionId);
    return (
      question?.options.find((option) => option.id === optionId)?.text ??
      `Option ${optionId}`
    );
  };

  const passedLabel =
    result.passed === true
      ? "Passed"
      : result.passed === false
        ? "Not passed"
        : "Submitted for review";

  return (
    <div className="mt-5">
      <div
        className={`rounded-xl border px-4 py-4 ${
          result.passed === true
            ? "border-forest-200 bg-[#eef3e6]"
            : result.passed === false
              ? "border-rust-200 bg-rust-50"
              : "border-[#e6cfae] bg-[#f8eedf]"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
              Assessment result
            </p>
            <h3 className="mt-1 flex items-center gap-2 text-[16px] font-semibold text-ink">
              {result.passed === true && (
                <CheckCircle2 size={17} className="text-forest-700" />
              )}
              {passedLabel}
            </h3>
            <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
              {result.autoGraded
                ? `${result.scorePoints} of ${result.autoGradedPoints} auto-graded points · ${result.percentage ?? 0}% · pass mark ${result.passingScorePercent}%`
                : "No multiple-choice questions were attached. Your written answers are stored with this attempt."}
            </p>
          </div>
          <div className="text-right">
            {result.xpAwarded > 0 && (
              <p className="text-[12px] font-semibold text-forest-800">
                +{result.xpAwarded} XP
              </p>
            )}
            <p className="mt-0.5 text-[10px] text-muted">
              Total {result.totalXp.toLocaleString()} XP · level {result.level}
            </p>
          </div>
        </div>

        {result.completion && (
          <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-cream-50/80 px-3 py-2 text-[10.5px] text-forest-800">
            <Sparkles size={12} />
            This pass also completed the lesson
            {result.completion.xpAwarded > 0
              ? ` and awarded +${result.completion.xpAwarded} lesson XP`
              : ""}
            .
          </p>
        )}
        {result.completionDeferred && (
          <p className="mt-3 rounded-lg bg-cream-50/80 px-3 py-2 text-[10.5px] leading-relaxed text-[#715c3d]">
            The assessment passed, but lesson completion is deferred until its
            prerequisites are complete. Then use “Mark lesson complete”.
          </p>
        )}
        {result.achievementsAwarded.length > 0 && (
          <p className="mt-2 text-[10.5px] text-forest-700">
            Achievement unlocked: {result.achievementsAwarded.join(", ")}.
          </p>
        )}
      </div>

      <h3 className="mt-5 text-[13px] font-semibold text-ink">
        Question review
      </h3>
      <ol className="mt-2 space-y-3">
        {result.questions.map((question, index) => (
          <ReviewQuestion
            key={question.questionId}
            question={question}
            index={index}
            optionText={optionText}
          />
        ))}
      </ol>

      {result.solution && (
        <div className="mt-5">
          <details
            open
            className="rounded-xl border border-sand/80 bg-cream-100/60 p-4"
          >
            <summary className="cursor-pointer text-[12.5px] font-semibold text-forest-900">
              Worked solution from the curriculum
            </summary>
            <div className="lesson-prose mt-3">
              <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>
                {result.solution}
              </ReactMarkdown>
            </div>
          </details>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sand/80 pt-4">
        <p className="text-[10.5px] text-muted">
          Attempt saved {new Date(result.submittedAt).toLocaleString()}.
        </p>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-sand bg-cream-50 px-3.5 text-[10.5px] font-medium text-forest-800 hover:border-forest-300 hover:bg-cream-100"
        >
          <RotateCcw size={11} />
          Try again
        </button>
      </div>
    </div>
  );
}

function ReviewQuestion({
  question,
  index,
  optionText,
}: {
  question: AssessmentReviewQuestion;
  index: number;
  optionText: (questionId: string, optionId: string | null) => string;
}) {
  const correct =
    question.reviewRequired ? null : question.isCorrect === true;
  return (
    <li className="rounded-xl border border-sand/80 bg-cream-100/40 p-4">
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
        <span className="shrink-0 rounded-full bg-cream-50 px-2 py-0.5 text-[9.5px] text-muted">
          {question.pointsAwarded} / {question.pointsPossible} pts
        </span>
      </div>

      {question.reviewRequired ? (
        <div className="mt-3 space-y-2 pl-8">
          <AnswerBlock label="Your answer" value={question.answerText} />
          <AnswerBlock
            label="Model answer / guidance"
            value={question.expectedAnswer}
            tone="model"
          />
          <p className="flex items-start gap-1.5 text-[10px] leading-relaxed text-muted">
            <ShieldCheck size={11} className="mt-0.5 shrink-0" />
            This response was stored but is not automatically scored. Compare it
            with the supplied model answer and rubric.
          </p>
          {question.gradingRubric && question.gradingRubric.length > 0 && (
            <div className="rounded-lg bg-cream-50/80 px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
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
            label={correct ? "Your answer (correct)" : "Your answer"}
            value={optionText(question.questionId, question.selectedOptionId)}
            tone={correct ? "correct" : "wrong"}
          />
          {!correct && (
            <AnswerBlock
              label="Correct answer"
              value={optionText(question.questionId, question.correctOptionId)}
              tone="model"
            />
          )}
          {question.explanation && (
            <p className="rounded-lg bg-cream-50/80 px-3 py-2 text-[11px] leading-relaxed text-[#5e6b5c]">
              {question.explanation}
            </p>
          )}
        </div>
      )}
    </li>
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
          : "border-sand bg-cream-50";
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
