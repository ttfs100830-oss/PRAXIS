# PRAXIS

PRAXIS is a multi-user learning platform built around the supplied
TechStructure curriculum. It keeps the existing dashboard design and turns the
prototype into a working application:

- real curriculum browsing, lesson Markdown and search;
- Supabase Auth with sign-up, sign-in, sign-out, session restoration, password
  reset, email-verification handling and account settings;
- per-user progress, XP, streaks, achievements, assessment attempts, activity
  and notifications;
- multiple-choice grading and lesson completion performed by trusted database
  functions;
- persisted community discussions and replies;
- honest handling of free-response questions.

The app uses the bundled curriculum so lessons remain readable even before the
database is configured. Accounts, progress, grading, XP and community require
the Supabase schema and seed in `supabase/`.

## Stack

- React 18, TypeScript, Vite 6
- Tailwind CSS with the existing PRAXIS visual system
- Supabase JS client (`@supabase/supabase-js`)
- `react-markdown` + `remark-gfm` for supplied lesson/solution Markdown
- Vitest for importer and curriculum tests

## Quick start

```powershell
npm install
Copy-Item .env.example .env.local
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev
```

Then apply the database files described in [docs/SETUP.md](docs/SETUP.md). Until
that is done, the shell shows a clear setup notice, curriculum browsing still
works, and account-bound actions report that the database is not ready.

```powershell
npm run typecheck
npm test
npm run build
npm run preview
```

## Project layout

```text
src/
  App.tsx                     auth gate + protected application shell
  context/AuthContext.tsx     Supabase Auth lifecycle and recovery mode
  context/LearnerContext.tsx  per-user learning state and mutations
  lib/api.ts                  typed RPC wrappers
  lib/curriculum.ts           curriculum adapters, search, map, challenges, domains
  lib/supabase.ts             browser client from VITE_* variables
  pages/                      dashboard and functional secondary pages
  components/                 existing dashboard components + real modals
  generated/curriculum.json   public curriculum bundle (no answer keys)
supabase/
  migrations/                 schema, trusted functions, RLS/grants
  seed.sql                    curriculum + private answer keys and solutions
scripts/import-curriculum.mjs repeatable idempotent importer
reports/import-report.*       generated import counts, variants and caveats
reports/test-report.md        recorded verification results
tests/                        importer and curriculum tests
```

## Curriculum

The importer reads `content/techstructure-content` (extracted from the supplied
archive) and writes three artifacts:

1. `src/generated/curriculum.json` — paths, modules, lessons with Markdown,
   assessments, prompts and options. It deliberately contains **no** correct
   option IDs, expected answers, explanations, rubrics or solution Markdown.
2. `supabase/seed.sql` — the same shared curriculum plus private
   `answer_keys` and `lesson_solutions` rows. Apply it only in the database;
   never serve or commit it as application content.
3. `reports/import-report.json` and `.md` — imported/rejected/skipped counts,
   rejection reasons, schema variants, question types, checksums and caveats.

Run it again after changing the source:

```powershell
npm run import
```

The current import contains 17 paths, 48 modules, 166 lessons, 166
assessments, 166 solutions, 830 questions (182 multiple choice, 648 free
response), 728 options and 228 prerequisite edges. No structurally invalid
records were rejected and no records were skipped. See
[reports/import-report.md](reports/import-report.md) for the full report and the
archive caveats.

## Data and security model

- Shared curriculum tables are readable by authenticated learners but not by
  anonymous visitors.
- Private tables (`profiles`, `user_stats`, `lesson_progress`,
  `assessment_attempts`, `attempt_answers`, `activity_events`,
  `notifications`, `user_achievements`, activity days) are protected by Row
  Level Security and only expose rows owned by `auth.uid()`.
- `answer_keys` and `lesson_solutions` have **no** browser policies and are
  revoked from `anon` and `authenticated`. Review material is returned only by
  the security-definer RPC `get_attempt_review` for the caller's own attempt.
- The browser never supplies a user ID, XP value, score or pass/fail flag.
  `complete_lesson` derives the user from `auth.uid()`, enforces prerequisites,
  requires an earned assessment result, and awards the server-defined lesson
  XP.
- `submit_assessment` grades multiple choice against private keys, stores all
  answers, awards assessment XP only on the first pass, and auto-completes a
  lesson only when its prerequisites are already met.
- Community writes are tied to the authenticated user; reads are shared with
  signed-in learners.
- `VITE_*` values are public by definition. Never place a service-role key,
  secret key, database password or other trusted credential in the frontend,
  logs, repository or ZIP.

## Behavior and limitations

Implemented and account-backed:

- Authentication, session restoration, protected shell, password reset,
  resend-verification action and profile/password settings.
- Dashboard, learning paths, lesson reader, assessments, results, stored
  attempts, lesson completion, XP, levels, streaks, achievements, weekly
  activity, activity history and notifications.
- Search over real lesson titles, scopes and Markdown bodies.
- Challenges derived from lessons that contain auto-graded multiple-choice
  questions, with prerequisite-based locking.
- Learning Map built from real paths and cross-path prerequisite edges.
- System Explorer built from the four real curriculum tiers.
- Community discussions and replies stored in Supabase.

Honest limitations:

- Free-response answers are persisted and displayed beside the supplied model
  answer and rubric. They are **not** semantically graded, and the UI does not
  claim that they are.
- The archive itself says the content is not release-ready, reports stale
  checksums, and contains generated drafts. Those caveats are documented rather
  than silently rewritten.
- The System Explorer is a curriculum/tier explorer, not a live infrastructure
  simulator.
- There is no file upload, proctoring, team/classroom management, social feed
  ranking or email notification system.
- The database migrations and seed have not been applied by this build step.
  Auth, RLS and two-account behavior therefore require the manual setup in
  `docs/SETUP.md` and the checks in `reports/test-report.md` before they can be
  claimed as verified in a live project.

## Reports

- [Curriculum import report](reports/import-report.md)
- [Verification and test report](reports/test-report.md)

## Secrets

`.env.local` is ignored by Git and excluded from the deliverable ZIP. Do not
commit it. The seed contains private grading content and is intended only for
the Supabase SQL editor or a trusted database session.
