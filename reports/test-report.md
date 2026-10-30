# PRAXIS verification and test report

Date: 2026-10-30
Environment: Windows, Node.js v24.18.0, npm 11.16.0

This report records what was actually executed in this workspace. It does not
claim database, browser or two-account results that were not run.

## Commands run

| Command | Result |
|---|---|
| `npm run typecheck` | Passed: `tsc -b --noEmit` completed with no diagnostics |
| `npm test` | Passed: 2 test files, 18 tests |
| `npm run build` | Passed: TypeScript project build followed by Vite production build |
| `node scripts/import-curriculum.mjs` | Passed: regenerated curriculum, seed and reports |

Vite reported a non-fatal bundle-size warning because the bundled curriculum
makes the main JS chunk large (about 1.96 MB before gzip, 322 kB gzip). It is a
performance note, not a build failure.

## Automated tests

`tests/import.test.ts`

1. Imports every structurally valid record from the archive.
2. Records the supplied assessment schema variants and question types.
3. Reports structural integrity checks without hiding archive caveats.
4. Verifies the browser curriculum contains no private grading data.
5. Verifies private answer keys and solutions remain in the database seed.
6. Verifies SQL literal escaping and idempotent seed markers.
7. Verifies repeat imports produce the same counts and ids.

`tests/curriculum.test.ts`

1. Exposes the verified curriculum counts.
2. Links every lesson to an assessment and preserves lesson Markdown.
3. Confirms the bundled assessments expose no correct answers.
4. Confirms a new learner starts every path at zero.
5. Confirms path completion requires every lesson.
6. Confirms prerequisite enforcement uses supplied curriculum edges.
7. Confirms lesson lookup inside the UI projection.
8. Confirms search matches real lesson Markdown.
9. Confirms the Learning Map has 17 nodes and deduplicated edges.
10. Confirms the four curriculum-tier domains.
11. Confirms challenges are limited to auto-graded lessons and respect locks.

Result: **18 passed, 0 failed.**

## Import verification

From `reports/import-report.json`:

| Record type | Imported | Rejected | Skipped |
|---|---:|---:|---:|
| Paths | 17 | 0 | 0 |
| Modules | 48 | 0 | 0 |
| Lessons | 166 | 0 | 0 |
| Assessments | 166 | 0 | 0 |
| Questions | 830 | 0 | 0 |
| Solutions | 166 | 0 | 0 |

Additional imported records:

- Answer options: 728
- Prerequisite edges: 228

Integrity checks:

- Missing lesson / assessment / solution files: 0 / 0 / 0
- Manifest and index agreement: passed
- Invalid multiple-choice option sets: 0
- Prerequisite cycles: 0
- Duplicate source records: 0
- Structural rejections: 0

Schema variants:

- `v2`: 19 assessments
- `v1`: 48 assessments
- `legacy-free-response`: 99 assessments

Question types:

- `multiple_choice`: 182
- `short_answer`: 274
- `scenario`: 118
- `practical`: 58
- `application`: 99
- `debugging`: 99

The archive's own recorded manifest checksum does not match the actual archived
manifest. The actual SHA-256 values are recorded in the import report; the
stale value was not rewritten. See `reports/import-report.md`.

## Static security checks

- The public curriculum bundle contains no `correctOptionId`,
  `expectedAnswer`, `explanation`, `gradingRubric`, `answer_keys` or
  `lesson_solutions` data. This is asserted by an automated test.
- The database seed contains `answer_keys` and `lesson_solutions` and is not
  imported by the frontend bundle.
- A workspace-wide text search found no service-role/secret key or database
  connection string outside `.env.local` (excluded) and the tests that assert
  their absence.
- `.env.local` is listed in `.gitignore` and is excluded from the ZIP.
- Client mutations call RPCs that take only lesson/assessment ids and answers.
  XP, scores, pass/fail and user ids are server-derived.

## What is not verified in this workspace

The available Supabase credential is the publishable/anon key. It cannot create
tables, apply migrations or run the seed. Therefore the following require the
manual setup in `docs/SETUP.md`:

- applying the schema, functions, RLS and seed to the live Supabase project;
- running `supabase/tests/security_checks.sql` against that project;
- end-to-end sign-up, email confirmation, sign-in, sign-out and password reset;
- authenticated RPC behavior (`get_my_learning_state`, `complete_lesson`,
  `submit_assessment`, `get_attempt_review`, notifications, community);
- two-account RLS isolation and proof that another user's rows are unreadable;
- browser automation/screenshot verification of the authenticated shell.

These are setup-dependent checks, not claims of completion. The application is
designed to show an explicit setup notice while the database is missing rather
than silently treating failures as success.

## Deliverable archive

`PRAXIS.zip` was produced from this workspace with:

- source (`src/`), curriculum source (`content/techstructure-content/`),
  `scripts/`, `tests/`, `docs/`, `reports/`, `supabase/` and `public/`;
- root configuration (`package.json`, `package-lock.json`, Vite, TypeScript,
  Tailwind and PostCSS config, `index.html`, `.gitignore`, `.env.example`).

Excluded: `node_modules/`, `dist/`, `.env.local`, build caches, `.tsbuildinfo`,
coverage output, the ZIP itself and any credential or secret file.

Verification performed on the archive:

- every required file (README, setup docs, three migrations, seed, security
  checks, importer, tests, reports, bundled curriculum) is present;
- no entry matches `node_modules`, `dist`, `.git`, `coverage`, `.env.local`
  or a `.tsbuildinfo` file;
- the publishable key from `.env.local` does not appear anywhere in the
  archive. The only matches for `service_role` / `sb_secret_` are the
  documentation and test assertions that warn against using them.
