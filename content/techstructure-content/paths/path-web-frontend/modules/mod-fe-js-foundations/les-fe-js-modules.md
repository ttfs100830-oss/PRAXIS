# JavaScript ES Modules

**Lesson ID:** `les-fe-js-modules`  
**Classification:** Core  
**Module:** JavaScript Fundamentals

## Learning goal

Export and import code across JS files securely.

## Core concept

ES modules use export to expose values and import to consume them. Named exports make the imported symbol explicit; a default export provides one primary export per module. Module boundaries should reflect responsibilities and avoid circular dependencies where possible. Browser and Node.js module resolution can differ based on file extensions and package configuration.

## Worked example / guided practice

Move a pure formatting function into a separate module, export it, import it from the entry point, and verify the app still runs.

## Common mistake to avoid

An import path must match the project’s runtime/build configuration; a file existing on disk does not guarantee it can be imported.

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
