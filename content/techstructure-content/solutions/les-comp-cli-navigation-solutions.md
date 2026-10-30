# Solutions — Terminal Navigation

**Lesson ID:** `les-comp-cli-navigation`  
**Scope:** Execute core shell commands to inspect directories and move files.

## Worked answers and grading notes

### Solution 1
Example sequence: `mkdir -p practice/logs`; `printf "ready\n" > practice/logs/status.txt`; `cp practice/logs/status.txt practice/status-copy.txt`; `find practice -type f`.

### Solution 2
An absolute path starts at the root/drive root; a relative path starts from the current working directory. `&&` only runs the next command when the previous exit status is success.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
