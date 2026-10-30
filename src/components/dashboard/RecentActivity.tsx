import {
  ArrowRight,
  Check,
  Clock3,
  Play,
  Trophy,
} from "lucide-react";
import type { Activity } from "../../types";
import { useLearner } from "../../context/LearnerContext";
import { formatRelativeTime } from "../../lib/format";

interface RecentActivityProps {
  onViewAll: () => void;
  onSelectActivity: (activity: Activity) => void;
}

export function RecentActivity({
  onViewAll,
  onSelectActivity,
}: RecentActivityProps) {
  const { activity } = useLearner();
  const recent = activity.slice(0, 5);

  return (
    <section
      aria-labelledby="activity-heading"
      className="panel flex h-full flex-col overflow-hidden"
    >
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-sand/80 px-3 min-[1400px]:gap-2.5 min-[1400px]:px-4">
        <Clock3
          size={17}
          strokeWidth={1.7}
          className="shrink-0 text-forest-800"
        />
        <h2
          id="activity-heading"
          className="whitespace-nowrap text-[13px] font-medium text-ink min-[1400px]:text-[13.5px]"
        >
          Recent Activity
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-1 py-1 text-[10.5px] text-muted transition-colors hover:text-forest-800 min-[1400px]:text-[11px]"
        >
          View All
          <ArrowRight size={12} />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-5 py-6 text-center">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-200 text-forest-700">
            <Clock3 size={15} />
          </span>
          <p className="mt-2 text-[12px] font-medium text-ink">No activity yet</p>
          <p className="mt-1 max-w-[230px] text-[10.5px] leading-relaxed text-muted">
            Completing a lesson or submitting an assessment adds a verified event
            here.
          </p>
        </div>
      ) : (
        <ul className="flex flex-1 flex-col justify-center gap-0.5 px-3 py-2 md:grid md:grid-cols-2 md:content-center md:gap-x-6 min-[1500px]:flex min-[1500px]:flex-col">
          {recent.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectActivity(item)}
                className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-[7px] text-left transition-colors hover:bg-cream-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-400/70"
              >
                <span
                  className={`flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full text-cream-50 ${
                    item.kind === "quiz" || item.kind === "achievement"
                      ? "bg-rust-500"
                      : "bg-forest-700"
                  }`}
                >
                  {item.kind === "completed" && (
                    <Check size={13} strokeWidth={2.5} />
                  )}
                  {(item.kind === "quiz" || item.kind === "achievement") && (
                    <Trophy size={13} strokeWidth={2} />
                  )}
                  {item.kind === "started" && (
                    <Play size={11} strokeWidth={2} className="-ml-px" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11.5px] font-semibold leading-tight text-ink">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[11.5px] leading-tight text-[#5f6d5f]">
                    {item.detail}
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-tight text-muted/90">
                    {formatRelativeTime(item.occurredAt)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
