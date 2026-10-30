# Solutions — Static vs. Dynamic Typing and Type Safety

**Lesson ID:** `les-comp-type-systems`  
**Scope:** Explain how static type checkers catch structural bugs before runtime.

## Worked answers and grading notes

### Solution 1
A static checker may flag `greet(3)` against `name: str`; ordinary Python generally does not enforce that annotation at runtime.

### Solution 2
External JSON still requires runtime validation. TypeScript annotations are checked by TypeScript tooling and are not ordinary JavaScript syntax.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
