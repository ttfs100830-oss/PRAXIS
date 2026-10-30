-- PRAXIS Row Level Security and role grants.
-- Browser clients read shared curriculum, their own private rows through
-- security-definer RPCs, and shared community threads. They never receive
-- direct access to answer keys or worked solutions.

alter table public.paths enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_prerequisites enable row level security;
alter table public.assessments enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.answer_keys enable row level security;
alter table public.lesson_solutions enable row level security;
alter table public.achievements enable row level security;
alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.attempt_answers enable row level security;
alter table public.user_activity_days enable row level security;
alter table public.activity_events enable row level security;
alter table public.notifications enable row level security;
alter table public.user_achievements enable row level security;
alter table public.discussions enable row level security;
alter table public.discussion_replies enable row level security;

-- Shared curriculum is readable by signed-in learners.
drop policy if exists "authenticated reads paths" on public.paths;
create policy "authenticated reads paths" on public.paths
for select to authenticated using (true);

drop policy if exists "authenticated reads modules" on public.modules;
create policy "authenticated reads modules" on public.modules
for select to authenticated using (true);

drop policy if exists "authenticated reads lessons" on public.lessons;
create policy "authenticated reads lessons" on public.lessons
for select to authenticated using (true);

drop policy if exists "authenticated reads prerequisites" on public.lesson_prerequisites;
create policy "authenticated reads prerequisites" on public.lesson_prerequisites
for select to authenticated using (true);

drop policy if exists "authenticated reads assessments" on public.assessments;
create policy "authenticated reads assessments" on public.assessments
for select to authenticated using (true);

drop policy if exists "authenticated reads questions" on public.questions;
create policy "authenticated reads questions" on public.questions
for select to authenticated using (true);

drop policy if exists "authenticated reads options" on public.question_options;
create policy "authenticated reads options" on public.question_options
for select to authenticated using (true);

drop policy if exists "authenticated reads achievements" on public.achievements;
create policy "authenticated reads achievements" on public.achievements
for select to authenticated using (true);

-- Private profile and learning rows: own identity only.
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
for select to authenticated using (user_id = auth.uid());

drop policy if exists "read own stats" on public.user_stats;
create policy "read own stats" on public.user_stats
for select to authenticated using (user_id = auth.uid());

drop policy if exists "read own progress" on public.lesson_progress;
create policy "read own progress" on public.lesson_progress
for select to authenticated using (user_id = auth.uid());

drop policy if exists "read own attempts" on public.assessment_attempts;
create policy "read own attempts" on public.assessment_attempts
for select to authenticated using (user_id = auth.uid());

drop policy if exists "read own attempt answers" on public.attempt_answers;
create policy "read own attempt answers" on public.attempt_answers
for select to authenticated using (
  exists (
    select 1 from public.assessment_attempts a
    where a.id = attempt_answers.attempt_id and a.user_id = auth.uid()
  )
);

drop policy if exists "read own activity days" on public.user_activity_days;
create policy "read own activity days" on public.user_activity_days
for select to authenticated using (user_id = auth.uid());

drop policy if exists "read own activity events" on public.activity_events;
create policy "read own activity events" on public.activity_events
for select to authenticated using (user_id = auth.uid());

drop policy if exists "read own notifications" on public.notifications;
create policy "read own notifications" on public.notifications
for select to authenticated using (user_id = auth.uid());

drop policy if exists "read own achievements" on public.user_achievements;
create policy "read own achievements" on public.user_achievements
for select to authenticated using (user_id = auth.uid());

-- Community posts are shared, but every write is tied to auth.uid().
drop policy if exists "read discussions" on public.discussions;
create policy "read discussions" on public.discussions
for select to authenticated using (true);

drop policy if exists "insert own discussions" on public.discussions;
create policy "insert own discussions" on public.discussions
for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "update own discussions" on public.discussions;
create policy "update own discussions" on public.discussions
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "delete own discussions" on public.discussions;
create policy "delete own discussions" on public.discussions
for delete to authenticated using (user_id = auth.uid());

drop policy if exists "read replies" on public.discussion_replies;
create policy "read replies" on public.discussion_replies
for select to authenticated using (true);

drop policy if exists "insert own replies" on public.discussion_replies;
create policy "insert own replies" on public.discussion_replies
for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "update own replies" on public.discussion_replies;
create policy "update own replies" on public.discussion_replies
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "delete own replies" on public.discussion_replies;
create policy "delete own replies" on public.discussion_replies
for delete to authenticated using (user_id = auth.uid());

-- No policies exist for answer_keys or lesson_solutions. They remain
-- inaccessible to browser roles; submit_assessment/get_attempt_review return
-- only the review material for the caller's own attempt.

-- ------------------------------------------------------------- API grants ----

revoke all on public.paths, public.modules, public.lessons,
  public.lesson_prerequisites, public.assessments, public.questions,
  public.question_options, public.achievements
from anon;

grant select on public.paths, public.modules, public.lessons,
  public.lesson_prerequisites, public.assessments, public.questions,
  public.question_options, public.achievements
to authenticated;

revoke all on public.answer_keys from anon, authenticated;
revoke all on public.lesson_solutions from anon, authenticated;

revoke all on public.profiles, public.user_stats, public.lesson_progress,
  public.assessment_attempts, public.attempt_answers, public.user_activity_days,
  public.activity_events, public.notifications, public.user_achievements,
  public.discussions, public.discussion_replies
from anon;

grant select on public.profiles, public.user_stats, public.lesson_progress,
  public.assessment_attempts, public.attempt_answers, public.user_activity_days,
  public.activity_events, public.notifications, public.user_achievements,
  public.discussions, public.discussion_replies
to authenticated;

-- All mutation goes through these functions. They derive user id from
-- auth.uid() and never accept XP, score or pass values from the client.
revoke all on function public.touch_activity_day(uuid, date, integer) from public, anon, authenticated;
revoke all on function public.award_achievements(uuid) from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

revoke all on function public.ensure_my_profile() from public, anon;
revoke all on function public.complete_lesson(text) from public, anon;
revoke all on function public.submit_assessment(text, jsonb) from public, anon;
revoke all on function public.get_attempt_review(uuid) from public, anon;
revoke all on function public.get_my_learning_state() from public, anon;
revoke all on function public.update_my_settings(text, text, integer) from public, anon;
revoke all on function public.mark_notification_read(uuid) from public, anon;
revoke all on function public.mark_all_notifications_read() from public, anon;
revoke all on function public.create_discussion(text, text, text) from public, anon;
revoke all on function public.create_reply(uuid, text) from public, anon;
revoke all on function public.get_discussions() from public, anon;
revoke all on function public.get_discussion_thread(uuid) from public, anon;

grant execute on function public.ensure_my_profile() to authenticated;
grant execute on function public.complete_lesson(text) to authenticated;
grant execute on function public.submit_assessment(text, jsonb) to authenticated;
grant execute on function public.get_attempt_review(uuid) to authenticated;
grant execute on function public.get_my_learning_state() to authenticated;
grant execute on function public.update_my_settings(text, text, integer) to authenticated;
grant execute on function public.mark_notification_read(uuid) to authenticated;
grant execute on function public.mark_all_notifications_read() to authenticated;
grant execute on function public.create_discussion(text, text, text) to authenticated;
grant execute on function public.create_reply(uuid, text) to authenticated;
grant execute on function public.get_discussions() to authenticated;
grant execute on function public.get_discussion_thread(uuid) to authenticated;
