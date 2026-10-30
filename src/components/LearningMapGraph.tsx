import {
  BookOpen,
  CloudUpload,
  Database,
  LayoutPanelLeft,
  type LucideIcon,
} from "lucide-react";
import type { MapNode } from "../types";

const tierMeta: Record<
  string,
  { icon: LucideIcon; tone: string }
> = {
  "Tier 1 - Foundations": { icon: BookOpen, tone: "bg-[#4d7058]" },
  "Tier 2 - Core Application Engineering": {
    icon: LayoutPanelLeft,
    tone: "bg-[#c0704d]",
  },
  "Tier 3 - Production Engineering": {
    icon: CloudUpload,
    tone: "bg-[#6c5b7d]",
  },
  "Tier 4 - Scaling & Specializations": {
    icon: Database,
    tone: "bg-[#4d7058]",
  },
};

const statusDot: Record<MapNode["status"], string> = {
  done: "bg-forest-600",
  active: "bg-rust-400",
  locked: "bg-cream-500",
};

interface LearningMapGraphProps {
  nodes: MapNode[];
  connections: Array<[string, string]>;
  onSelect: (node: MapNode) => void;
  variant?: "compact" | "full";
  className?: string;
}

export function LearningMapGraph({
  nodes,
  connections,
  onSelect,
  variant = "compact",
  className = "",
}: LearningMapGraphProps) {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const isFull = variant === "full";

  return (
    <div
      className={`relative ${isFull ? "min-h-[440px]" : "min-h-[228px]"} ${className}`}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {connections.map(([fromId, toId]) => {
          const from = byId.get(fromId);
          const to = byId.get(toId);
          if (!from || !to) return null;
          const midY = (from.y + to.y) / 2;
          const d = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
          return (
            <path
              key={`${fromId}-${toId}`}
              d={d}
              fill="none"
              stroke="#c9c0ac"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {connections.map(([fromId, toId]) => {
          const from = byId.get(fromId);
          const to = byId.get(toId);
          if (!from || !to) return null;
          return (
            <circle
              key={`dot-${fromId}-${toId}`}
              cx={(from.x + to.x) / 2}
              cy={(from.y + to.y) / 2}
              r="1"
              fill="#b9c7ac"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {nodes.map((node) => {
        const meta = tierMeta[node.tier];
        const Icon = meta?.icon ?? BookOpen;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onSelect(node)}
            title={`${node.label} · ${node.completedLessons}/${node.totalLessons} lessons complete`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            aria-label={`Open ${node.label} learning path`}
            className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center rounded-full border border-sand bg-cream-50 text-ink shadow-[0_2px_6px_rgba(29,58,46,0.06)] transition-all hover:-translate-y-[calc(50%+1px)] hover:border-forest-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-400/70 ${
              isFull
                ? "gap-1.5 px-2.5 py-1.5 text-[11px]"
                : "gap-1.5 px-2 py-1.5 text-[10.5px]"
            }`}
          >
            <span
              className={`flex shrink-0 items-center justify-center rounded-[5px] text-cream-50 ${meta?.tone ?? "bg-forest-600"} ${
                isFull ? "h-5 w-5" : "h-[18px] w-[18px]"
              }`}
            >
              <Icon size={isFull ? 11 : 11} strokeWidth={2} />
            </span>
            <span className="whitespace-nowrap font-medium leading-none">
              {node.label}
            </span>
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[node.status]}`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
