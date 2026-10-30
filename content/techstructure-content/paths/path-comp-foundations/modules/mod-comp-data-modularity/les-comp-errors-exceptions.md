# les-comp-errors-exceptions — Error Handling, Exceptions, and Stack Traces

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-data-modularity` — Algorithms, Modularity & Concurrency  
**Classification:** core  
**Prerequisites:** `les-comp-control-functions`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-errors-exceptions` |
| Title | Error Handling, Exceptions, and Stack Traces |
| Scope | Implement structured try/catch error recovery. |
| Estimated Time | 40 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

Errors are inevitable. Robust programs detect them, recover when possible, and provide useful diagnostics when not. Exceptions and stack traces are the primary tools.

---

## 3. Learning Objectives

1. Use try/except (or try/catch) blocks.
2. Read a stack trace from bottom to top.
3. Decide when to catch an exception versus let it propagate.
4. Raise/throw meaningful exceptions.

---

## 4. Pattern

```python
try:
    risky_operation()
except SpecificError as e:
    # recover or log
    handle(e)
finally:
    # always runs
    cleanup()
```

---

## 5. Reading Stack Traces

In a Python traceback, read the frames from top to bottom to follow the call chain toward the failure. The final line names the exception and message; the last frame shown is typically the line where the exception was raised. Start at the bottom to identify the immediate failing line, then move upward to see who called it.

---

## 6. Exercises

1. Write a function that opens a file and handles the case where the file does not exist.
2. Intentionally cause an exception and practice reading the resulting stack trace.

---

## 7. Completion Criteria

- [ ] Can write basic try/except logic
- [ ] Can follow a stack trace to the source of an error
- [ ] Understands the difference between catching and propagating

---

## 8. Related Lessons

- Previous: `les-comp-control-functions`
- Later: `les-comp-concurrency-async`, testing and debugging paths


---

## Worked examples and mastery practice

### Worked example: handle a missing or malformed configuration
```python
import json

try:
    with open("config.json", encoding="utf-8") as f:
        config = json.load(f)
except FileNotFoundError:
    config = {"mode": "development"}
except json.JSONDecodeError as exc:
    raise ValueError("config.json is not valid JSON") from exc
```
The context manager closes the file reliably. Catch only errors you can meaningfully recover from; broad `except Exception:` can hide programming defects. Use `raise` to propagate an error or `raise NewError(...) from exc` to preserve its cause. In a Python traceback, the final frame shown is usually the immediate failing line; frames above it show callers. The final line gives the exception type and message.

### Mastery task
Write a function that loads a JSON file, returns a default only when the file is missing, and reports malformed JSON distinctly. Include a test for both cases and explain why these failures should not be treated identically.

---

## Reading a traceback precisely

A Python traceback lists the call chain from the outer caller toward the failing operation. The **last frame shown** is normally the immediate location where the exception was raised; the final line names the exception type and message. Read from the bottom to find the failing line, then move upward to learn how execution reached it.

```python
import json
from pathlib import Path

def load_config(path):
    try:
        with open(path, encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        return {"mode": "development"}  # deliberate recovery policy
    except json.JSONDecodeError as exc:
        raise ValueError(f"Invalid JSON in {path}") from exc

print(load_config("config.json"))
```

The `with` statement closes the file even if parsing fails. Missing file and malformed JSON are different failures, so the example recovers only from the first and raises a clearer error for the second. Catch an exception only when you can recover, add context, or clean up; avoid swallowing unexpected exceptions silently.

### Mastery task

Write a function that reads a JSON configuration file. Return a default configuration only if the file is missing; report invalid JSON distinctly. Explain the role of `raise ... from exc` and identify the immediate failing frame in a traceback.


---

## Worked examples and mastery practice

### Worked example: handle a missing or malformed configuration
```python
import json

try:
    with open("config.json", encoding="utf-8") as f:
        config = json.load(f)
except FileNotFoundError:
    config = {"mode": "development"}
except json.JSONDecodeError as exc:
    raise ValueError("config.json is not valid JSON") from exc
```
The context manager closes the file reliably. Catch only errors you can meaningfully recover from; broad `except Exception:` can hide programming defects. Use `raise` to propagate an error or `raise NewError(...) from exc` to preserve its cause. In a Python traceback, the final frame shown is usually the immediate failing line; frames above it show callers. The final line gives the exception type and message.

### Mastery task
Write a function that loads a JSON file, returns a default only when the file is missing, and reports malformed JSON distinctly. Include a test for both cases and explain why these failures should not be treated identically.
