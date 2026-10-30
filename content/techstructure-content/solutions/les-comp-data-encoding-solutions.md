# Solutions — Binary, Character Encoding, and Time

**Lesson ID:** `les-comp-data-encoding`  
**Scope:** Represent integers, floating-point numbers, UTF-8 text, and UTC timestamps.

## Worked answers and grading notes

### Solution 1
For a missing hex example: 0x2A = 2×16 + 10 = 42; binary 101010 is also 42.

### Solution 2
UTF-8 uses variable-width byte sequences; do not assume one byte per character.

### Solution 3
Use UTC `Z` or an explicit offset for an instant. New York on 2026-10-29 is EDT (UTC−04:00), so 14:30Z is 10:30−04:00.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
