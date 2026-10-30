import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import type {
  Activity,
  AssessmentAttempt,
  Discussion,
  LearningPath,
  Lesson,
  PageId,
} from "./types";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Toast } from "./components/ui/Modal";
import { Dashboard } from "./pages/Dashboard";
import { LearningPathsPage } from "./pages/LearningPathsPage";
import { LearningMapPage } from "./pages/LearningMapPage";
import { ChallengesPage } from "./pages/ChallengesPage";
import { SystemExplorerPage } from "./pages/SystemExplorerPage";
import { ProgressPage } from "./pages/ProgressPage";
import { CommunityPage } from "./pages/CommunityPage";
import { LessonPage } from "./pages/LessonPage";
import { AuthPage } from "./pages/AuthPage";
import { RecoveryPage } from "./pages/RecoveryPage";
import { AccountModal } from "./components/modals/AccountModal";
import {
  AboutModal,
  ActivityModal,
  AttemptReviewModal,
  ChallengeModal,
  ConceptModal,
  DiscussionModal,
  PathDetailModal,
  SystemModal,
} from "./components/modals/DetailModals";
import { useAuth } from "./context/AuthContext";
import { useLearner } from "./context/LearnerContext";
import {
  buildChallenges,
  buildMapGraph,
  buildSystems,
  findUiLesson,
} from "./lib/curriculum";
import { LogoMark } from "./components/illustrations/Botanical";

const pageTitles: Record<PageId, string> = {
  home: "Dashboard",
  paths: "Learning Paths",
  map: "Learning Map",
  challenges: "Challenges",
  explorer: "System Explorer",
  progress: "Progress",
  community: "Community",
};

interface SelectedLesson {
  path: LearningPath;
  lesson: Lesson;
}

export default function App() {
  const { loading, session, recoveryMode } = useAuth();

  if (loading) return <LoadingScreen />;
  if (recoveryMode) return <RecoveryPage />;
  if (!session) return <AuthPage />;
  return <PraxisShell />;
}

