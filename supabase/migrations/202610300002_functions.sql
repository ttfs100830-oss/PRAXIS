-- PRAXIS trusted database logic.
-- All grading, completion, XP, streak and achievement writes happen here.
-- Browser clients never supply a user id, XP amount or pass/fail value.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists lessons_set_updated_at on public.lessons;
create trigger lessons_set_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

drop trigger if exists discussions_set_updated_at on public.discussions;
create trigger discussions_set_updated_at
before update on public.discussions
for each row execute function public.set_updated_at();

-- ------------------------------------------------------ New user bootstrap ----

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_name text;
begin
  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Learner'
  );
  v_name := left(v_name, 80);

  insert into public.profiles (user_id, display_name)
  values (new.id, v_name)
  on conflict (user_id) do nothing;

  insert into public.user_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  if not exists (
    select 1 from public.notifications
    where user_id = new.id and kind = 'welcome'
  ) then
    insert into public.notifications (user_id, title, detail, kind)
    values (
      new.id,
      'Welcome to PRAXIS',
      'Your account is ready. Pick a learning path when you are ready; XP, streaks and achievements start from zero.',
      'welcome'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.ensure_my_profile()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_name text;
begin
  if v_uid is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  select email into v_email from auth.users where id = v_uid;
  v_name := coalesce(
    nullif(split_part(coalesce(v_email, ''), '@', 1), ''),
    'Learner'
  );
  v_name := left(v_name, 80);

  insert into public.profiles (user_id, display_name)
  values (v_uid, v_name)
  on conflict (user_id) do nothing;

  insert into public.user_stats (user_id)
  values (v_uid)
  on conflict (user_id) do nothing;

  return jsonb_build_object('userId', v_uid, 'ready', true);
end;
$$;

-- -------------------------------------------------------- Activity + streak ----

create or replace function public.touch_activity_day(
  p_user_id uuid,
  p_date date,
  p_xp integer default 0
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_current integer;
  v_longest integer;
  v_last date;
  v_next integer;
begin
  insert into public.user_stats (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  insert into public.user_activity_days as uad (user_id, activity_date, events_count, xp_earned)
  values (p_user_id, p_date, 1, greatest(p_xp, 0))
  on conflict (user_id, activity_date) do update
    set events_count = uad.events_count + 1,
        xp_earned = uad.xp_earned + greatest(p_xp, 0);

  select current_streak, longest_streak, last_activity_date
    into v_current, v_longest, v_last
  from public.user_stats
  where user_id = p_user_id
  for update;

  if v_last is null then
    v_next := 1;
  elsif v_last = p_date then
    v_next := greatest(v_current, 1);
  elsif v_last = p_date - 1 then
    v_next := greatest(v_current, 0) + 1;
  elsif p_date > v_last then
    v_next := 1;
  else
    v_next := greatest(v_current, 1);
  end if;

  update public.user_stats
  set current_streak = v_next,
      longest_streak = greatest(coalesce(v_longest, 0), v_next),
      last_activity_date = greatest(coalesce(v_last, p_date), p_date),
      updated_at = now()
  where user_id = p_user_id;
end;
$$;

create or replace function public.award_achievements(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_lessons integer;
  v_assessments integer;
  v_xp integer;
  v_streak integer;
  v_achievement record;
  v_awarded jsonb := '[]'::jsonb;
begin
  select count(*) into v_lessons
  from public.lesson_progress where user_id = p_user_id;

  select count(*) into v_assessments
  from public.assessment_attempts
  where user_id = p_user_id and passed = true;

  select coalesce(total_xp, 0), coalesce(current_streak, 0)
    into v_xp, v_streak
  from public.user_stats where user_id = p_user_id;

  for v_achievement in
    select a.id, a.title, a.description
    from public.achievements a
    where not exists (
      select 1 from public.user_achievements ua
      where ua.user_id = p_user_id and ua.achievement_id = a.id
    )
    and (
      (a.criteria ? 'lessons' and v_lessons >= (a.criteria ->> 'lessons')::integer)
      or (a.criteria ? 'assessments' and v_assessments >= (a.criteria ->> 'assessments')::integer)
      or (a.criteria ? 'xp' and v_xp >= (a.criteria ->> 'xp')::integer)
      or (a.criteria ? 'streak' and v_streak >= (a.criteria ->> 'streak')::integer)
    )
    order by a.sort_order
  loop
    insert into public.user_achievements (user_id, achievement_id)
    values (p_user_id, v_achievement.id)
    on conflict (user_id, achievement_id) do nothing;

    if found then
      insert into public.notifications (user_id, title, detail, kind)
      values (p_user_id, 'Achievement unlocked', v_achievement.title, 'achievement');

      insert into public.activity_events (user_id, kind, title, detail)
      values (p_user_id, 'achievement', 'Achievement unlocked', v_achievement.title);

      v_awarded := v_awarded || to_jsonb(v_achievement.id);
    end if;
  end loop;

  return v_awarded;
end;
$$;

-- ------------------------------------------------------------ Lesson done ----

create or replace function public.complete_lesson(p_lesson_id text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_lesson public.lessons%rowtype;
  v_missing text;
  v_xp integer := 0;
  v_stats public.user_stats%rowtype;
  v_awarded jsonb := '[]'::jsonb;
  v_completed_at timestamptz;
  v_level integer;
  v_has_auto boolean := false;
  v_has_assessment boolean := false;
  v_passed boolean := false;
  v_submitted boolean := false;
begin
  if v_uid is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  perform public.ensure_my_profile();

  select * into v_lesson from public.lessons where id = p_lesson_id;
  if not found then
    raise exception 'Lesson not found.' using errcode = 'P0002';
  end if;

  select completed_at, xp_awarded
    into v_completed_at, v_xp
  from public.lesson_progress
  where user_id = v_uid and lesson_id = p_lesson_id;

  if v_completed_at is not null then
    select * into v_stats from public.user_stats where user_id = v_uid;
    v_level := greatest(1, floor(coalesce(v_stats.total_xp, 0) / 500.0)::integer + 1);
    return jsonb_build_object(
      'alreadyCompleted', true,
      'lessonId', p_lesson_id,
      'xpAwarded', 0,
      'totalXp', coalesce(v_stats.total_xp, 0),
      'level', v_level,
      'currentStreak', coalesce(v_stats.current_streak, 0),
      'completedAt', v_completed_at
    );
  end if;

  select string_agg(lp.prerequisite_id, ', ' order by lp.prerequisite_id)
    into v_missing
  from public.lesson_prerequisites lp
  where lp.lesson_id = p_lesson_id
    and not exists (
      select 1 from public.lesson_progress p
      where p.user_id = v_uid and p.lesson_id = lp.prerequisite_id
    );

  if v_missing is not null and v_missing <> '' then
    raise exception 'Complete these prerequisite lessons first: %', v_missing using errcode = 'P0001';
  end if;

  -- Completion must be earned through the attached assessment, not by
  -- calling this function directly. Multiple-choice assessments need a pass;
  -- free-response-only assessments need a stored submission for review.
  select exists (
      select 1 from public.assessments a
      where a.lesson_id = p_lesson_id
    ),
    exists (
      select 1
      from public.assessments a
      join public.questions q on q.assessment_id = a.id
      where a.lesson_id = p_lesson_id and q.type = 'multiple_choice'
    ),
    exists (
      select 1
      from public.assessments a
      join public.assessment_attempts at on at.assessment_id = a.id
      where a.lesson_id = p_lesson_id and at.user_id = v_uid and at.passed = true
    ),
    exists (
      select 1
      from public.assessments a
      join public.assessment_attempts at on at.assessment_id = a.id
      where a.lesson_id = p_lesson_id and at.user_id = v_uid
    )
  into v_has_assessment, v_has_auto, v_passed, v_submitted;

  if v_has_assessment and v_has_auto and not v_passed then
    raise exception 'Pass the lesson assessment before completing this lesson.' using errcode = 'P0001';
  end if;

  if v_has_assessment and not v_has_auto and not v_submitted then
    raise exception 'Submit the lesson assessment before completing this lesson.' using errcode = 'P0001';
  end if;

  insert into public.lesson_progress (user_id, lesson_id, xp_awarded)
  values (v_uid, p_lesson_id, v_lesson.xp_reward)
  on conflict (user_id, lesson_id) do nothing;

  if not found then
    select * into v_stats from public.user_stats where user_id = v_uid;
    select completed_at, xp_awarded
      into v_completed_at, v_xp
    from public.lesson_progress
    where user_id = v_uid and lesson_id = p_lesson_id;
    v_level := greatest(1, floor(coalesce(v_stats.total_xp, 0) / 500.0)::integer + 1);
    return jsonb_build_object(
      'alreadyCompleted', true,
      'lessonId', p_lesson_id,
      'xpAwarded', 0,
      'totalXp', coalesce(v_stats.total_xp, 0),
      'level', v_level,
      'currentStreak', coalesce(v_stats.current_streak, 0),
      'completedAt', v_completed_at
    );
  end if;

  update public.user_stats
  set total_xp = total_xp + v_lesson.xp_reward,
      updated_at = now()
  where user_id = v_uid;

  perform public.touch_activity_day(v_uid, current_date, v_lesson.xp_reward);

  insert into public.activity_events (user_id, kind, title, detail, lesson_id, xp_delta)
  values (
    v_uid,
    'completed',
    'Lesson completed',
    v_lesson.title,
    v_lesson.id,
    v_lesson.xp_reward
  );

  insert into public.notifications (user_id, title, detail, kind)
  values (
    v_uid,
    'Lesson completed',
    v_lesson.title || ' · +' || v_lesson.xp_reward || ' XP',
    'lesson'
  );

  v_awarded := public.award_achievements(v_uid);

  select * into v_stats from public.user_stats where user_id = v_uid;
  v_level := greatest(1, floor(coalesce(v_stats.total_xp, 0) / 500.0)::integer + 1);

  select completed_at, xp_awarded
    into v_completed_at, v_xp
  from public.lesson_progress
  where user_id = v_uid and lesson_id = p_lesson_id;

  return jsonb_build_object(
    'alreadyCompleted', false,
    'lessonId', p_lesson_id,
    'xpAwarded', v_xp,
    'totalXp', v_stats.total_xp,
    'level', v_level,
    'currentStreak', v_stats.current_streak,
    'longestStreak', v_stats.longest_streak,
    'completedAt', v_completed_at,
    'achievementsAwarded', v_awarded
  );
end;
$$;

-- ------------------------------------------------------- Assessment grading ----

create or replace function public.submit_assessment(
  p_assessment_id text,
  p_answers jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_assessment public.assessments%rowtype;
  v_question public.questions%rowtype;
  v_key public.answer_keys%rowtype;
  v_answer jsonb;
  v_answer_text text;
  v_selected text;
  v_attempt_id uuid;
  v_attempt public.assessment_attempts%rowtype;
  v_earned numeric := 0;
  v_auto_points numeric := 0;
  v_total_points numeric := 0;
  v_percentage numeric;
  v_passed boolean;
  v_auto_graded boolean;
  v_mc_count integer := 0;
  v_points numeric;
  v_is_correct boolean;
  v_review_required boolean;
  v_results jsonb := '[]'::jsonb;
  v_first_pass boolean := false;
  v_xp integer := 0;
  v_stats public.user_stats%rowtype;
  v_level integer;
  v_solution text;
  v_awarded jsonb := '[]'::jsonb;
  v_completion jsonb;
  v_completion_deferred boolean := false;
  v_has_prereq_gap boolean;
begin
  if v_uid is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  perform public.ensure_my_profile();

  select * into v_assessment from public.assessments where id = p_assessment_id;
  if not found then
    raise exception 'Assessment not found.' using errcode = 'P0002';
  end if;

  insert into public.assessment_attempts (user_id, assessment_id)
  values (v_uid, p_assessment_id)
  returning id into v_attempt_id;

  for v_question in
    select * from public.questions
    where assessment_id = p_assessment_id
    order by position
  loop
    select * into v_key
    from public.answer_keys
    where question_id = v_question.id;

    v_answer := coalesce(p_answers, '{}'::jsonb) -> v_question.id;
    v_answer_text := null;
    v_selected := null;

    if v_question.type = 'multiple_choice' then
      if jsonb_typeof(v_answer) = 'string' then
        v_selected := v_answer #>> '{}';
      elsif jsonb_typeof(v_answer) = 'object' then
        v_selected := nullif(v_answer ->> 'option_id', '');
      end if;

      v_is_correct := v_selected is not null and v_selected = v_key.correct_option_id;
      v_points := case when v_is_correct then v_question.points else 0 end;
      v_earned := v_earned + v_points;
      v_auto_points := v_auto_points + v_question.points;
      v_mc_count := v_mc_count + 1;
      v_review_required := false;
    else
      if jsonb_typeof(v_answer) = 'string' then
        v_answer_text := v_answer #>> '{}';
      elsif jsonb_typeof(v_answer) = 'object' then
        v_answer_text := v_answer ->> 'text';
      end if;

      v_is_correct := null;
      v_points := 0;
      v_review_required := true;
    end if;

    v_total_points := v_total_points + v_question.points;

    insert into public.attempt_answers (
      attempt_id, question_id, answer_text, selected_option_id,
      is_correct, points_awarded, review_required
    ) values (
      v_attempt_id, v_question.id, nullif(v_answer_text, ''), v_selected,
      v_is_correct, v_points, v_review_required
    );

    v_results := v_results || jsonb_build_array(
      jsonb_build_object(
        'questionId', v_question.id,
        'prompt', v_question.prompt,
        'type', v_question.type,
        'pointsPossible', v_question.points,
        'selectedOptionId', v_selected,
        'answerText', nullif(v_answer_text, ''),
        'correctOptionId', v_key.correct_option_id,
        'isCorrect', v_is_correct,
        'pointsAwarded', v_points,
        'reviewRequired', v_review_required,
        'expectedAnswer', v_key.expected_answer,
        'explanation', v_key.explanation,
        'gradingRubric', v_key.grading_rubric
      )
    );
  end loop;

  v_auto_graded := v_mc_count > 0;
  if v_auto_graded then
    v_percentage := round(v_earned / nullif(v_auto_points, 0) * 100, 2);
    v_passed := v_percentage >= v_assessment.passing_score_percent;
  else
    v_percentage := null;
    v_passed := null;
  end if;

  update public.assessment_attempts
  set auto_graded = v_auto_graded,
      score_points = v_earned,
      auto_graded_points = v_auto_points,
      total_points = v_total_points,
      percentage = v_percentage,
      passed = v_passed
  where id = v_attempt_id
  returning * into v_attempt;

  if v_passed then
    v_first_pass := not exists (
      select 1 from public.assessment_attempts a
      where a.user_id = v_uid
        and a.assessment_id = p_assessment_id
        and a.passed = true
        and a.id <> v_attempt_id
    );

    if v_first_pass then
      v_xp := v_assessment.xp_reward;

      update public.user_stats
      set total_xp = total_xp + v_xp,
          updated_at = now()
      where user_id = v_uid;

      update public.assessment_attempts
      set xp_awarded = v_xp
      where id = v_attempt_id;
    end if;
  end if;

  perform public.touch_activity_day(v_uid, current_date, v_xp);

  insert into public.activity_events (user_id, kind, title, detail, lesson_id, xp_delta)
  values (
    v_uid,
    'quiz',
    case
      when v_passed = true then 'Assessment passed'
      when v_passed = false then 'Assessment attempted'
      else 'Self-review submitted'
    end,
    v_assessment.title || case
      when v_auto_graded then ' · ' || trim(to_char(v_percentage, 'FM990.00')) || '% auto-graded'
      else ' · free-response review'
    end,
    v_assessment.lesson_id,
    v_xp
  );

  if v_passed then
    insert into public.notifications (user_id, title, detail, kind)
    values (
      v_uid,
      'Assessment passed',
      v_assessment.title || ' · ' || trim(to_char(v_percentage, 'FM990.00')) || '% on auto-graded questions',
      'assessment'
    );

    -- A pass completes the lesson when its prerequisites are already met.
    select exists (
      select 1
      from public.lesson_prerequisites lp
      where lp.lesson_id = v_assessment.lesson_id
        and not exists (
          select 1 from public.lesson_progress p
          where p.user_id = v_uid and p.lesson_id = lp.prerequisite_id
        )
    ) into v_has_prereq_gap;

    if v_has_prereq_gap then
      v_completion_deferred := true;
    else
      v_completion := public.complete_lesson(v_assessment.lesson_id);
    end if;
  end if;

  v_awarded := public.award_achievements(v_uid);

  select content_md into v_solution
  from public.lesson_solutions
  where lesson_id = v_assessment.lesson_id;

  select * into v_stats from public.user_stats where user_id = v_uid;
  v_level := greatest(1, floor(coalesce(v_stats.total_xp, 0) / 500.0)::integer + 1);

  return jsonb_build_object(
    'attemptId', v_attempt_id,
    'assessmentId', p_assessment_id,
    'autoGraded', v_auto_graded,
    'scorePoints', v_earned,
    'autoGradedPoints', v_auto_points,
    'totalPoints', v_total_points,
    'percentage', v_percentage,
    'passingScorePercent', v_assessment.passing_score_percent,
    'passed', v_passed,
    'firstPass', v_first_pass,
    'xpAwarded', v_xp,
    'totalXp', v_stats.total_xp,
    'level', v_level,
    'currentStreak', v_stats.current_streak,
    'questions', v_results,
    'solution', v_solution,
    'completion', v_completion,
    'completionDeferred', v_completion_deferred,
    'achievementsAwarded', v_awarded,
    'submittedAt', v_attempt.submitted_at
  );
end;
$$;

create or replace function public.get_attempt_review(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_attempt public.assessment_attempts%rowtype;
  v_solution text;
  v_results jsonb;
begin
  if v_uid is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  select * into v_attempt
  from public.assessment_attempts
  where id = p_attempt_id and user_id = v_uid;

  if not found then
    raise exception 'Attempt not found.' using errcode = 'P0002';
  end if;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'questionId', q.id,
      'prompt', q.prompt,
      'type', q.type,
      'pointsPossible', q.points,
      'selectedOptionId', aa.selected_option_id,
      'answerText', aa.answer_text,
      'correctOptionId', k.correct_option_id,
      'isCorrect', aa.is_correct,
      'pointsAwarded', aa.points_awarded,
      'reviewRequired', aa.review_required,
      'expectedAnswer', k.expected_answer,
      'explanation', k.explanation,
      'gradingRubric', k.grading_rubric
    ) order by q.position
  ), '[]'::jsonb)
  into v_results
  from public.attempt_answers aa
  join public.questions q on q.id = aa.question_id
  left join public.answer_keys k on k.question_id = q.id
  where aa.attempt_id = p_attempt_id;

  select ls.content_md into v_solution
  from public.assessments a
  left join public.lesson_solutions ls on ls.lesson_id = a.lesson_id
  where a.id = v_attempt.assessment_id;

  return jsonb_build_object(
    'attempt', to_jsonb(v_attempt),
    'questions', v_results,
    'solution', v_solution
  );
end;
$$;

-- ----------------------------------------------------------- My dashboard ----

create or replace function public.get_my_learning_state()
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_payload jsonb;
begin
  if v_uid is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  perform public.ensure_my_profile();

  select jsonb_build_object(
    'userId', v_uid,
    'serverDate', current_date,
    'profile', (
      select jsonb_build_object(
        'displayName', p.display_name,
        'bio', p.bio,
        'createdAt', p.created_at
      )
      from public.profiles p where p.user_id = v_uid
    ),
    'stats', (
      select jsonb_build_object(
        'totalXp', s.total_xp,
        'level', greatest(1, floor(s.total_xp / 500.0)::integer + 1),
        'levelXp', s.total_xp % 500,
        'levelTarget', 500,
        'currentStreak', s.current_streak,
        'longestStreak', s.longest_streak,
        'lastActivityDate', s.last_activity_date,
        'weeklyGoal', s.weekly_goal,
        'completedLessons', (select count(*) from public.lesson_progress lp where lp.user_id = v_uid),
        'assessmentsPassed', (select count(*) from public.assessment_attempts a where a.user_id = v_uid and a.passed = true),
        'assessmentsSubmitted', (select count(*) from public.assessment_attempts a where a.user_id = v_uid)
      )
      from public.user_stats s where s.user_id = v_uid
    ),
    'completedLessonIds', coalesce((
      select jsonb_agg(lp.lesson_id order by lp.completed_at)
      from public.lesson_progress lp where lp.user_id = v_uid
    ), '[]'::jsonb),
    'weeklyActivity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'date', d::date,
        'active', exists (
          select 1 from public.user_activity_days uad
          where uad.user_id = v_uid and uad.activity_date = d::date
        )
      ) order by d)
      from generate_series(current_date - 6, current_date, interval '1 day') d
    ), '[]'::jsonb),
    'activityDays', coalesce((
      select jsonb_agg(jsonb_build_object(
        'date', uad.activity_date,
        'events', uad.events_count,
        'xp', uad.xp_earned
      ) order by uad.activity_date desc)
      from public.user_activity_days uad
      where uad.user_id = v_uid
    ), '[]'::jsonb),
    'achievements', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id,
        'title', a.title,
        'description', a.description,
        'earnedAt', ua.earned_at
      ) order by a.sort_order)
      from public.user_achievements ua
      join public.achievements a on a.id = ua.achievement_id
      where ua.user_id = v_uid
    ), '[]'::jsonb),
    'attempts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', x.id,
        'assessmentId', x.assessment_id,
        'lessonId', x.lesson_id,
        'lessonTitle', x.lesson_title,
        'submittedAt', x.submitted_at,
        'autoGraded', x.auto_graded,
        'scorePoints', x.score_points,
        'autoGradedPoints', x.auto_graded_points,
        'totalPoints', x.total_points,
        'percentage', x.percentage,
        'passed', x.passed,
        'xpAwarded', x.xp_awarded
      ) order by x.submitted_at desc)
      from (
        select a.id, a.assessment_id, ass.lesson_id, l.title as lesson_title,
               a.submitted_at, a.auto_graded, a.score_points, a.auto_graded_points,
               a.total_points, a.percentage, a.passed, a.xp_awarded
        from public.assessment_attempts a
        join public.assessments ass on ass.id = a.assessment_id
        join public.lessons l on l.id = ass.lesson_id
        where a.user_id = v_uid
        order by a.submitted_at desc
        limit 50
      ) x
    ), '[]'::jsonb),
    'activity', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', x.id,
        'kind', x.kind,
        'title', x.title,
        'detail', x.detail,
        'lessonId', x.lesson_id,
        'xpDelta', x.xp_delta,
        'occurredAt', x.occurred_at
      ) order by x.occurred_at desc)
      from (
        select * from public.activity_events
        where user_id = v_uid
        order by occurred_at desc
        limit 50
      ) x
    ), '[]'::jsonb),
    'notifications', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', x.id,
        'title', x.title,
        'detail', x.detail,
        'kind', x.kind,
        'readAt', x.read_at,
        'createdAt', x.created_at
      ) order by x.created_at desc)
      from (
        select * from public.notifications
        where user_id = v_uid
        order by created_at desc
        limit 30
      ) x
    ), '[]'::jsonb)
  ) into v_payload;

  return v_payload;
