# Solutions — Data Serialization: JSON, YAML, and CSV

**Lesson ID:** `les-comp-data-formats`  
**Scope:** Read, write, and validate standard data interchange formats.

## Worked answers and grading notes

### Solution 1
Use `import json` and `with open("config.json", encoding="utf-8") as f: data = json.load(f)`. Catch `json.JSONDecodeError` for malformed JSON and `FileNotFoundError` for a missing file.

### Solution 2
After parsing, validate types/ranges explicitly. For example, require `port` to be an int but not bool and `1 <= port <= 65535`.

### Solution 3
Use a CSV library for general CSV; for untrusted YAML use a safe loader and then validate the loaded structure.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
