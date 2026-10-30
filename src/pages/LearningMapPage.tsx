import { useMemo } from "react";
import { ArrowUpRight, Info, Share2 } from "lucide-react";
import type { MapNode } from "../types";
import { useLearner } from "../context/LearnerContext";
import { buildMapGraph } from "../lib/curriculum";
import { LearningMapGraph } from "../components/LearningMapGraph";
import { PageIntro } from "../components/PageIntro";
import { LeafSprig } from "../components/illustrations/Botanical";

interface LearningMapPageProps {
  onSelectNode: (node: MapNode) => void;
}

const statusLabel: Record<MapNode["status"], string> = {
  done: "Completed",
  active: "Started",
  locked: "Not started",
};

const statusDot: Record<MapNode["status"], string> = {
  done: "bg-forest-600",
  active: "bg-rust-400",
  locked: "bg-cream-500",
};

export function LearningMapPage({ onSelectNode }: LearningMapPageProps) {
  const { paths } = useLearner();
  const graph = useMemo(() => buildMapGraph(paths), [paths]);
  const started = graph.nodes.filter((node) => node.status !== "locked").length;

  return (
    <div className="animate-fade-in">
      <PageIntro
        eyebrow="Connections"
        title="Your Learning Map"
        description="Each node is a real curriculum path. Lines show cross-path prerequisite relationships taken from the supplied lesson index."
        aside={
          <div className="flex items-center gap-2 rounded-full border border-sand bg-cream-50 px-3.5 py-2 text-[11.5px] text-muted">
            <Share2 size={14} className="text-forest-700" />
            {graph.nodes.length} paths · {started} started
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_306px]">
        <section className="panel relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand/80 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <Share2 size={17} className="text-forest-800" />
              <h2 className="text-[14px] font-semibold text-ink">
                Curriculum dependency map
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-600" />
                Completed path
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rust-400" />
                In progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cream-500" />
                Not started
              </span>
            </div>
          </div>

          <div className="relative overflow-x-auto px-5 py-7 sm:px-10">
            <SprigCornerLeft />
            <SprigCornerRight />
            <LearningMapGraph
              nodes={graph.nodes}
              connections={graph.connections}
              onSelect={onSelectNode}
              variant="full"
              className="relative z-10 mx-auto min-w-[680px] max-w-[860px]"
            />
          </div>

          <div className="border-t border-sand/70 px-5 py-3 text-[10.5px] text-muted">
            Rows follow the four curriculum tiers. Select a path to inspect its
            modules, prerequisites and completion.
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="panel p-4">
            <h2 className="text-[13.5px] font-semibold text-ink">
              Paths in this map
            </h2>
            <ul className="mt-3 space-y-1">
              {graph.nodes.map((node) => (
                <li key={node.id}>
                  <button
                    type="button"
                    onClick={() => onSelectNode(node)}
                    className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-cream-200/70"
                  >
                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[node.status]}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-medium text-ink">
                        {node.label}
                      </span>
                      <span className="block text-[9.5px] text-muted">
                        {node.completedLessons} / {node.totalLessons} lessons
                      </span>
                    </span>
                    <span className="shrink-0 text-[10px] text-muted">
                      {statusLabel[node.status]}
                    </span>
                    <ArrowUpRight
                      size={12}
                      className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel relative overflow-hidden p-4">
            <LeafSprig className="pointer-events-none absolute -right-6 bottom-0 h-28 w-20 opacity-35" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-forest-700">
                <Info size={15} />
                <h2 className="text-[12.5px] font-semibold">Reading the map</h2>
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                A line joins two paths when at least one lesson in the later path
                lists a lesson from the earlier path as a prerequisite. Completing
                those prerequisite lessons unlocks the lesson itself.
              </p>
              <p className="mt-2 text-[10.5px] text-muted/80">
                Path status reflects lessons completed in your authenticated
                account, not a sample state.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function SprigCornerLeft() {
  return (
    <LeafSprig className="pointer-events-none absolute -left-6 bottom-0 h-48 w-32 opacity-25" />
  );
}

function SprigCornerRight() {
  return (
    <LeafSprig className="pointer-events-none absolute -right-6 top-0 h-44 w-32 -scale-x-100 rotate-180 opacity-20" />
  );
}
