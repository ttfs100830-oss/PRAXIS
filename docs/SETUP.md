# PRAXIS setup

This document covers the database, authentication and local configuration
needed to run PRAXIS against Supabase.

No service-role key or database password is required by the frontend. The
migrations and seed are applied once, by an owner of the Supabase project, in
the dashboard SQL editor (or with an equivalent trusted database session).

## 1. Prerequisites

- Node.js 20 or newer
- A Supabase project
- The project URL and **publishable** (anon) key
- Access to the Supabase Dashboard for the project

## 2. Frontend environment

Create `.env.local` from the example:

```powershell
Copy-Item .env.example .env.local
```

Set:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Rules:

- Use the publishable/anon key only. Vite inlines `VITE_*` values into the
  browser bundle.
- Never add `SUPABASE_SERVICE_ROLE_KEY`, `sb_secret_...`, a database password or
  any other server credential to a `VITE_*` variable.
- `.env.local` is ignored by Git and excluded from `PRAXIS.zip`.

## 3. Authentication settings

In **Authentication → Providers → Email**:

- Enable the email provider.
- Keep email confirmation enabled for production. For local testing, either
  confirm test accounts through the emails Supabase sends, or temporarily turn
  confirmation off.
- Set the **Site URL** to the app origin, for example
  `http://localhost:5173`.
- Add redirect URLs for every origin you use, for example
  `http://localhost:5173` and your deployed origin. Password recovery and email
  confirmation links rely on these.

The app sends `emailRedirectTo`/`redirectTo` as `window.location.origin`. A
recovery link opens the in-app recovery screen, where the user sets a new
password.

## 4. Apply the database files

Run these in the Supabase **SQL Editor**, in order. Each file is idempotent
enough to re-run, but the order matters because the functions and policies
depend on the schema.

1. `supabase/migrations/202610300001_schema.sql`
   - shared curriculum tables
   - private per-user tables
   - indexes, constraints and `updated_at` triggers
2. `supabase/migrations/202610300002_functions.sql`
   - new-user bootstrap and profile creation
   - trusted completion, grading, XP, streak and achievement functions
   - account settings, notifications and community RPCs
3. `supabase/migrations/202610300003_security.sql`
   - Row Level Security policies
   - grants/revokes for `anon` and `authenticated`
   - no policies for `answer_keys` or `lesson_solutions`
4. `supabase/seed.sql`
   - shared curriculum plus private answer keys and worked solutions

`seed.sql` is large (roughly 2.5 MB). If the dashboard editor rejects it, split
it at the generated section comments while keeping the surrounding
`begin;`/`commit;` transaction semantics, or run it with a trusted `psql`
connection. Do not expose that connection string or the seed through the
frontend.

After applying, confirm the expected tables exist:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;
```

Or run the full diagnostic file `supabase/tests/security_checks.sql` in the SQL
editor. It checks curriculum counts, RLS state, private-table policies,
browser-role grants and trusted-function privileges.

```sql
select count(*) as paths from public.paths;          -- 17
select count(*) as modules from public.modules;      -- 48
select count(*) as lessons from public.lessons;      -- 166
select count(*) as assessments from public.assessments; -- 166
select count(*) as questions from public.questions;  -- 830
select count(*) as answer_keys from public.answer_keys; -- 182
select count(*) as solutions from public.lesson_solutions; -- 166
```

## 5. Run the app

```powershell
npm install
npm run dev
```

Open `http://localhost:5173`.

A new account starts with:

- 0 XP
- 0 completed lessons
- no streak
- no assessment attempts
- no achievements
- one welcome notification

Returning accounts load their stored state through
`get_my_learning_state()`. Progress is never reset by sign-in or by a fresh
deploy.

## 6. Verify the security boundary

### Browser-role checks

These must fail for an authenticated non-owner browser role:

- reading `public.answer_keys`
- reading `public.lesson_solutions`
- reading another user's `lesson_progress`, attempts, activity or notifications
- inserting progress or XP directly
- calling `complete_lesson` without an earned assessment result
- calling `complete_lesson` while prerequisites are incomplete

The RLS/grant migration revokes `answer_keys` and `lesson_solutions` from both
`anon` and `authenticated`, so a browser request should be rejected before
policy evaluation.

### Two-account check

1. Create accounts A and B and sign in as A.
2. Complete a lesson or submit an assessment as A.
3. Note A's XP and completed lesson count.
4. Sign out and sign in as B.
5. B must show 0 XP, 0 lessons, no activity, no streak and no achievements.
6. Sign back in as A. A's progress must be unchanged.

The RPCs derive identity from `auth.uid()`; no client request contains a user
id or XP amount.

## 7. Regenerating curriculum and seed

The source curriculum is expected at `content/techstructure-content` with
`manifest.json` and `content-index.json`.

```powershell
npm run import
```

This rewrites:

- `src/generated/curriculum.json`
- `supabase/seed.sql`
- `reports/import-report.json`
- `reports/import-report.md`

Re-apply `supabase/seed.sql` after regenerating if the database already has
curriculum rows. The statements use stable ids and `on conflict` updates.

## 8. Troubleshooting

**"Database setup is required" banner**

The schema or RPCs are missing. Apply the migrations, then the seed, then press
Retry. Confirm PostgREST has reloaded the schema.

**Sign-up succeeds but no session appears**

Email confirmation is enabled. Confirm the address from the email, then sign
in. The auth screen also offers a resend-verification action.

**"Pass the lesson assessment before completing this lesson"**

Multiple-choice lessons require a passing attempt before lesson completion.
Free-response-only lessons require a stored submission. This is enforced in the
database, not just in the UI.

**Search works but progress does not**

Curriculum browsing uses the bundled JSON and is independent of Supabase. The
setup banner concerns account-bound state only.

**The seed is too large for the SQL editor**

Split at the generated `-- Shared curriculum`, `-- Private answer keys` and
`-- Achievements` section comments, keeping commits/transactions valid, or use a
trusted database session. Never put the connection string in source control.
