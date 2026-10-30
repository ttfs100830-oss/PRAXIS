import { useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  ChevronDown,
  CirclePlay,
  Info,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import type { LearningPath, Lesson, Notification, PageId } from "../types";
import { useAuth } from "../context/AuthContext";
import { useLearner } from "../context/LearnerContext";
import {
  searchCurriculum,
  searchSnippet,
  searchSuggestions,
  type SearchHit,
} from "../lib/curriculum";
import { useClickOutside } from "../hooks/useClickOutside";
import { Avatar } from "./illustrations/Botanical";

interface TopBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onMenuOpen: () => void;
  onNavigate: (page: PageId) => void;
  onOpenPath: (path: LearningPath) => void;
  onOpenLesson: (path: LearningPath, lesson: Lesson) => void;
  onOpenAccount: () => void;
  onShowAbout: () => void;
  onToast: (message: string) => void;
}

export function TopBar({
  query,
  onQueryChange,
  onMenuOpen,
  onNavigate,
  onOpenPath,
  onOpenLesson,
  onOpenAccount,
  onShowAbout,
  onToast,
}: TopBarProps) {
  const { signOut } = useAuth();
  const {
    profile,
    stats,
    paths,
    notifications,
    markRead,
    markAllRead,
  } = useLearner();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const searchRef = useClickOutside<HTMLDivElement>(() => setSearchOpen(false));
  const notificationsRef = useClickOutside<HTMLDivElement>(() =>
    setNotificationsOpen(false),
  );
  const profileRef = useClickOutside<HTMLDivElement>(() =>
    setProfileOpen(false),
  );

  const results = useMemo<SearchHit[]>(
    () => searchCurriculum(query, paths, 7),
    [query, paths],
  );

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  const closeAllMenus = () => {
    setSearchOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    closeAllMenus();
    onNavigate("paths");
  };

  const openSearchResult = (result: SearchHit) => {
    closeAllMenus();
    if (result.kind === "path" || !result.lesson) {
      onOpenPath(result.path);
    } else {
      onOpenLesson(result.path, result.lesson);
    }
  };

  const handleMarkAllRead = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const count = await markAllRead();
      onToast(
        count > 0
          ? `${count} notification${count === 1 ? "" : "s"} marked as read.`
          : "There are no unread notifications.",
      );
    } catch (error) {
      onToast(error instanceof Error ? error.message : "Could not update notifications.");
    } finally {
      setBusy(false);
    }
  };

  const openNotification = async (notification: Notification) => {
    try {
      if (notification.unread) {
        await markRead(notification.id);
      }
      setNotificationsOpen(false);
      if (notification.kind === "lesson" || notification.kind === "assessment") {
        onNavigate("progress");
      }
    } catch (error) {
      onToast(error instanceof Error ? error.message : "Could not mark the notification as read.");
    }
  };

  const handleSignOut = async () => {
    closeAllMenus();
    try {
      await signOut();
    } catch {
      onToast("Could not sign out. Try again.");
    }
  };

  return (
    <header className="relative z-30 mb-3 flex items-center gap-3">
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Open navigation"
        className="icon-btn -ml-1 shrink-0 lg:hidden"
      >
        <Menu size={21} />
      </button>

      <div ref={searchRef} className="relative w-full max-w-[470px]">
        <form onSubmit={handleSearchSubmit} role="search">
          <label htmlFor="global-search" className="sr-only">
            Search lessons, concepts, or topics
          </label>
          <div
            className={`flex h-[42px] items-center gap-2.5 rounded-full border bg-[#f0eade]/85 px-4 transition-colors ${
              searchOpen
                ? "border-forest-300 bg-cream-50 shadow-[0_0_0_3px_rgba(97,125,95,0.09)]"
                : "border-cream-400/80 hover:border-cream-500"
            }`}
          >
            <Search size={17} className="shrink-0 text-muted" strokeWidth={1.9} />
            <input
              id="global-search"
              type="text"
              value={query}
              onChange={(event) => {
                onQueryChange(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => {
                setSearchOpen(true);
                setNotificationsOpen(false);
                setProfileOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchOpen(false);
              }}
              placeholder="Search lessons, concepts, or topics..."
              autoComplete="off"
              className="h-full w-full bg-transparent text-[13.5px] text-ink placeholder:text-[#8b9187] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  onQueryChange("");
                  setSearchOpen(true);
                }}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted hover:bg-cream-300 hover:text-ink"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </form>

        {searchOpen && (
          <div className="panel animate-fade-up absolute left-0 right-0 top-[50px] z-40 overflow-hidden p-2 shadow-lift">
            {query.trim() ? (
              results.length > 0 ? (
                <>
                  <p className="px-2.5 pb-1.5 pt-1 text-[10.5px] font-medium uppercase tracking-[0.15em] text-muted">
                    Results for “{query.trim()}”
                  </p>
                  <ul>
                    {results.map((result) => {
                      const key =
                        result.kind === "path" || !result.lesson
                          ? `path-${result.path.id}`
                          : `lesson-${result.lesson.id}`;
                      const title =
                        result.kind === "path" || !result.lesson
                          ? result.path.title
                          : result.lesson.title;
                      const meta =
                        result.kind === "path" || !result.lesson
                          ? `${result.path.totalLessons} lessons · ${result.path.completedLessons} completed`
                          : `${result.path.title} · ${result.lesson.duration}`;
                      return (
                        <li key={key}>
                          <button
                            type="button"
                            onClick={() => openSearchResult(result)}
                            className="flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-cream-200/80"
                          >
                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cream-300/60 text-forest-700">
                              {result.kind === "path" || !result.lesson ? (
                                <BookOpen size={15} />
                              ) : (
                                <CirclePlay size={15} />
                              )}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13px] font-medium text-ink">
                                {title}
                              </span>
                              <span className="block truncate text-[11.5px] text-muted">
                                {meta}
                              </span>
                              {result.lesson && (
                                <span className="mt-0.5 line-clamp-2 block text-[10.5px] leading-snug text-muted/90">
                                  {searchSnippet(result.lesson.id, query)}
                                </span>
                              )}
                            </span>
                            <ArrowRight
                              size={14}
                              className="mt-1.5 shrink-0 text-muted"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    onClick={() => {
                      closeAllMenus();
                      onNavigate("paths");
                    }}
                    className="mt-1 flex w-full items-center justify-between rounded-lg border-t border-sand/80 px-2.5 py-2.5 text-[12px] font-medium text-forest-700 hover:bg-cream-200/60"
                  >
                    <span>See all matches in Learning Paths</span>
                    <ArrowRight size={14} />
                  </button>
                </>
              ) : (
                <div className="px-3 py-6 text-center">
                  <p className="text-[13px] font-medium text-ink">
                    No matches for “{query.trim()}”
                  </p>
                  <p className="mt-1 text-[12px] text-muted">
                    Search runs across every lesson title, scope and lesson body.
                  </p>
                </div>
              )
            ) : (
              <div className="px-1 pb-1">
                <p className="px-2 pb-2 pt-1 text-[10.5px] font-medium uppercase tracking-[0.15em] text-muted">
                  Try searching for
                </p>
                <div className="flex flex-wrap gap-1.5 px-1.5 pb-2">
                  {searchSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => onQueryChange(suggestion)}
                      className="rounded-full border border-sand bg-cream-100 px-2.5 py-1 text-[11.5px] text-forest-800 transition-colors hover:border-forest-300 hover:bg-cream-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <p className="border-t border-sand/70 px-2 pb-1 pt-2 text-[11px] text-muted">
                  Press Enter to browse all learning paths.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
        <div ref={notificationsRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setProfileOpen(false);
              setSearchOpen(false);
            }}
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
            aria-expanded={notificationsOpen}
            className="icon-btn relative"
          >
            <Bell size={20} strokeWidth={1.7} />
            {unreadCount > 0 && (
              <span className="absolute right-[9px] top-[9px] h-[7px] w-[7px] rounded-full border border-cream-200 bg-rust-500" />
            )}
          </button>

          {notificationsOpen && (
            <div className="panel animate-fade-up absolute right-0 top-[48px] z-40 w-[min(340px,calc(100vw-2rem))] overflow-hidden shadow-lift">
              <div className="flex items-center justify-between border-b border-sand/80 px-4 py-3">
                <div>
                  <p className="text-[13px] font-semibold text-ink">
                    Notifications
                  </p>
                  <p className="text-[11px] text-muted">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "All caught up"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleMarkAllRead()}
                  disabled={unreadCount === 0 || busy}
                  className="text-[11px] font-medium text-rust-600 transition-colors hover:text-rust-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Mark all read
                </button>
              </div>
              {notifications.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-[12.5px] font-medium text-ink">
                    No notifications yet
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    Lesson completions, assessment results and achievements will
                    appear here.
                  </p>
                </div>
              ) : (
                <ul className="max-h-[320px] overflow-y-auto scrollbar-subtle">
                  {notifications.map((notification) => (
                    <li key={notification.id}>
                      <button
                        type="button"
                        onClick={() => void openNotification(notification)}
                        className="flex w-full gap-2.5 border-b border-sand/50 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-cream-200/60"
                      >
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            notification.unread ? "bg-rust-500" : "bg-transparent"
                          }`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12.5px] font-medium leading-snug text-ink">
                            {notification.title}
                          </span>
                          <span className="mt-0.5 block text-[11.5px] leading-snug text-muted">
                            {notification.detail}
                          </span>
                          <span className="mt-1 block text-[10.5px] text-muted/80">
                            {notification.time}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  onNavigate("progress");
                }}
                className="flex w-full items-center justify-center gap-1.5 border-t border-sand/80 py-2.5 text-[11.5px] font-medium text-forest-700 hover:bg-cream-200/60"
              >
                Open progress overview
                <ArrowRight size={13} />
              </button>
            </div>
          )}
        </div>

        <div className="mx-1 hidden h-7 w-px bg-cream-400/60 sm:block" />

        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((open) => !open);
              setNotificationsOpen(false);
              setSearchOpen(false);
            }}
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1 transition-colors hover:bg-cream-300/50 sm:pr-2"
          >
            <Avatar className="h-10 w-10 rounded-full" />
            <span className="hidden text-[14px] font-medium text-ink sm:block">
              {profile.displayName}
            </span>
            <ChevronDown
              size={15}
              className={`hidden text-forest-800 transition-transform sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <div className="panel animate-fade-up absolute right-0 top-[52px] z-40 w-[264px] overflow-hidden shadow-lift">
              <div className="border-b border-sand/80 px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-10 w-10 rounded-full" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-ink">
                      {profile.displayName}
                    </p>
                    <p className="text-[11px] text-muted">
                      Level {stats.level} · {stats.totalXp.toLocaleString()} XP
                    </p>
                  </div>
                </div>
                <p className="mt-2.5 rounded-md bg-cream-200/80 px-2 py-1.5 text-[10px] leading-snug text-muted">
                  {stats.completedLessons} lesson
                  {stats.completedLessons === 1 ? "" : "s"} completed ·{" "}
                  {stats.currentStreak}-day streak
                </p>
              </div>
              <div className="p-1.5">
                {[
                  {
                    icon: UserRound,
                    label: "Profile & account",
                    action: onOpenAccount,
                  },
                  {
                    icon: Settings,
                    label: "Progress overview",
                    action: () => onNavigate("progress"),
                  },
                  {
                    icon: Info,
                    label: "About Praxis",
                    action: onShowAbout,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        closeAllMenus();
                        item.action();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] text-forest-800 transition-colors hover:bg-cream-200/80"
                    >
                      <Icon size={15} className="text-muted" />
                      {item.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] text-rust-700 transition-colors hover:bg-rust-50"
                >
                  <LogOut size={15} className="text-rust-500" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
