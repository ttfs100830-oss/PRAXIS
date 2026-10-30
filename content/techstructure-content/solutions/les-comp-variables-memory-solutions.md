# Solutions — Variables, Primitives, and Reference Semantics

**Lesson ID:** `les-comp-variables-memory`  
**Scope:** Trace how primitive values and object references are stored in memory.

## Worked answers and grading notes

### Solution 1
For `a=[10]; b=a; b.append(20)`, output is `[10, 20]` and `a is b` is `True`.

### Solution 2
For `b=a.copy()`, appending to b does not change the outer list a; nested mutable elements are still shared in a shallow copy.

### Solution 3
Python names bind to objects; do not claim all primitive values live on a stack. In JavaScript `===` is strict equality, not a general deep-equality operator.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
