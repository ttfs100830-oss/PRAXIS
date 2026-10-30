import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { LearningPath, Lesson } from "../../types";
import { FeaturedFlow } from "../illustrations/PanelArt";

interface FeaturedLessonProps {
  path: LearningPath;
  lesson: Lesson;
  onStart: () => void;
  onViewAll: () => void;
}

export function FeaturedLesson({
  path,
  lesson,
  onStart,
  onViewAll,
}: FeaturedLessonProps) {
  return (
    <section
      aria-labelledby="featured-heading"
      className="panel flex h-full flex-col overflow-hidden"
    >
      <div className="flex h-12 shrink-0 items-center gap-2 bg-[#2b4b39] px-3 text-cream-50 min-[1400px]:gap-2.5 min-[1400px]:px-4">
        <CheckCircle2 size={17} strokeWidth={1.7} className="shrink-0" />
        <h2
          id="featured-heading"
          className="whitespace-nowrap text-[13px] font-medium tracking-[0.005em] min-[1400px]:text-[13.5px]"
        >
          {lesson.completed ? "Review a Lesson" : "Next Lesson"}
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-1 py-1 text-[10.5px] text-cream-100/85 transition-colors hover:text-cream-50 min-[1400px]:text-[11px]"
        >
          View All
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <FeaturedFlow className="h-[58px] w-full" />

        <span className="mt-2.5 w-fit rounded-full bg-[#e7eadb] px-2.5 py-[3px] text-[10px] font-medium text-forest-700">
          {path.title}
        </span>
        <h3 className="mt-2 text-[16.5px] font-semibold leading-snug tracking-[-0.01em] text-ink">
          {lesson.title}
        </h3>
        <p className="mt-1.5 line-clamp-3 max-w-[290px] text-[12px] leading-[1.5] text-muted">
          {lesson.scope}
        </p>

        <button
          type="button"
          onClick={onStart}
          className="group mt-auto inline-flex h-[37px] w-fit items-center gap-2.5 rounded-full bg-forest-900 pl-4 pr-3.5 text-[12px] font-medium text-cream-50 transition-colors hover:bg-forest-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
        >
          {lesson.completed ? "Review lesson" : "Start lesson"}
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cream-50/10">
            <ArrowRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </button>
      </div>
    </section>
  );
}
