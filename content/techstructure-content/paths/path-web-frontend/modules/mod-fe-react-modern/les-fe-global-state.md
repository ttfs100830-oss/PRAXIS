# Global State Management: Context and Stores

**Lesson ID:** `les-fe-global-state`  
**Classification:** Advanced  
**Module:** Component Architecture (React)

## Learning goal

Manage application-wide state using Context or external stores.

## Core concept

State belongs as close as possible to the components that need it. Lift shared state to a common parent when practical; Context or a state library can help when many distant components need the same data. Global state adds coupling, so distinguish server data, transient UI state, and durable user preferences.

## Worked example / guided practice

For a shopping cart used by a header and product page, decide whether state should be local, lifted, placed in Context, or stored remotely. Explain the trade-off.

## Common mistake to avoid

Putting every value in global state makes ownership and debugging harder; choose the smallest suitable scope.

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

les-fe-props-state-lifecycle