function PraxisShell() {
  const {
    loading,
    refreshing,
    error,
    setupRequired,
    paths,
    completedLessonIds,
    attempts,
    refresh,
  } = useLearner();

  const [page, setPage] = useState<PageId>("home");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [returnPage, setReturnPage] = useState<PageId>("home");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null,
  );
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null,
  );
  const [selectedAttempt, setSelectedAttempt] =
    useState<AssessmentAttempt | null>(null);
  const [selectedDiscussion, setSelectedDiscussion] =
    useState<Discussion | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const showToast = useCallback((message: string) => setToast(message), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const mapGraph = useMemo(() => buildMapGraph(paths), [paths]);
  const challenges = useMemo(
    () => buildChallenges(paths, attempts, completedLessonIds),
    [paths, attempts, completedLessonIds],
  );
  const systems = useMemo(() => buildSystems(paths), [paths]);

  const selectedPath = useMemo(
    () => paths.find((path) => path.id === selectedPathId) ?? null,
    [paths, selectedPathId],
  );
  const activeLesson = useMemo<SelectedLesson | null>(() => {
    if (!selectedLessonId) return null;
    return findUiLesson(paths, selectedLessonId);
  }, [paths, selectedLessonId]);

  const selectedNode = useMemo(
    () => mapGraph.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [mapGraph.nodes, selectedNodeId],
  );
  const selectedChallenge = useMemo(
    () => challenges.find((item) => item.id === selectedChallengeId) ?? null,
    [challenges, selectedChallengeId],
  );
  const selectedSystem = useMemo(
    () => systems.find((item) => item.id === selectedSystemId) ?? null,
    [systems, selectedSystemId],
  );

  const navigate = useCallback((next: PageId) => {
    setPage(next);
    setSelectedLessonId(null);
    setSelectedPathId(null);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openPath = useCallback((path: LearningPath) => {
    setSelectedPathId(path.id);
  }, []);

  const openLesson = useCallback(
    (_path: LearningPath, lesson: Lesson) => {
      setReturnPage(page);
      setSelectedPathId(null);
      setSelectedLessonId(lesson.id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [page],
  );

  const openLessonById = useCallback(
    (lessonId: string) => {
      const found = findUiLesson(paths, lessonId);
      if (!found) {
        showToast("That lesson could not be found in the curriculum.");
        return;
      }
      openLesson(found.path, found.lesson);
    },
    [openLesson, paths, showToast],
  );

  const leaveLesson = useCallback(() => {
    setSelectedLessonId(null);
    setPage(returnPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [returnPage]);

  useEffect(() => {
    const title = activeLesson
      ? activeLesson.lesson.title
      : pageTitles[page];
    document.title = `Praxis — ${title}`;
  }, [activeLesson, page]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileNavOpen]);

  return (
    <div className="min-h-screen bg-cream-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest-900 focus:px-4 focus:py-2 focus:text-sm focus:text-cream-50"
      >
        Skip to content
      </a>

      <Sidebar
        activePage={page}
        onNavigate={navigate}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        onOpenAccount={() => setAccountOpen(true)}
      />

      <div className="lg:pl-[272px]">
        <div className="mx-auto w-full max-w-[1560px] pl-4 pr-4 pt-4 sm:pr-6">
          <TopBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            onMenuOpen={() => setMobileNavOpen(true)}
            onNavigate={navigate}
            onOpenPath={openPath}
            onOpenLesson={openLesson}
            onOpenAccount={() => setAccountOpen(true)}
            onShowAbout={() => setAboutOpen(true)}
            onToast={showToast}
          />

          {(loading || refreshing) && (
            <div
              className="mb-3 h-[3px] overflow-hidden rounded-full bg-cream-300/70"
              role="status"
              aria-label="Refreshing your learning data"
            >
              <div className="h-full w-1/3 animate-pulse rounded-full bg-forest-600" />
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-[#e6cfae] bg-[#f8eedf] px-4 py-3 text-[#715c3d]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2.5">
                  <AlertTriangle size={17} className="mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold">
                      {setupRequired
                        ? "Database setup is required"
                        : "Your learning data could not be refreshed"}
                    </p>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed">
                      {setupRequired
                        ? "The curriculum is readable, but progress, assessments and community need the schema and seed files in supabase/. Apply the migrations, then supabase/seed.sql, in the Supabase SQL editor."
                        : error}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void refresh()}
                  disabled={refreshing}
                  className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-[#d9bd91] bg-cream-50 px-3 text-[10.5px] font-medium text-[#715c3d] hover:bg-cream-100 disabled:opacity-50"
                >
                  <RefreshCw size={11} />
                  Retry
                </button>
              </div>
            </div>
          )}

          <main id="main-content" className="pb-10">
            {activeLesson ? (
              <LessonPage
                key={activeLesson.lesson.id}
                path={activeLesson.path}
                lesson={activeLesson.lesson}
                onBack={leaveLesson}
                onOpenLesson={openLessonById}
                onOpenPath={openPath}
                onToast={showToast}
              />
            ) : (
              <>
                {page === "home" && (
                  <Dashboard
                    onNavigate={navigate}
                    onOpenPath={openPath}
                    onOpenLesson={openLesson}
                    onOpenNode={(node) => setSelectedNodeId(node.id)}
                    onOpenActivity={setSelectedActivity}
                  />
                )}
                {page === "paths" && (
                  <LearningPathsPage
                    searchQuery={searchQuery}
                    onClearSearch={() => setSearchQuery("")}
                    onOpenPath={openPath}
                  />
                )}
                {page === "map" && (
                  <LearningMapPage onSelectNode={(node) => setSelectedNodeId(node.id)} />
                )}
                {page === "challenges" && (
                  <ChallengesPage
                    onPreview={(challenge) => setSelectedChallengeId(challenge.id)}
                  />
                )}
                {page === "explorer" && (
                  <SystemExplorerPage
                    onInspect={(system) => setSelectedSystemId(system.id)}
                  />
                )}
                {page === "progress" && (
                  <ProgressPage
                    onOpenPath={openPath}
                    onOpenActivity={setSelectedActivity}
                    onReviewAttempt={setSelectedAttempt}
                  />
                )}
                {page === "community" && (
                  <CommunityPage
                    onOpenDiscussion={setSelectedDiscussion}
                    onToast={showToast}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {selectedPath && (
        <PathDetailModal
          path={selectedPath}
          onClose={() => setSelectedPathId(null)}
          onOpenLesson={openLesson}
        />
      )}

      {selectedNode && (
        <ConceptModal
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
          onOpenPath={(pathId) => {
            const path = paths.find((item) => item.id === pathId);
            if (path) {
              setSelectedNodeId(null);
              openPath(path);
            }
          }}
        />
      )}

      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallengeId(null)}
          onBegin={(challenge) => {
            setSelectedChallengeId(null);
            openLessonById(challenge.lessonId);
          }}
        />
      )}

      {selectedSystem && (
        <SystemModal
          system={selectedSystem}
          onClose={() => setSelectedSystemId(null)}
          onOpenPath={(pathId) => {
            const path = paths.find((item) => item.id === pathId);
            if (path) {
              setSelectedSystemId(null);
              openPath(path);
            }
          }}
        />
      )}

      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onOpenProgress={() => {
            setSelectedActivity(null);
            navigate("progress");
          }}
          onOpenLesson={(lessonId) => {
            setSelectedActivity(null);
            openLessonById(lessonId);
          }}
        />
      )}

      {selectedAttempt && (
        <AttemptReviewModal
          attempt={selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}

      {selectedDiscussion && (
        <DiscussionModal
          discussion={selectedDiscussion}
          onClose={() => setSelectedDiscussion(null)}
          onToast={showToast}
        />
      )}

      {accountOpen && (
        <AccountModal
          onClose={() => setAccountOpen(false)}
          onToast={showToast}
        />
      )}

      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}

      <Toast message={toast} onDismiss={dismissToast} />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-200 px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-sand bg-cream-50 px-5 py-4 shadow-card">
        <LogoMark className="h-10 w-10" />
        <div>
          <p className="text-[14px] font-semibold text-forest-950">Praxis</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
            <Loader2 size={11} className="animate-spin" />
            Restoring your session…
          </p>
        </div>
        <ArrowRight size={14} className="ml-2 text-muted" />
      </div>
    </div>
  );
}
