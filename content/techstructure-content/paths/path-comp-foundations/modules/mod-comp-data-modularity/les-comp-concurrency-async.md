# les-comp-concurrency-async — Blocking I/O, Event Loops, and Async/Await

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-data-modularity` — Algorithms, Modularity & Concurrency  
**Classification:** advanced  
**Prerequisites:** `les-comp-processes-threads`, `les-comp-errors-exceptions`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-concurrency-async` |
| Title | Blocking I/O, Event Loops, and Async/Await |
| Scope | Contrast blocking execution with non-blocking event loops and promises. |
| Estimated Time | 50 minutes |
| Difficulty | Intermediate / Advanced |

---

## 2. Introduction

Many programs spend most of their time waiting for I/O (network, disk). Blocking the only thread during that wait wastes resources. Event loops and async/await let a single thread handle many concurrent operations efficiently.

---

## 3. Learning Objectives

1. Explain the difference between blocking and non-blocking I/O.
2. Describe the basic operation of an event loop.
3. Use promises / async-await to express asynchronous flows.
4. Recognize common pitfalls (unhandled rejections, blocking the event loop).

---

## 4. Blocking vs Non-blocking

**Blocking**: the thread waits until the operation finishes.  
**Non-blocking**: the thread starts the operation and continues; it is notified later when the result is ready.

---

## 5. Event Loop (simplified)

```
while True:
    events = get_ready_events()
    for event in events:
        callback(event)
```

JavaScript, Node.js, and Python’s asyncio are built around this model.

---

## 6. Async/Await

```javascript
async function loadUser(id) {
  const response = await fetch(`https://example.com/api/users/${id}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  return data;
}
```

`await` pauses the async function without blocking the underlying thread.

---

## 7. Common Mistakes

- Using a blocking call inside an async function (blocks the event loop).
- Forgetting to handle promise rejections.
- Assuming async code runs in parallel on multiple cores (it is concurrent, not necessarily parallel).

---

## 8. Exercises

1. Rewrite a small callback-based example using async/await.
2. Explain what happens if you put a long CPU-bound loop inside an async function.

---

## 9. Completion Criteria

- [ ] Can explain blocking vs non-blocking
- [ ] Understands the purpose of an event loop
- [ ] Can read and write basic async/await code

---

## 10. Related Lessons

- Previous: `les-comp-processes-threads`, `les-comp-errors-exceptions`
- Later: backend, frontend, and distributed systems lessons that rely on async patterns


---

## Worked examples and mastery practice

### Worked example: blocking versus async I/O
```python
import asyncio

async def fetch_label(label, delay):
    await asyncio.sleep(delay)  # stand-in for asynchronous I/O
    return label

async def main():
    results = await asyncio.gather(
        fetch_label("A", 1),
        fetch_label("B", 1),
    )
    print(results)  # ['A', 'B']

asyncio.run(main())
```
The waits overlap because the coroutine yields control while waiting. This is concurrency, not necessarily parallel CPU execution. Async I/O is useful when many tasks spend time waiting on sockets or files; CPU-heavy work generally needs processes, native code that releases the GIL, or another parallel strategy.

In JavaScript, `fetch` needs a valid URL in Node.js and browser contexts. Check `response.ok`, because HTTP 404/500 responses do not automatically reject the promise.
```js
const response = await fetch("https://example.com/api/users/1");
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const user = await response.json();
```

### Mastery task
Compare a sequential pair of I/O waits with concurrent waits. Explain what `await` does, what an event loop schedules, and why CPU-bound loops do not become faster merely by adding `async`.

---

## A runnable Node.js example

In Node.js, use a valid absolute URL unless your code runs in an environment that supplies a base URL. `fetch` resolves for HTTP error responses such as 404; check `response.ok` explicitly.

```javascript
async function loadUser() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const user = await response.json();
  return user.name;
}

loadUser()
  .then(name => console.log(name))
  .catch(error => console.error("Request failed:", error.message));
```

`await` suspends the current async function while its promise is pending; it does not freeze the whole event loop. Network operations can overlap, but CPU-heavy synchronous work still blocks the event loop. A **promise** represents an eventual result or failure. In Python, `asyncio` uses coroutines and an event loop; the syntax differs from JavaScript promises, but both help coordinate waiting tasks.

### Mastery task

Compare sequentially awaiting two simulated I/O operations with starting both and awaiting `Promise.all`. Explain why elapsed waiting time can be lower when operations overlap, and why this is not automatically CPU parallelism. Include error handling and check HTTP status.


---

## Worked examples and mastery practice

### Worked example: blocking versus async I/O
```python
import asyncio

async def fetch_label(label, delay):
    await asyncio.sleep(delay)  # stand-in for asynchronous I/O
    return label

async def main():
    results = await asyncio.gather(
        fetch_label("A", 1),
        fetch_label("B", 1),
    )
    print(results)  # ['A', 'B']

asyncio.run(main())
```
The waits overlap because the coroutine yields control while waiting. This is concurrency, not necessarily parallel CPU execution. Async I/O is useful when many tasks spend time waiting on sockets or files; CPU-heavy work generally needs processes, native code that releases the GIL, or another parallel strategy.

In JavaScript, `fetch` needs a valid URL in Node.js and browser contexts. Check `response.ok`, because HTTP 404/500 responses do not automatically reject the promise.
```js
const response = await fetch("https://example.com/api/users/1");
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const user = await response.json();
```

### Mastery task
Compare a sequential pair of I/O waits with concurrent waits. Explain what `await` does, what an event loop schedules, and why CPU-bound loops do not become faster merely by adding `async`.
