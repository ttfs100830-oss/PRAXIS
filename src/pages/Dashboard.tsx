import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import type { Activity, LearningPath, Lesson, MapNode, PageId } from "../types";
import { useLearner } from "../context/LearnerContext";
import { buildMapGraph, compactMap } from "../lib/curriculum";
import { HeroBanner } from "../components/dashboard/HeroBanner";
import { LearningPathCard } from "../components/dashboard/LearningPathCard";
import { WeeklyProgress } from "../components/dashboard/WeeklyProgress";
import { QuickActions } from "../components/dashboard/QuickActions";
import { FeaturedLesson } from "../components/dashboard/FeaturedLesson";
import { LearningMapPanel } from "../components/dashboard/LearningMapPanel";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import {
  PromoCard,
  QuoteCard,
  XpCard,
} from "../components/dashboard/RightRailCards";

interface DashboardProps {
  onNavigate: (page: PageId) => void;
  onOpenPath: (path: LearningPath) => void;
  onOpenLesson: (path: LearningPath, lesson: Lesson) => void;
  onOpenNode: (node: MapNode) => void;
  onOpenActivity: (activity: Activity) => void;
}

export function Dashboard({
  onNavigate,
  onOpenPath,
  onOpenLesson,
  onOpenNode,
  onOpenActivity,
}: DashboardProps) {
  const { paths } = useLearner();
  const featuredPath =
    paths.find(
      (path) =>
        path.status === "In Progress" &&
        path.lessons.some((lesson) => !lesson.completed),
    ) ?? paths.find((path) => path.lessons.some((lesson) => !lesson.completed));
  const path = featuredPath ?? paths[0];
  const featured =
    path?.lessons.find((lesson) => !lesson.completed) ?? path?.lessons[0];

  const suggestedPaths = useMemo(() => {
    const inProgress = paths.filter((item) => item.status === "In Progress");
    const remaining = paths.filter((item) => item.status !== "In Progress");
    return [...inProgress, ...remaining].slice(0, 4);
  }, [paths]);

  const compactGraph = useMemo(() => {
    const graph = buildMapGraph(paths);
    return compactMap(graph.nodes, graph.connections, 8);
  }, [paths]);

  return (
    <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-[minmax(0,1fr)_328px]">
      <div className="min-w-0">
        <HeroBanner
          onContinue={() => {
            if (path && featured) onOpenLesson(path, featured);
            else onNavigate("paths");
          }}
        />

        <section aria-labelledby="paths-heading" className="mt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                id="paths-heading"
                className="display-title text-[22px] leading-none text-forest-950"
              >
                Learning Paths
              </h2>
              <p className="mt-1.5 text-[13px] text-muted">
                {paths.length} paths across foundations, application
                engineering, production and scaling.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("paths")}
              className="group mb-0.5 flex h-8 shrink-0 items-center gap-2 rounded-full border border-sand bg-cream-50 px-3.5 text-[11px] font-medium text-forest-800 shadow-[0_1px_2px_rgba(29,58,46,0.04)] transition-colors hover:border-forest-300 hover:bg-cream-100"
            >
              View All Paths
              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>

          <div className="mt-2.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 min-[1500px]:grid-cols-4">
            {suggestedPaths.map((item) => (
              <LearningPathCard
                key={item.id}
                path={item}
                onOpen={onOpenPath}
              />
            ))}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-4 md:auto-rows-[minmax(326px,auto)] md:grid-cols-2 min-[1500px]:grid-cols-3">
          {path && featured ? (
            <FeaturedLesson
              path={path}
              lesson={featured}
              onStart={() => onOpenLesson(path, featured)}
              onViewAll={() => onNavigate("paths")}
            />
          ) : null}
          <LearningMapPanel
            nodes={compactGraph.nodes}
            connections={compactGraph.connections}
            onViewMap={() => onNavigate("map")}
            onSelectNode={onOpenNode}
          />
          <div className="md:col-span-2 min-[1500px]:col-span-1">
            <RecentActivity
              onViewAll={() => onNavigate("progress")}
              onSelectActivity={onOpenActivity}
            />
          </div>
        </div>
      </div>

      <aside
        aria-label="Progress and shortcuts"
        className="flex min-w-0 flex-col gap-4"
      >
        <WeeklyProgress />
        <QuickActions onNavigate={onNavigate} />
        <PromoCard />
        <XpCard />
        <QuoteCard />
      </aside>
    </div>
  );
}
