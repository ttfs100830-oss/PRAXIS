import type {
  AssessmentResult,
  AssessmentReview,
  Discussion,
  DiscussionReply,
  LearningState,
} from "../types";
import { supabase } from "./supabase";

export class PraxisError extends Error {
  code: string | null;
  setupRequired: boolean;

  constructor(message: string, code: string | null = null, setupRequired = false) {
    super(message);
    this.name = "PraxisError";
    this.code = code;
    this.setupRequired = setupRequired;
  }
}

const setupCodes = new Set(["PGRST202", "PGRST205", "42P01", "42883", "PGRST204"]);

function normalizeError(error: unknown): PraxisError {
  if (error instanceof PraxisError) return error;
  if (typeof error === "object" && error !== null) {
    const candidate = error as { message?: string; code?: string; details?: string };
    const message = candidate.message || candidate.details || "The database request failed.";
    const setupRequired = Boolean(candidate.code && setupCodes.has(candidate.code));
    return new PraxisError(message, candidate.code ?? null, setupRequired);
  }
  if (error instanceof Error) return new PraxisError(error.message);
  return new PraxisError("The database request failed.");
}

function client() {
  if (!supabase) {
    throw new PraxisError(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.",
      "CONFIG",
      true,
    );
  }
  return supabase;
}

export async function fetchLearningState(): Promise<LearningState> {
  const { data, error } = await client().rpc("get_my_learning_state");
  if (error) throw normalizeError(error);
  if (!data) throw new PraxisError("The database returned no learning state.", "EMPTY", true);
  const state = data as LearningState;
  return {
    ...state,
    completedLessonIds: state.completedLessonIds ?? [],
    weeklyActivity: state.weeklyActivity ?? [],
    activityDays: state.activityDays ?? [],
    achievements: state.achievements ?? [],
    attempts: state.attempts ?? [],
    activity: state.activity ?? [],
    notifications: state.notifications ?? [],
  };
}

export async function completeLesson(lessonId: string): Promise<{
  alreadyCompleted: boolean;
  lessonId: string;
  xpAwarded: number;
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak?: number;
  completedAt: string;
  achievementsAwarded?: string[];
}> {
  const { data, error } = await client().rpc("complete_lesson", {
    p_lesson_id: lessonId,
  });
  if (error) throw normalizeError(error);
  return data;
}

export async function submitAssessment(
  assessmentId: string,
  answers: Record<string, string | { option_id?: string; text?: string }>,
): Promise<AssessmentResult> {
  const { data, error } = await client().rpc("submit_assessment", {
    p_assessment_id: assessmentId,
    p_answers: answers,
  });
  if (error) throw normalizeError(error);
  return data as AssessmentResult;
}

export async function fetchAttemptReview(attemptId: string): Promise<AssessmentReview> {
  const { data, error } = await client().rpc("get_attempt_review", {
    p_attempt_id: attemptId,
  });
  if (error) throw normalizeError(error);
  return data as AssessmentReview;
}

export async function updateSettings(
  displayName: string,
  bio: string,
  weeklyGoal: number,
): Promise<{ displayName: string; bio: string; weeklyGoal: number }> {
  const { data, error } = await client().rpc("update_my_settings", {
    p_display_name: displayName,
    p_bio: bio,
    p_weekly_goal: weeklyGoal,
  });
  if (error) throw normalizeError(error);
  return data;
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await client().rpc("mark_notification_read", {
    p_notification_id: id,
  });
  if (error) throw normalizeError(error);
}

export async function markAllNotificationsRead(): Promise<number> {
  const { data, error } = await client().rpc("mark_all_notifications_read");
  if (error) throw normalizeError(error);
  return Number(data ?? 0);
}

export async function fetchDiscussions(): Promise<Discussion[]> {
  const { data, error } = await client().rpc("get_discussions");
  if (error) throw normalizeError(error);
  return (data ?? []) as Discussion[];
}

export async function fetchDiscussionThread(discussionId: string): Promise<{
  thread: Discussion;
  replies: DiscussionReply[];
}> {
  const { data, error } = await client().rpc("get_discussion_thread", {
    p_discussion_id: discussionId,
  });
  if (error) throw normalizeError(error);
  return data as { thread: Discussion; replies: DiscussionReply[] };
}

export async function createDiscussion(
  title: string,
  body: string,
  tag: string,
): Promise<string> {
  const { data, error } = await client().rpc("create_discussion", {
    p_title: title,
    p_body: body,
    p_tag: tag,
  });
  if (error) throw normalizeError(error);
  return String(data);
}

export async function createReply(discussionId: string, body: string): Promise<string> {
  const { data, error } = await client().rpc("create_reply", {
    p_discussion_id: discussionId,
    p_body: body,
  });
  if (error) throw normalizeError(error);
  return String(data);
}

export { normalizeError };
