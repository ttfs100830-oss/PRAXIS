# Solutions — Blocking I/O, Event Loops, and Async/Await

**Lesson ID:** `les-comp-concurrency-async`  
**Scope:** Contrast blocking execution with non-blocking event loops and promises.

## Worked answers and grading notes

### Solution 1
Python example output is `[`A`, `B`]` as strings: `asyncio.gather` schedules both coroutines; the sleeps overlap rather than adding to roughly two seconds of sequential waiting. Timing varies.

### Solution 2
For Node/browser fetch: use an absolute valid URL in Node, check `if (!response.ok) throw new Error(...)`, then parse with `await response.json()`.

### Solution 3
Async I/O is concurrency for waiting tasks, not automatic CPU parallelism. CPU-bound work may require processes, native parallelism, or algorithmic improvements.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
