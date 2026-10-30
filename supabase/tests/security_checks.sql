-- PRAXIS post-setup diagnostics.
-- Run in the Supabase SQL editor after the migrations and seed.
-- This checks schema/RLS/grant state. It does not impersonate users; use the
-- two-account flow in docs/SETUP.md for live ownership isolation.

-- 1. Expected curriculum counts.
select 'paths' as record, count(*) as actual, 17 as expected from public.paths
union all select 'modules', count(*), 48 from public.modules
union all select 'lessons', count(*), 166 from public.lessons
union all select 'assessments', count(*), 166 from public.assessments
union all select 'questions', count(*), 830 from public.questions
union all select 'question_options', count(*), 728 from public.question_options
union all select 'lesson_prerequisites', count(*), 228 from public.lesson_prerequisites
union all select 'answer_keys', count(*), 182 from public.answer_keys
union all select 'lesson_solutions', count(*), 166 from public.lesson_solutions
union all select 'achievements', count(*), 7 from public.achievements;

-- 2. Every application table has RLS enabled.
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in (
    'paths', 'modules', 'lessons', 'lesson_prerequisites', 'assessments',
    'questions', 'question_options', 'answer_keys', 'lesson_solutions',
    'achievements', 'profiles', 'user_stats', 'lesson_progress',
    'assessment_attempts', 'attempt_answers', 'user_activity_days',
    'activity_events', 'notifications', 'user_achievements', 'discussions',
    'discussion_replies'
  )
order by c.relname;

-- 3. Private grading tables have no policies at all.
select tablename, count(*) as policy_count
from pg_policies
where schemaname = 'public'
  and tablename in ('answer_keys', 'lesson_solutions')
group by tablename;
-- Expected: zero rows for both tables.

-- 4. Browser roles must not hold table privileges on private grading data.
select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('answer_keys', 'lesson_solutions')
  and grantee in ('anon', 'authenticated')
order by table_name, grantee, privilege_type;
-- Expected: zero rows.

-- 5. Trusted functions exist and are callable by authenticated users.
select p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as arguments,
       has_function_privilege('authenticated', p.oid, 'execute') as authenticated_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'ensure_my_profile', 'complete_lesson', 'submit_assessment',
    'get_attempt_review', 'get_my_learning_state', 'update_my_settings',
    'mark_notification_read', 'mark_all_notifications_read',
    'create_discussion', 'create_reply', 'get_discussions',
    'get_discussion_thread'
  )
order by p.proname;

-- 6. Internal helpers must not be executable by browser roles.
select p.proname as helper,
       has_function_privilege('anon', p.oid, 'execute') as anon_can_execute,
       has_function_privilege('authenticated', p.oid, 'execute') as authenticated_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'touch_activity_day', 'award_achievements', 'handle_new_user',
    'set_updated_at'
  )
order by p.proname;
-- Expected: false for both roles on every row.

-- 7. New users should have zero XP and no progress or achievements.
select
  count(*) filter (where s.total_xp <> 0) as users_with_nonzero_xp,
  count(*) filter (where s.current_streak <> 0) as users_with_streak
from public.user_stats s;
