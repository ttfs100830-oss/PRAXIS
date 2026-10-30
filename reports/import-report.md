# PRAXIS curriculum import report

Generated: 2026-10-30T08:24:20.036Z
Source: `C:\Users\ttfs1\Downloads\Praxis\content\techstructure-content`

## Imported records

| Record type | Imported | Rejected | Skipped |
|---|---:|---:|---:|
| paths | 17 | 0 | 0 |
| modules | 48 | 0 | 0 |
| lessons | 166 | 0 | 0 |
| assessments | 166 | 0 | 0 |
| questions | 830 | 0 | 0 |
| solutions | 166 | 0 | 0 |

Answer options imported: **728**
Prerequisite edges imported: **228**

## Validation

- Lesson / assessment / solution files missing: 0 / 0 / 0
- Manifest and index agreement: passed
- Multiple-choice option sets rejected: 0
- Prerequisite cycles: 0
- Duplicate source records: 0
- Structural rejections: 0

## Archive integrity

- Actual `manifest.json` SHA-256: `2f41961e47dcfe71e8b52af6d9837b6fddbc1b7d52525cab0710e1c470f221e6`
- Actual `content-index.json` SHA-256: `249bd9fd1df0626334149331ffdc3e1e2c2f3728d1a7bcdfcd77a2fb311de545`
- Recorded manifest SHA-256 in archive: `79c0a3df6a66b99ba4abaed36bb55e1c473d332ab07f2dff158d66416086ecda`
- Recorded checksum matches actual manifest: no (documented, not rewritten)

## Assessment schema variants

- Schema `v2`: 19 assessments
- Schema `v1`: 48 assessments
- Schema `legacy-free-response`: 99 assessments

## Question types

- `multiple_choice`: 182
- `short_answer`: 274
- `scenario`: 118
- `practical`: 58
- `application`: 99
- `debugging`: 99

No structurally invalid records were rejected.

No records were skipped.

## Archive caveats

- The archive's own batch-01 report says the content still needs further review and is not release-ready.
- Batches 3 and 4 identify themselves as generated drafts.
- The archive records a stale manifest checksum; the checksum of the actual archived manifest was calculated during import.
- No supplied content was rewritten. Editorial limitations are reported rather than silently corrected.

## Public/private split

`src/generated/curriculum.json` contains lesson Markdown, prompts and options, but no correct option ids, expected answers, rubrics, explanations or solution Markdown.
`supabase/seed.sql` contains the private grading material and must only be applied to the database. It is not imported by the frontend bundle.

