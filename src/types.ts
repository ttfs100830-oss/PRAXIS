export type PageId =
  | "home"
  | "paths"
  | "map"
  | "challenges"
  | "explorer"
  | "progress"
  | "community";

export type PathStatus = "Not Started" | "In Progress" | "Completed";

export type PathArtKey = "architecture" | "environment" | "git" | "network";

export interface CurriculumModule {
  id: string;
  title: string;
  pathId: string;
  position: number;
  lessonIds: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  scope: string;
  classification: string;
  moduleId: string;
  pathId: string;
  prerequisites: string[];
  contentMarkdown: string;
  estimatedMinutes: number;
  assessmentId: string | null;
  solutionAvailable: boolean;
  modulePosition: number;
}

export interface LearningPath {
  id: string;
  title: string;
  blurb: string;
  status: PathStatus;
  completedLessons: number;
  totalLessons: number;
  art: PathArtKey;
  lessons: Lesson[];
  modules: CurriculumModule[];
  tier: string;
}

export interface AssessmentOption {
  id: string;
  text: string;
  position: number;
}

export interface AssessmentQuestion {
  id: string;
  sourceId: string;
  type: string;
  prompt: string;
  points: number;
  options: AssessmentOption[];
  autoGradable: boolean;
  position: number;
}

export interface Assessment {
  id: string;
  lessonId: string;
  title: string;
  instructions: string;
  passingScorePercent: number;
  totalPoints: number;
  schemaVersion: string;
  sourceFile: string;
  questions: AssessmentQuestion[];
}

export interface Activity {
  id: string;
  kind: "completed" | "quiz" | "started" | "achievement";
  title: string;
  detail: string;
  time: string;
  lessonId?: string | null;
  xpDelta?: number;
  occurredAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
  kind?: string;
  readAt?: string | null;
  createdAt?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  page: PageId;
  tone: "cream" | "rust" | "forest";
  icon: "map" | "bolt" | "box" | "chart";
}

export interface MapNode {
  id: string;
  label: string;
  status: "done" | "active" | "locked";
  x: number;
  y: number;
  pathId: string;
  tier: string;
  completedLessons: number;
  totalLessons: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  questions: number;
  minutes: number;
  status: "Ready" | "Completed" | "Locked";
  lessonId: string;
  pathTitle: string;
  autoGradableQuestions: number;
  passingScorePercent: number;
}

export interface SystemCard {
  id: string;
  name: string;
  role: string;
  status: string;
  detail: string;
  tier: string;
  pathIds: string[];
  moduleCount: number;
  lessonCount: number;
  completedLessons: number;
}

export interface Discussion {
  id: string;
  title: string;
  author: string;
  replies: number;
  tag: string;
  time: string;
  body?: string;
  createdAt?: string;
}

export interface DiscussionReply {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface LearnerProfile {
  displayName: string;
  bio: string;
  createdAt: string;
}

export interface LearnerStats {
  totalXp: number;
  level: number;
  levelXp: number;
  levelTarget: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  weeklyGoal: number;
  completedLessons: number;
  assessmentsPassed: number;
  assessmentsSubmitted: number;
}

export interface AssessmentAttempt {
  id: string;
  assessmentId: string;
  lessonId: string;
  lessonTitle: string;
  submittedAt: string;
  autoGraded: boolean;
  scorePoints: number;
  autoGradedPoints: number;
  totalPoints: number;
  percentage: number | null;
  passed: boolean | null;
  xpAwarded: number;
}

export interface EarnedAchievement {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
}

export interface WeeklyActivityDay {
  date: string;
  active: boolean;
}

export interface ActivityDay {
  date: string;
  events: number;
  xp: number;
}

export interface LearningState {
  userId: string;
  serverDate: string;
  profile: LearnerProfile;
  stats: LearnerStats;
  completedLessonIds: string[];
  weeklyActivity: WeeklyActivityDay[];
  activityDays: ActivityDay[];
  achievements: EarnedAchievement[];
  attempts: AssessmentAttempt[];
  activity: Activity[];
  notifications: Notification[];
}

export interface AssessmentReviewQuestion {
  questionId: string;
  prompt: string;
  type: string;
  pointsPossible: number;
  selectedOptionId: string | null;
  answerText: string | null;
  correctOptionId: string | null;
  isCorrect: boolean | null;
  pointsAwarded: number;
  reviewRequired: boolean;
  expectedAnswer: string | null;
  explanation: string | null;
  gradingRubric: string[] | null;
}

export interface AssessmentResult {
  attemptId: string;
  assessmentId: string;
  autoGraded: boolean;
  scorePoints: number;
  autoGradedPoints: number;
  totalPoints: number;
  percentage: number | null;
  passingScorePercent: number;
  passed: boolean | null;
  firstPass: boolean;
  xpAwarded: number;
  totalXp: number;
  level: number;
  currentStreak: number;
  questions: AssessmentReviewQuestion[];
  solution: string | null;
  completion: {
    alreadyCompleted: boolean;
    lessonId: string;
    xpAwarded: number;
    totalXp: number;
    level: number;
    currentStreak: number;
    completedAt: string;
  } | null;
  completionDeferred: boolean;
  achievementsAwarded: string[];
  submittedAt: string;
}

export interface AssessmentReview {
  attempt: {
    id: string;
    assessment_id: string;
    user_id: string;
    submitted_at: string;
    auto_graded: boolean;
    score_points: number;
    auto_graded_points: number;
    total_points: number;
    percentage: number | null;
    passed: boolean | null;
    xp_awarded: number;
  };
  questions: AssessmentReviewQuestion[];
  solution: string | null;
}
