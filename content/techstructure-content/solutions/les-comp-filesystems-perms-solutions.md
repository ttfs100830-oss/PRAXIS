# Solutions — File Systems, Paths, and Permissions

**Lesson ID:** `les-comp-filesystems-perms`  
**Scope:** Navigate hierarchical file trees and interpret read/write/execute permissions.

## Worked answers and grading notes

### Solution 1
Directory `r` allows listing names; `x` allows traversal/search; `w` allows modifying entries when combined with required search permission.

### Solution 2
`chmod u+x script.sh` adds owner execute permission. Avoid recursive world-writable permissions as a default fix.

### Solution 3
A readable file can still be inaccessible if any parent directory lacks search permission.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
