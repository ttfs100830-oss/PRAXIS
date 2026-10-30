import { CalendarDays, Check, Trophy } from "lucide-react";
import { useLearner } from "../../context/LearnerContext";
import { SprigCorner } from "../illustrations/Botanical";

function dateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1, 12);
}

function fallbackWeek(): Array<{ date: string; active: boolean }> {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
      date.getDate(),
    ).padStart(2, "0")}`;
    return { date: key, active: false };
  });
}

export function WeeklyProgress() {
  const { stats, weeklyActivity, paths } = useLearner();
  const week = weeklyActivity.length ? weeklyActivity : fallbackWeek();
  const completedDays = week.filter((day) => day.active).length;
  const todayDate = week[week.length - 1]?.date;
  const nextPath = paths.find((path) => path.status !== "Completed");
  const nextLesson = nextPath?.lessons.find((lesson) => !lesson.completed);
  const goal = stats.weeklyGoal || 7;

  return (
    <section
      aria-labelledby="weekly-heading"
      className="panel min-h-[248px] p-[18px]"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <CalendarDays
            size={19}
            strokeWidth={1.7}
            className="text-forest-800"
          />
          <h2
            id="weekly-heading"
            className="text-[15px] font-semibold tracking-[-0.01em] text-ink"
          >
            Your Weekly Progress
          </h2>
        </div>
        <p className="shrink-0 text-[11px] text-muted">
          {completedDays} / {goal} days
        </p>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1">
        {week.map((day) => {
          const parsed = dateOnly(day.date);
          const isToday = day.date === todayDate;
          return (
            <div key={day.date} className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isToday
                    ? "border-[1.5px] border-forest-600 bg-cream-50 text-forest-800"
                    : day.active
                      ? "bg-forest-800 text-cream-50"
                      : "bg-[#ece5d8] text-transparent"
                }`}
                title={day.active ? `${day.date}: learning activity` : day.date}
              >
                {day.active ? (
                  <Check
                    size={13}
                    strokeWidth={2.4}
                    className={isToday ? "text-forest-700" : ""}
                  />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-cream-500/60" />
                )}
              </div>
              <span
                className={`text-[10px] leading-none ${
                  isToday ? "font-semibold text-forest-800" : "text-muted"
                }`}
              >
                {parsed.toLocaleDateString(undefined, { weekday: "short" })}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative mt-5 overflow-hidden rounded-xl border border-[#eddfca]/60 bg-[#f6ead9] px-3.5 py-4">
        <div className="relative z-10 flex items-start gap-2.5">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1dfc2] text-[#a97634]">
            <Trophy size={18} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold text-ink">
              {stats.currentStreak > 0 ? "Keep the streak alive" : "Begin your streak"}
            </p>
            <p className="mt-1 max-w-[195px] text-[11px] leading-[1.45] text-[#7a6a55]">
              {stats.currentStreak > 0
                ? `${stats.currentStreak}-day streak${
                    stats.longestStreak > stats.currentStreak
                      ? ` · best ${stats.longestStreak}`
                      : ""
                  }. ${nextLesson ? `Next: ${nextLesson.title}.` : "Every path is complete."}`
                : nextLesson
                  ? `Complete “${nextLesson.title}” to record your first learning day.`
                  : "Choose a learning path to begin."}
            </p>
          </div>
        </div>
        <SprigCorner className="pointer-events-none absolute -bottom-2 -right-2 w-[104px] opacity-60" />
      </div>
    </section>
  );
}
