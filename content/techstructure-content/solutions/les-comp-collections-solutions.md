# Solutions — Arrays, Hash Maps, and Sets

**Lesson ID:** `les-comp-collections`  
**Scope:** Select and manipulate appropriate in-memory data structures.

## Worked answers and grading notes

### Solution 1
For `["red", "blue", "red"]`, counts are `{"red": 2, "blue": 1}` and first-seen unique order is `["red", "blue"]`.

### Solution 2
Use `counts[word] = counts.get(word, 0) + 1`. Use `list(dict.fromkeys(items))` to preserve first-seen order when removing duplicates.

### Solution 3
Do not remove items from the same list while iterating; build a new list or iterate over a copy. Set iteration order should not be relied upon.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