end;
$$;

-- --------------------------------------------------------------- Settings ----

create or replace function public.update_my_settings(
  p_display_name text,
  p_bio text default '',
  p_weekly_goal integer default 7
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_name text := trim(coalesce(p_display_name, ''));
  v_bio text := left(coalesce(p_bio, ''), 500);
  v_goal integer := least(7, greatest(1, coalesce(p_weekly_goal, 7)));
begin
  if v_uid is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  if char_length(v_name) < 1 or char_length(v_name) > 80 then
    raise exception 'Display name must be between 1 and 80 characters.' using errcode = '22023';
  end if;

  perform public.ensure_my_profile();

  update public.profiles
  set display_name = v_name, bio = v_bio
  where user_id = v_uid;

  update public.user_stats
  set weekly_goal = v_goal
  where user_id = v_uid;

  return jsonb_build_object('displayName', v_name, 'bio', v_bio, 'weeklyGoal', v_goal);
end;
$$;

create or replace function public.mark_notification_read(p_notification_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  update public.notifications
  set read_at = coalesce(read_at, now())
  where id = p_notification_id and user_id = auth.uid();
end;
$$;

create or replace function public.mark_all_notifications_read()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_count integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  update public.notifications
  set read_at = now()
  where user_id = auth.uid() and read_at is null;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- -------------------------------------------------------------- Community ----

create or replace function public.create_discussion(
  p_title text,
  p_body text default '',
  p_tag text default 'General'
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_name text;
  v_id uuid;
  v_title text := trim(coalesce(p_title, ''));
  v_body text := left(trim(coalesce(p_body, '')), 5000);
  v_tag text := left(trim(coalesce(p_tag, 'General')), 40);
begin
  if v_uid is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  if char_length(v_title) < 3 or char_length(v_title) > 140 then
    raise exception 'Discussion title must be between 3 and 140 characters.' using errcode = '22023';
  end if;
  if v_tag = '' then v_tag := 'General'; end if;

  perform public.ensure_my_profile();
  select display_name into v_name from public.profiles where user_id = v_uid;

  insert into public.discussions (user_id, author_name, title, body, tag)
  values (v_uid, coalesce(v_name, 'Learner'), v_title, v_body, v_tag)
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.create_reply(
  p_discussion_id uuid,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_name text;
  v_id uuid;
  v_body text := trim(coalesce(p_body, ''));
begin
  if v_uid is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;
  if char_length(v_body) < 1 or char_length(v_body) > 3000 then
    raise exception 'Reply must be between 1 and 3000 characters.' using errcode = '22023';
  end if;
  if not exists (select 1 from public.discussions where id = p_discussion_id) then
    raise exception 'Discussion not found.' using errcode = 'P0002';
  end if;

  perform public.ensure_my_profile();
  select display_name into v_name from public.profiles where user_id = v_uid;

  insert into public.discussion_replies (discussion_id, user_id, author_name, body)
  values (p_discussion_id, v_uid, coalesce(v_name, 'Learner'), v_body)
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.get_discussions()
returns jsonb
language sql
security definer
set search_path = public, pg_temp
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', x.id,
    'title', x.title,
    'author', x.author_name,
    'body', x.body,
    'tag', x.tag,
    'createdAt', x.created_at,
    'replies', x.replies
  ) order by x.created_at desc), '[]'::jsonb)
  from (
    select d.id, d.title, d.author_name, d.body, d.tag, d.created_at,
           count(r.id)::integer as replies
    from public.discussions d
    left join public.discussion_replies r on r.discussion_id = d.id
    group by d.id
    order by d.created_at desc
    limit 100
  ) x
  where auth.uid() is not null;
$$;

create or replace function public.get_discussion_thread(p_discussion_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_thread jsonb;
  v_replies jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication required.' using errcode = '28000';
  end if;

  select jsonb_build_object(
    'id', d.id,
    'title', d.title,
    'author', d.author_name,
    'body', d.body,
    'tag', d.tag,
    'createdAt', d.created_at
  ) into v_thread
  from public.discussions d
  where d.id = p_discussion_id;

  if v_thread is null then
    raise exception 'Discussion not found.' using errcode = 'P0002';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id,
    'author', r.author_name,
    'body', r.body,
    'createdAt', r.created_at
  ) order by r.created_at), '[]'::jsonb)
  into v_replies
  from public.discussion_replies r
  where r.discussion_id = p_discussion_id;

  return jsonb_build_object('thread', v_thread, 'replies', v_replies);
end;
$$;
