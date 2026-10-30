import {
  ArrowRight,
  BookOpen,
  CalendarCheck2,
  Check,
  CircleHelp,
  Target,
  Trophy,
} from "lucide-react";
import type { Activity, AssessmentAttempt, LearningPath } from "../types";
import { useLearner } from "../context/LearnerContext";
import { formatDate, formatRelativeTime, percent } from "../lib/format";
import { PageIntro } from "../components/PageIntro";
import { PathArt } from "../components/illustrations/PathArt";
import { WeeklyProgress } from "../components/dashboard/WeeklyProgress";

interface ProgressPageProps {
  onOpenPath: (path: LearningPath) => void;
  onOpenActivity: (activity: Activity) => void;
  onReviewAttempt: (attempt: AssessmentAttempt) => void;
}

function statusTone(status: LearningPath["status"]) {
  if (status === "Completed") return "bg-forest-800 text-cream-50";
  if (status === "In Progress") return "bg-rust-50 text-rust-600";
  return "bg-cream-200 text-muted";
}

export function ProgressPage({
  onOpenPath,
  onOpenActivity,
  onReviewAttempt,
}: ProgressPageProps) {
  const {
    stats,
    paths,
    weeklyActivity,
    achievements,
    attempts,
    activity,
  } = useLearner();

  const activeDays = weeklyActivity.filter((day) => day.active).length;
  const activePaths = paths.filter((path) => path.status === "In Progress").length;
  const completedPaths = paths.filter((path) => path.status === "Completed").length;

  const statCards = [
    {
      label: "Total XP",
      value: stats.totalXp.toLocaleString("en-US"),
      note: `Level ${stats.level} · ${stats.levelXp}/${stats.levelTarget} XP this level`,
      icon: Trophy,
    },
    {
      label: "Lessons completed",
      value: String(stats.completedLessons),
      note: `${completedPaths} path${completedPaths === 1 ? "" : "s"} completed`,
      icon: BookOpen,
    },
    {
      label: "Assessments passed",
      value: String(stats.assessmentsPassed),
      note: `${stats.assessmentsSubmitted} submitted in total`,
      icon: Target,
    },
    {
      label: "This week",
      value: `${activeDays} / ${stats.weeklyGoal || 7}`,
      note: "Active learning days",
      icon: CalendarCheck2,
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageIntro
        eyebrow="Your journey"
        title="Progress"
        description="Verified XP, completed lessons, assessment attempts, active days and achievements from your authenticated account."
        aside={
          <span className="rounded-full border border-sand bg-cream-50 px-3.5 py-2 text-[11.5px] text-muted">
            {stats.currentStreak}-day streak · best {stats.longestStreak}
          </span>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <section key={stat.label} className="panel p-4">
              <div className="flex items-center justify-between">
                <p className="text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  {stat.label}
                </p>
                <Icon size={15} className="text-[#8fa483]" />
              </div>
              <p className="display-title mt-2 text-[27px] leading-none text-forest-950">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[10.5px] leading-snug text-muted">
                {stat.note}
              </p>
            </section>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_328px]">
        <div className="flex flex-col gap-5">
          <section className="panel p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[14px] font-semibold text-ink">
                  Path progress
                </h2>
                <p className="mt-0.5 text-[11px] text-muted">
                  {activePaths} in progress · {completedPaths} completed ·{" "}
                  {paths.length} total
                </p>
              </div>
              <span className="rounded-full bg-cream-200/80 px-2.5 py-1 text-[10px] text-muted">
                Live account
              </span>
            </div>

            <div className="mt-4 divide-y divide-sand/70">
              {paths.map((path) => {
                const completion = percent(
                  path.completedLessons,
                  path.totalLessons,
                );
                return (
                  <div
                    key={path.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="hidden h-12 w-[74px] shrink-0 items-center justify-center rounded-lg bg-cream-100 sm:flex">
                      <PathArt
                        variant={path.art}
                        className="h-10 w-[66px]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-[12.5px] font-medium text-ink">
                          {path.title}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9.5px] ${statusTone(path.status)}`}
                        >
                          {path.status}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2.5">
                        <div
                          className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-300"
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
                        <span className="w-20 shrink-0 text-right text-[10.5px] text-muted">
                          {path.completedLessons} / {path.totalLessons} lessons
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenPath(path)}
                      className="group flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-sand bg-cream-50 px-3 text-[10.5px] font-medium text-forest-800 transition-colors hover:border-forest-300 hover:bg-cream-100"
                    >
                      <span className="hidden sm:inline">Open</span>
                      <ArrowRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-ink">
                Assessment attempts
              </h2>
              <span className="text-[10.5px] text-muted">
                {attempts.length} recent
              </span>
            </div>
            {attempts.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-[#d8cdb9] bg-cream-100/60 px-4 py-6 text-center">
                <CircleHelp size={18} className="mx-auto text-forest-600" />
                <p className="mt-2 text-[12px] font-medium text-ink">
                  No assessment attempts yet
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  Open a lesson and submit its assessment to create a stored
                  attempt.
                </p>
              </div>
            ) : (
              <ul className="mt-3 divide-y divide-sand/60">
                {attempts.map((attempt) => (
                  <li
                    key={attempt.id}
                    className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        attempt.passed === true
                          ? "bg-forest-700 text-cream-50"
                          : attempt.passed === false
                            ? "bg-rust-100 text-rust-600"
                            : "bg-cream-300 text-forest-700"
                      }`}
                    >
                      {attempt.passed === true ? (
                        <Check size={13} strokeWidth={2.4} />
                      ) : (
                        <Target size={13} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-ink">
                        {attempt.lessonTitle}
                      </p>
                      <p className="mt-0.5 text-[10.5px] text-muted">
                        {attempt.autoGraded
                          ? attempt.percentage === null
                            ? "Auto-graded"
                            : `${attempt.percentage}% on auto-graded questions`
                          : "Free-response review"}
                        {attempt.passed === true
                          ? " · passed"
                          : attempt.passed === false
                            ? " · not passed"
                            : " · no auto-grade"}
                        {attempt.xpAwarded > 0
                          ? ` · +${attempt.xpAwarded} XP`
                          : ""}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted/80">
                        {formatRelativeTime(attempt.submittedAt)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onReviewAttempt(attempt)}
                      className="shrink-0 rounded-full border border-sand bg-cream-50 px-3 py-1.5 text-[10.5px] font-medium text-forest-800 hover:border-forest-300 hover:bg-cream-100"
                    >
                      Review
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-[14px] font-semibold text-ink">
                Activity history
              </h2>
              <span className="text-[10.5px] text-muted">
                {activity.length} events
              </span>
            </div>
            {activity.length === 0 ? (
              <div className="mt-3 rounded-xl border border-dashed border-[#d8cdb9] bg-cream-100/60 px-4 py-6 text-center">
                <p className="text-[12px] font-medium text-ink">
                  Your timeline is empty
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  Lesson completions, assessment submissions and achievements
                  are recorded here.
                </p>
              </div>
            ) : (
              <ol className="mt-3">
                {activity.map((item, index) => (
                  <li
                    key={item.id}
                    className="relative flex gap-3 pb-4 last:pb-0"
                  >
                    {index < activity.length - 1 && (
                      <span className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-px bg-sand" />
                    )}
                    <span
                      className={`relative z-10 mt-0.5 flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                        item.kind === "quiz" || item.kind === "achievement"
                          ? "bg-rust-100 text-rust-600"
                          : "bg-[#e4ead9] text-forest-700"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenActivity(item)}
                      className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3 text-left"
                    >
                      <span>
                        <span className="block text-[12px] font-medium text-ink">
                          {item.title}
                          {item.detail ? ` · ${item.detail}` : ""}
                        </span>
                        <span className="mt-0.5 block text-[10.5px] text-muted">
                          {item.time}
                          {item.xpDelta ? ` · ${item.xpDelta > 0 ? "+" : ""}${item.xpDelta} XP` : ""}
                        </span>
                      </span>
                      <span className="text-[10px] text-muted underline decoration-sand underline-offset-2 hover:text-forest-800">
                        Details
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-4">
          <WeeklyProgress />
          <section className="panel p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-ink">
                Achievements
              </h2>
              <span className="text-[10px] text-muted">
                {achievements.length} earned
              </span>
            </div>
            {achievements.length === 0 ? (
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                No achievements yet. Complete lessons, pass assessments and build
                a streak to unlock them.
              </p>
            ) : (
              <ul className="mt-2.5 space-y-2">
                {achievements.map((achievement) => (
                  <li
                    key={achievement.id}
                    className="flex items-start gap-2.5 rounded-lg bg-cream-100/70 px-2.5 py-2"
                  >
                    <Trophy
                      size={13}
                      className="mt-0.5 shrink-0 text-[#a97634]"
                    />
                    <span>
                      <span className="block text-[11.5px] font-medium text-ink">
                        {achievement.title}
                      </span>
                      <span className="block text-[10.5px] leading-snug text-muted">
                        {achievement.description}
                      </span>
                      <span className="mt-0.5 block text-[9.5px] text-muted/80">
                        {formatDate(achievement.earnedAt)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="panel p-4">
            <h2 className="text-[13px] font-semibold text-ink">
              What counts as progress?
            </h2>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
              Completed lessons, passed auto-graded assessments, active days and
              achievements. XP is awarded by trusted database functions, never by
              the browser.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
