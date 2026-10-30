# Solutions — Processes, Threads, and Memory Allocation

**Lesson ID:** `les-comp-processes-threads`  
**Scope:** Describe how the OS isolates process memory and schedules CPU time across threads.

## Worked answers and grading notes

### Solution 1
Processes normally have separate virtual address spaces; threads in one process share heap/global memory but have separate stacks and execution state.

### Solution 2
Race example: two threads read counter=0, each computes 1, and both write 1; the final value is 1 rather than 2. Synchronize updates or use an atomic operation.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
