# Browser Storage: Cookies, localStorage, sessionStorage

**Lesson ID:** `les-fe-browser-storage`  
**Classification:** Core  
**Module:** DOM Manipulation, State & DevTools

## Learning goal

Compare capacity and security trade-offs of browser storage.

## Core concept

localStorage stores string key/value pairs persistently for an origin; sessionStorage is scoped to a tab/session. Storage is synchronous and should not hold large datasets or sensitive secrets. JSON.stringify and JSON.parse can serialize simple structured data, but parsing can fail and schema changes need handling. Storage may be unavailable or cleared.

## Worked example / guided practice

Save a harmless UI preference as JSON, read it with a try/catch, and fall back to a default when the key is missing or invalid.

## Common mistake to avoid

Do not store session tokens or highly sensitive data in browser storage without understanding XSS and threat-model implications.

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

les-fe-fetch-async-ui
