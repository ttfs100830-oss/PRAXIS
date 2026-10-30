# Declarative UI Components (React)

**Lesson ID:** `les-fe-declarative-components`  
**Classification:** Core  
**Module:** Component Architecture (React)

## Learning goal

Explain why declarative component trees eliminate DOM sync bugs.

## Core concept

Declarative UI describes what the interface should look like for a given state; the framework reconciles changes. In React, components are functions that return UI descriptions, and JSX is syntax transformed by tooling. Keep components focused, render lists with stable keys, and avoid directly mutating the DOM behind React’s back.

## Worked example / guided practice

Create a component that receives a title prop and renders a heading. Render several items from an array with stable IDs as keys.

## Common mistake to avoid

A key helps React track list items; it is not automatically passed as a normal prop to the child.

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

les-fe-dom-events; les-fe-fetch-async-ui; les-fe-js-modules; les-comp-collections
