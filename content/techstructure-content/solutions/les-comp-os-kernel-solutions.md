# Solutions — Operating Systems, Kernel vs. User Space

**Lesson ID:** `les-comp-os-kernel`  
**Scope:** Distinguish between privileged kernel operations and safe user-space application execution.

## Worked answers and grading notes

### Solution 1
Example: `open("notes.txt")` may result in a file descriptor; the OS checks path traversal and access permissions. Handle `FileNotFoundError` and `PermissionError` separately where recovery differs.

### Solution 2
For any protected operation, name the user-space API, system-call/kernel mediation, OS resource action, and possible error.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
