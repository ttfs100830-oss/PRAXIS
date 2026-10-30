# Asynchronous JavaScript: Promises and Event Loop

**Lesson ID:** `les-fe-js-async`  
**Classification:** Core  
**Module:** JavaScript Fundamentals

## Learning goal

Manage JS async behavior using Promises and async/await.

## Core concept

JavaScript asynchronous work is commonly represented by Promises and async/await. Await pauses the current async function until a promise settles; it does not block the entire JavaScript runtime. Handle rejected promises and HTTP error responses separately: fetch usually resolves for HTTP 404/500, so inspect response.ok. Use loading, success, and error states in interfaces.

## Worked example / guided practice

Write an async function that fetches JSON, checks response.ok, parses the body, and catches failures. Explain the difference between a network rejection and a 404 response.

## Common mistake to avoid

Do not leave rejected promises unhandled or assume every fetch response is successful.

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

les-fe-js-functions-objects
