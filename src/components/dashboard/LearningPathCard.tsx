import { ArrowRight } from "lucide-react";
import type { LearningPath } from "../../types";
import { PathArt } from "../illustrations/PathArt";

interface LearningPathCardProps {
  path: LearningPath;
  onOpen: (path: LearningPath) => void;
  className?: string;
}

export function LearningPathCard({
  path,
  onOpen,
  className = "",
}: LearningPathCardProps) {
  const progress =
    path.totalLessons > 0
      ? Math.round((path.completedLessons / path.totalLessons) * 100)
      : 0;
  const inProgress = path.status === "In Progress";
  const completed = path.status === "Completed";

  return (
    <article
      className={`group relative flex min-h-[246px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-sand/90 bg-cream-50 p-3 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-forest-300/70 hover:shadow-lift ${className}`}
    >
      <button
        type="button"
        onClick={() => onOpen(path)}
        aria-label={`Open ${path.title} learning path`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-200"
      />

      <div className="relative -ml-1 -mt-1 h-[86px] w-[156px] shrink-0">
        <PathArt variant={path.art} className="h-full w-full" />
      </div>

      <span
        className={`absolute right-3 top-3 rounded-full px-2.5 py-[2px] text-[9.5px] font-medium leading-[1.4] ${
          completed
            ? "bg-forest-800 text-cream-50"
            : inProgress
              ? "bg-rust-500 text-cream-50"
              : "border border-[#d9dfcf] bg-[#e6eadb] text-forest-800"
        }`}
      >
        {path.status}
      </span>

      <h3 className="mt-0.5 text-[13.75px] font-semibold leading-[1.3] tracking-[-0.03em] text-ink">
        {path.title}
      </h3>
      <p className="mt-1 text-[11.5px] leading-[1.45] tracking-[-0.005em] text-muted">
        {path.blurb}
      </p>

      <div className="mt-auto pt-1.5">
        <p className="text-[11px] text-[#65725f]">
          {path.completedLessons} / {path.totalLessons} lessons
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <div
            className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#e9e2d4]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={path.totalLessons}
            aria-valuenow={path.completedLessons}
            aria-label={`${path.title} progress`}
          >
            <div
              className={`h-full rounded-full transition-[width] duration-500 ${
                progress > 0 ? "bg-forest-800" : "bg-transparent"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-sand bg-[#f4eee1] text-forest-800 transition-colors group-hover:border-forest-800 group-hover:bg-forest-800 group-hover:text-cream-50">
            <ArrowRight size={12} strokeWidth={1.9} />
          </span>
        </div>
      </div>
    </article>
  );
}
