# Solutions — Error Handling, Exceptions, and Stack Traces

**Lesson ID:** `les-comp-errors-exceptions`  
**Scope:** Implement structured try/catch error recovery.

## Worked answers and grading notes

### Solution 1
`import json`; use `with open(path, encoding="utf-8") as f: config = json.load(f)`.

### Solution 2
Catch `FileNotFoundError` only if a default/recovery is appropriate; catch `json.JSONDecodeError` to report malformed configuration. Do not silently replace malformed data with defaults unless that is a deliberate policy.

### Solution 3
Traceback: inspect the final frame for the immediate failing line and final exception type/message, then read earlier frames to understand the caller chain.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
