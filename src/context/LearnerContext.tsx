import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Activity,
  AssessmentAttempt,
  AssessmentResult,
  EarnedAchievement,
  LearnerProfile,
  LearnerStats,
  LearningPath,
  LearningState,
  Notification,
  WeeklyActivityDay,
} from "../types";
import { useAuth } from "./AuthContext";
import {
  completeLesson as completeLessonRequest,
  fetchLearningState,
  markAllNotificationsRead,
  markNotificationRead,
  normalizeError,
  submitAssessment as submitAssessmentRequest,
  updateSettings,
} from "../lib/api";
import { buildUiPaths } from "../lib/curriculum";
import { formatRelativeTime } from "../lib/format";

const activityKinds = new Set(["completed", "quiz", "started", "achievement"]);

const emptyStats: LearnerStats = {
  totalXp: 0,
  level: 1,
  levelXp: 0,
  levelTarget: 500,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  weeklyGoal: 7,
  completedLessons: 0,
  assessmentsPassed: 0,
  assessmentsSubmitted: 0,
};

interface LearnerContextValue {
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  setupRequired: boolean;
  state: LearningState | null;
  profile: LearnerProfile;
  stats: LearnerStats;
  paths: LearningPath[];
  completedLessonIds: Set<string>;
  weeklyActivity: WeeklyActivityDay[];
  activity: Activity[];
  notifications: Notification[];
  achievements: EarnedAchievement[];
  attempts: AssessmentAttempt[];
  refresh: () => Promise<void>;
  completeLesson: (lessonId: string) => Promise<{
    alreadyCompleted: boolean;
    lessonId: string;
    xpAwarded: number;
    totalXp: number;
    level: number;
    currentStreak: number;
    longestStreak?: number;
    completedAt: string;
    achievementsAwarded?: string[];
  }>;
  submitAssessment: (
    assessmentId: string,
    answers: Record<string, string | { option_id?: string; text?: string }>,
  ) => Promise<AssessmentResult>;
  updateProfileSettings: (
    displayName: string,
    bio: string,
    weeklyGoal: number,
  ) => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<number>;
}

const LearnerContext = createContext<LearnerContextValue | null>(null);

function fallbackName(email: string | undefined, metadataName: unknown): string {
  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim().slice(0, 80);
  }
  const local = email?.split("@")[0]?.replace(/[._-]+/g, " ").trim();
  return local ? local.slice(0, 80) : "Learner";
}

export function LearnerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupRequired, setSetupRequired] = useState(false);
  const [state, setState] = useState<LearningState | null>(null);
  const requestId = useRef(0);

  const refresh = useCallback(async () => {
    if (!user) {
      setState(null);
      setError(null);
      setSetupRequired(false);
      setLoading(false);
      return;
    }
    const currentRequest = ++requestId.current;
    setRefreshing(true);
    setError(null);
    try {
      const next = await fetchLearningState();
      if (currentRequest !== requestId.current) return;
      setState(next);
      setSetupRequired(false);
    } catch (requestError) {
      if (currentRequest !== requestId.current) return;
      const normalized = normalizeError(requestError);
      setError(normalized.message);
      setSetupRequired(normalized.setupRequired);
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setState(null);
      setLoading(false);
      setError(null);
      setSetupRequired(false);
      return;
    }
    setLoading(true);
    void refresh();
  }, [user, refresh]);

  const paths = useMemo(
    () => buildUiPaths(state?.completedLessonIds ?? []),
    [state?.completedLessonIds],
  );

  const completedLessonIds = useMemo(
    () => new Set(state?.completedLessonIds ?? []),
    [state?.completedLessonIds],
  );

  const profile = useMemo<LearnerProfile>(
    () => ({
      displayName:
        state?.profile.displayName ??
        fallbackName(user?.email, user?.user_metadata?.display_name),
      bio: state?.profile.bio ?? "",
      createdAt: state?.profile.createdAt ?? "",
    }),
    [state?.profile, user],
  );

  const activity = useMemo<Activity[]>(
    () =>
      (state?.activity ?? []).map((item) => ({
        ...item,
        kind: activityKinds.has(item.kind) ? item.kind : "started",
        time: formatRelativeTime(item.occurredAt),
      })),
    [state?.activity],
  );

  const notifications = useMemo<Notification[]>(
    () =>
      (state?.notifications ?? []).map((item) => ({
        ...item,
        unread: !item.readAt,
        time: formatRelativeTime(item.createdAt),
      })),
    [state?.notifications],
  );

  const completeLesson = useCallback(
    async (lessonId: string) => {
      const result = await completeLessonRequest(lessonId);
      await refresh();
      return result;
    },
    [refresh],
  );

  const submitAssessment = useCallback(
    async (
      assessmentId: string,
      answers: Record<string, string | { option_id?: string; text?: string }>,
    ) => {
      const result = await submitAssessmentRequest(assessmentId, answers);
      await refresh();
      return result;
    },
    [refresh],
  );

  const updateProfileSettings = useCallback(
    async (displayName: string, bio: string, weeklyGoal: number) => {
      await updateSettings(displayName, bio, weeklyGoal);
      await refresh();
    },
    [refresh],
  );

  const markRead = useCallback(
    async (id: string) => {
      await markNotificationRead(id);
      await refresh();
    },
    [refresh],
  );

  const markAllRead = useCallback(async () => {
    const count = await markAllNotificationsRead();
    await refresh();
    return count;
  }, [refresh]);

  const value = useMemo<LearnerContextValue>(
    () => ({
      loading,
      refreshing,
      error,
      setupRequired,
      state,
      profile,
      stats: state?.stats ?? emptyStats,
      paths,
      completedLessonIds,
      weeklyActivity: state?.weeklyActivity ?? [],
      activity,
      notifications,
      achievements: state?.achievements ?? [],
      attempts: state?.attempts ?? [],
      refresh,
      completeLesson,
      submitAssessment,
      updateProfileSettings,
      markRead,
      markAllRead,
    }),
    [
      loading,
      refreshing,
      error,
      setupRequired,
      state,
      profile,
      paths,
      completedLessonIds,
      activity,
      notifications,
      completeLesson,
      submitAssessment,
      updateProfileSettings,
      markRead,
      markAllRead,
      refresh,
    ],
  );

  return (
    <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>
  );
}

export function useLearner(): LearnerContextValue {
  const value = useContext(LearnerContext);
  if (!value) throw new Error("useLearner must be used inside LearnerProvider.");
  return value;
}
