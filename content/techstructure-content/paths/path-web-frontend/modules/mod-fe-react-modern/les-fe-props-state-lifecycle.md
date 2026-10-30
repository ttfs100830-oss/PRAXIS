# Props, Local State, Controlled Inputs, and Effects

**Lesson ID:** `les-fe-props-state-lifecycle`  
**Classification:** Core  
**Module:** Component Architecture (React)

## Learning goal

Build interactive React components using hooks.

## Core concept

Props are inputs supplied by a parent; state is data a component owns and updates. State updates schedule a render and should be treated immutably. Effects synchronize with external systems and require correct dependencies and cleanup. Avoid effects for values that can be calculated directly during rendering.

## Worked example / guided practice

Build a counter with useState and a separate effect that updates a document title. Explain why the count update is not performed by mutating a variable directly.

## Common mistake to avoid

Effects are not a general place for all logic; use event handlers for user-triggered actions and derived values for pure calculations.

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

les-fe-declarative-components
