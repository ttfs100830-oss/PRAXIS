import { useMemo } from "react";
import {
  ArrowRight,
  Box,
  CloudUpload,
  Database,
  LayoutPanelLeft,
  Server,
  type LucideIcon,
} from "lucide-react";
import type { LearningPath, SystemCard } from "../types";
import { useLearner } from "../context/LearnerContext";
import { buildSystems, curriculumStats } from "../lib/curriculum";
import { PageIntro } from "../components/PageIntro";
import { FeaturedFlow } from "../components/illustrations/PanelArt";

interface SystemExplorerPageProps {
  onInspect: (system: SystemCard) => void;
  onOpenPath?: (path: LearningPath) => void;
}

const systemIcons: LucideIcon[] = [
  LayoutPanelLeft,
  Server,
  CloudUpload,
  Database,
];

export function SystemExplorerPage({
  onInspect,
}: SystemExplorerPageProps) {
  const { paths } = useLearner();
  const systems = useMemo(() => buildSystems(paths), [paths]);

  return (
    <div className="animate-fade-in">
      <PageIntro
        eyebrow="Curriculum domains"
        title="System Explorer"
        description="The supplied curriculum organised into four domains. Open a domain to inspect its paths, modules and your completion, then continue into a path."
        aside={
          <div className="flex items-center gap-2 rounded-full border border-sand bg-cream-50 px-3.5 py-2 text-[11.5px] text-muted">
            <Box size={14} className="text-forest-700" />
            {systems.length} domains · {curriculumStats.modules} modules
          </div>
        }
      />

      <section className="panel mb-5 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand/80 px-5 py-4">
          <div>
            <h2 className="text-[13.5px] font-semibold text-ink">
              How the curriculum is structured
            </h2>
            <p className="mt-0.5 text-[11px] text-muted">
              Foundations → application engineering → production → scaling
            </p>
          </div>
          <span className="rounded-full bg-cream-200/80 px-2.5 py-1 text-[10px] text-muted">
            Curriculum taxonomy
          </span>
        </div>
        <div className="flex justify-center px-5 py-5">
          <FeaturedFlow className="h-[62px] w-full max-w-[560px]" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {systems.map((system, index) => {
          const Icon = systemIcons[index] ?? Box;
          const systemPaths = paths.filter((path) =>
            system.pathIds.includes(path.id),
          );
          const percent = system.lessonCount
            ? Math.round((system.completedLessons / system.lessonCount) * 100)
            : 0;
          return (
            <article key={system.id} className="panel p-5">
              <div className="flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e8ecdd] text-forest-700">
                  <Icon size={20} strokeWidth={1.7} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-[16px] font-semibold text-ink">
                      {system.name}
                    </h2>
                    <span className="rounded-full border border-sand bg-cream-100 px-2 py-0.5 text-[9.5px] uppercase tracking-[0.06em] text-muted">
                      {system.tier}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                    {system.detail}
                  </p>

                  <div className="mt-3 flex items-center gap-2.5">
                    <div
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-300"
                      role="progressbar"
                      aria-label={`${system.name} completion`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={percent}
                    >
                      <div
                        className="h-full rounded-full bg-forest-800"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-[10px] text-muted">
                      {system.completedLessons} / {system.lessonCount}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {systemPaths.map((path) => (
                      <span
                        key={path.id}
                        className="rounded-full border border-sand bg-cream-100 px-2 py-0.5 text-[9.5px] text-forest-800"
                      >
                        {path.title}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[10.5px] text-forest-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-forest-500" />
                      {system.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => onInspect(system)}
                      className="group flex items-center gap-1.5 rounded-full border border-sand bg-cream-50 px-3 py-1.5 text-[10.5px] font-medium text-forest-800 transition-colors hover:border-forest-300 hover:bg-cream-100"
                    >
                      Inspect domain
                      <ArrowRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
