import { ArrowRight, Share2 } from "lucide-react";
import type { MapNode } from "../../types";
import { LearningMapGraph } from "../LearningMapGraph";
import { SprigCorner } from "../illustrations/Botanical";

interface LearningMapPanelProps {
  nodes: MapNode[];
  connections: Array<[string, string]>;
  onViewMap: () => void;
  onSelectNode: (node: MapNode) => void;
}

export function LearningMapPanel({
  nodes,
  connections,
  onViewMap,
  onSelectNode,
}: LearningMapPanelProps) {
  return (
    <section
      aria-labelledby="map-panel-heading"
      className="panel flex h-full flex-col overflow-hidden"
    >
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-sand/80 px-3 min-[1400px]:gap-2.5 min-[1400px]:px-4">
        <Share2 size={17} strokeWidth={1.7} className="shrink-0 text-forest-800" />
        <h2
          id="map-panel-heading"
          className="whitespace-nowrap text-[13px] font-medium text-ink min-[1400px]:text-[13.5px]"
        >
          Your Learning Map
        </h2>
        <button
          type="button"
          onClick={onViewMap}
          className="ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-1 py-1 text-[10.5px] text-muted transition-colors hover:text-forest-800 min-[1400px]:text-[11px]"
        >
          View Map
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="relative flex-1 px-2 pb-1 pt-1">
        <SprigCorner className="pointer-events-none absolute -left-3 bottom-0 w-24 opacity-45" />
        <SprigCorner className="pointer-events-none absolute -right-3 bottom-0 w-24 -scale-x-100 opacity-40" />
        <LearningMapGraph
          nodes={nodes}
          connections={connections}
          onSelect={onSelectNode}
          variant="compact"
          className="relative z-10 h-full px-1"
        />
      </div>
    </section>
  );
}
