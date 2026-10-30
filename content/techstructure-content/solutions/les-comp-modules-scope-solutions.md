# Solutions — Lexical Scope, Closures, and Module Systems

**Lesson ID:** `les-comp-modules-scope`  
**Scope:** Organize code across multiple files while avoiding global pollution.

## Worked answers and grading notes

### Solution 1
Python example: `from helpers import normalize_name`. JavaScript example: `export function normalizeName(name) { return name.trim(); }` and `import { normalizeName } from "./helpers.js";`.

### Solution 2
LEGB means Local, Enclosing, Global, Built-in. A leading underscore in Python signals internal use by convention, not enforced privacy.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
