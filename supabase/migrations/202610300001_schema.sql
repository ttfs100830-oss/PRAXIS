-- PRAXIS schema.
-- Apply in the Supabase SQL editor (or `supabase db push`) before seed.sql.
-- Shared curriculum is intentionally separate from every per-user table.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- Shared ----

create table if not exists public.paths (
  id text primary key,
  title text not null,
  tier text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.modules (
  id text primary key,
  path_id text not null references public.paths(id) on delete cascade,
  title text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id text primary key,
  module_id text not null references public.modules(id) on delete cascade,
  title text not null,
  scope text not null default '',
  classification text not null default 'core',
  content_md text not null,
  estimated_minutes integer not null default 20 check (estimated_minutes > 0),
  duration_label text not null default '20 min',
  source_file text not null default '',
  position integer not null default 0,
  xp_reward integer not null default 25 check (xp_reward between 0 and 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_prerequisites (
  lesson_id text not null references public.lessons(id) on delete cascade,
  prerequisite_id text not null references public.lessons(id) on delete cascade,
  primary key (lesson_id, prerequisite_id),
  check (lesson_id <> prerequisite_id)
);

create table if not exists public.assessments (
  id text primary key,
  lesson_id text not null unique references public.lessons(id) on delete cascade,
  title text not null,
  instructions text not null default '',
  passing_score_percent integer not null default 70 check (passing_score_percent between 0 and 100),
  total_points integer not null default 0 check (total_points >= 0),
  schema_version text not null default '1',
  source_file text not null default '',
  xp_reward integer not null default 40 check (xp_reward between 0 and 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id text primary key,
  assessment_id text not null references public.assessments(id) on delete cascade,
  source_id text not null,
  position integer not null default 0,
  type text not null,
  prompt text not null,
  points integer not null default 1 check (points > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.question_options (
  question_id text not null references public.questions(id) on delete cascade,
  id text not null,
  text text not null,
  position integer not null default 0,
  primary key (question_id, id)
);

-- Private grading material. RLS is enabled in the security migration and no
-- browser role receives SELECT on these two tables.
create table if not exists public.answer_keys (
  question_id text primary key references public.questions(id) on delete cascade,
  correct_option_id text,
  expected_answer text,
  explanation text,
  grading_rubric jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_solutions (
  lesson_id text primary key references public.lessons(id) on delete cascade,
  content_md text not null,
  source_file text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text not null,
  criteria jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------- User data ----

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Learner' check (char_length(display_name) between 1 and 80),
  bio text not null default '' check (char_length(bio) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_xp integer not null default 0 check (total_xp >= 0),
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_activity_date date,
  weekly_goal integer not null default 7 check (weekly_goal between 1 and 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  primary key (user_id, lesson_id)
);

create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  assessment_id text not null references public.assessments(id) on delete cascade,
  submitted_at timestamptz not null default now(),
  auto_graded boolean not null default false,
  score_points numeric(8,2) not null default 0 check (score_points >= 0),
  auto_graded_points numeric(8,2) not null default 0 check (auto_graded_points >= 0),
  total_points numeric(8,2) not null default 0 check (total_points >= 0),
  percentage numeric(5,2),
  passed boolean,
  xp_awarded integer not null default 0 check (xp_awarded >= 0)
);

create table if not exists public.attempt_answers (
  attempt_id uuid not null references public.assessment_attempts(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  answer_text text,
  selected_option_id text,
  is_correct boolean,
  points_awarded numeric(8,2) not null default 0,
  review_required boolean not null default false,
  primary key (attempt_id, question_id)
);

create table if not exists public.user_activity_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null,
  events_count integer not null default 1 check (events_count > 0),
  xp_earned integer not null default 0 check (xp_earned >= 0),
  primary key (user_id, activity_date)
);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('completed', 'quiz', 'started', 'achievement')),
  title text not null,
  detail text not null default '',
  lesson_id text references public.lessons(id) on delete set null,
  xp_delta integer not null default 0,
  occurred_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  detail text not null default '',
  kind text not null default 'system',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null references public.achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.discussions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  title text not null check (char_length(title) between 3 and 140),
  body text not null default '' check (char_length(body) <= 5000),
  tag text not null default 'General' check (char_length(tag) <= 40),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.discussion_replies (
  id uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references public.discussions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null,
  body text not null check (char_length(body) between 1 and 3000),
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------- Indexes ----

create index if not exists modules_path_position_idx on public.modules(path_id, position);
create index if not exists lessons_module_position_idx on public.lessons(module_id, position);
create index if not exists prerequisites_lesson_idx on public.lesson_prerequisites(lesson_id);
create index if not exists questions_assessment_position_idx on public.questions(assessment_id, position);
create index if not exists question_options_question_position_idx on public.question_options(question_id, position);
create index if not exists lesson_progress_user_idx on public.lesson_progress(user_id, completed_at desc);
create index if not exists attempts_user_idx on public.assessment_attempts(user_id, submitted_at desc);
create index if not exists attempts_assessment_idx on public.assessment_attempts(assessment_id);
create index if not exists activity_events_user_idx on public.activity_events(user_id, occurred_at desc);
create index if not exists activity_days_user_date_idx on public.user_activity_days(user_id, activity_date desc);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);
create index if not exists notifications_unread_idx on public.notifications(user_id) where read_at is null;
create index if not exists discussions_created_idx on public.discussions(created_at desc);
create index if not exists replies_discussion_created_idx on public.discussion_replies(discussion_id, created_at);
