# Solutions — Inspecting and Managing Running Processes

**Lesson ID:** `les-comp-cli-processes`  
**Scope:** Monitor system resource usage and safely terminate hung processes.

## Worked answers and grading notes

### Solution 1
Safe sequence: identify PID/command, inspect resource use and listening port, request graceful termination, verify it exited, then consider SIGKILL only if it remains stuck.

### Solution 2
Linux `ss -ltnp` is not portable to every macOS setup; use platform-specific alternatives such as `lsof -i :3000` where available.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
