# APIs with Fetch, Async UI, and the Network Tab

**Lesson ID:** `les-fe-fetch-async-ui`  
**Classification:** Core  
**Module:** DOM Manipulation, State & DevTools

## Learning goal

Issue HTTP requests and manage UI loading states.

## Core concept

A fetch-driven interface has asynchronous states: idle, loading, success, and error. Check response.ok before parsing a successful response body, handle network errors, and show useful feedback. Prevent stale requests from overwriting newer results when users change filters quickly; AbortController can cancel a request.

## Worked example / guided practice

Sketch the UI states for a search box. Include empty results, an HTTP error, a network error, and loading. Explain how you would cancel an outdated query.

## Common mistake to avoid

A request finishing successfully at the network level can still return an HTTP error status.

## Practice

1. Explain the key idea in your own words, using the terms introduced in this lesson.
2. Apply it to a small example in your current project or a disposable practice project. Record the command, code, or diagram you used and the observed result.
3. Describe one failure mode and how you would diagnose it without making broad, destructive changes.

## Mastery task

Produce a small artifact demonstrating the learning goal: a working code example, terminal transcript, architecture sketch, or written decision as appropriate. Include the expected behavior, actual observation, and one limitation.

## Completion criteria

- Explain the core concept without relying on a memorized definition alone.
- Complete the practice and explain why the result follows.
- Identify the relevant limitation or safety consideration.

## Prerequisites

les-fe-dom-events; les-fe-js-async; les-comp-data-formats
