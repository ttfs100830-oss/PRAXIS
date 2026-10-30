import {
  ArrowRight,
  BarChart3,
  Box,
  Share2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { PageId, QuickAction } from "../../types";

const quickActions: QuickAction[] = [
  {
    id: "quick-map",
    title: "Learning Map",
    description: "See how paths connect",
    page: "map",
    tone: "cream",
    icon: "map",
  },
  {
    id: "quick-challenges",
    title: "Try a Challenge",
    description: "Auto-graded assessment items",
    page: "challenges",
    tone: "rust",
    icon: "bolt",
  },
  {
    id: "quick-explorer",
    title: "System Explorer",
    description: "Browse the four curriculum tiers",
    page: "explorer",
    tone: "forest",
    icon: "box",
  },
  {
    id: "quick-progress",
    title: "Your Progress",
    description: "XP, attempts and achievements",
    page: "progress",
    tone: "cream",
    icon: "chart",
  },
];

const iconMap: Record<QuickAction["icon"], LucideIcon> = {
  map: Share2,
  bolt: Zap,
  box: Box,
  chart: BarChart3,
};

const toneMap: Record<QuickAction["tone"], string> = {
  cream: "bg-[#eee9db] text-forest-700",
  rust: "bg-rust-500 text-cream-50",
  forest: "bg-forest-800 text-cream-50",
};

interface QuickActionsProps {
  onNavigate: (page: PageId) => void;
}

export function QuickActions({ onNavigate }: QuickActionsProps) {
  return (
    <section aria-labelledby="quick-actions-heading" className="panel p-3">
      <div className="px-2 pb-2 pt-1">
        <h2
          id="quick-actions-heading"
          className="text-[15px] font-semibold tracking-[-0.01em] text-ink"
        >
          Quick Actions
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {quickActions.map((action) => {
          const Icon = iconMap[action.icon];
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onNavigate(action.page)}
              className="group flex w-full items-center gap-3 rounded-xl border border-sand/90 bg-cream-50 px-3 py-2.5 text-left transition-colors hover:border-forest-300/70 hover:bg-cream-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-400/70"
            >
              <span
                className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full ${toneMap[action.tone]}`}
              >
                <Icon size={17} strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium leading-snug text-ink">
                  {action.title}
                </span>
                <span className="block truncate text-[11px] leading-snug text-muted">
                  {action.description}
                </span>
              </span>
              <ArrowRight
                size={15}
                strokeWidth={1.7}
                className="shrink-0 text-[#8b958a] transition-transform group-hover:translate-x-0.5 group-hover:text-forest-800"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
