import {
  BarChart3,
  BookOpen,
  Box,
  Home,
  Share2,
  Target,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import type { PageId } from "../types";
import { useLearner } from "../context/LearnerContext";
import { firstName } from "../lib/format";
import { LeafSprig, LogoMark } from "./illustrations/Botanical";

interface NavItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "paths", label: "Learning Paths", icon: BookOpen },
  { id: "map", label: "Learning Map", icon: Share2 },
  { id: "challenges", label: "Challenges", icon: Target },
  { id: "explorer", label: "System Explorer", icon: Box },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "community", label: "Community", icon: Users },
];

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAccount: () => void;
}

export function Sidebar({
  activePage,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  onOpenAccount,
}: SidebarProps) {
  const { profile, stats } = useLearner();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-forest-950/45 backdrop-blur-[1px] lg:hidden"
        />
      )}
      <aside
        aria-label="Primary navigation"
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col overflow-hidden bg-forest-900 text-cream-100 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(120% 80% at 0% 0%, rgba(84,122,98,0.32) 0%, transparent 46%), radial-gradient(100% 60% at 100% 100%, rgba(11,28,20,0.46) 0%, transparent 60%)",
          }}
        />

        <div className="relative flex items-start justify-between px-8 pb-1 pt-8">
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11 shrink-0" />
            <div>
              <p className="text-[18px] font-semibold leading-tight tracking-[-0.015em] text-cream-50">
                Praxis
              </p>
              <p className="mt-1 whitespace-nowrap text-[8px] font-medium uppercase leading-none tracking-[0.15em] text-forest-200/80">
                Understand · Explore · Build
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="mt-1 flex h-8 w-8 items-center justify-center rounded-full text-cream-200/80 hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="relative mt-6 flex flex-col gap-[3px] px-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={active ? "page" : undefined}
                className={`group flex items-center gap-3.5 rounded-xl px-4 py-[13px] text-left text-[14.5px] transition-colors ${
                  active
                    ? "bg-[#375a47] font-medium text-cream-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "text-forest-100/85 hover:bg-white/[0.06] hover:text-cream-50"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 1.8 : 1.6}
                  className={
                    active
                      ? "text-cream-50"
                      : "text-forest-200/85 transition-colors group-hover:text-cream-100"
                  }
                />
                <span className="tracking-[0.005em]">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="relative flex-1" />

        <div className="pointer-events-none relative mx-auto mb-6 w-full max-w-[232px] px-2">
          <LeafSprig className="absolute -left-7 bottom-12 h-52 w-36 opacity-80" />
          <div className="pointer-events-auto relative rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-[1px]">
            <button
              type="button"
              onClick={onOpenAccount}
              className="flex w-full items-start gap-2.5 rounded-lg text-left"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-100/10 text-cream-100">
                <UserRound size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] font-medium text-cream-100">
                  {profile.displayName || firstName(profile.displayName)}
                </span>
                <span className="mt-0.5 block text-[10px] text-forest-200/70">
                  Level {stats.level} · {stats.totalXp.toLocaleString()} XP
                </span>
              </span>
            </button>
            <p className="mt-3 border-t border-white/10 pt-2.5 text-[10px] leading-relaxed text-forest-200/60">
              Better understanding.
              <br />
              Stronger builders.
            </p>
          </div>
          <p className="mt-3 text-center text-[9px] uppercase tracking-[0.16em] text-forest-200/40">
            Private progress · authenticated account
          </p>
        </div>
      </aside>
    </>
  );
}
