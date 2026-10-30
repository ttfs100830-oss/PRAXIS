# How Browsers Parse, Layout, Paint, and Execute Scripts

**Lesson ID:** `les-fe-browser-rendering`  
**Classification:** Advanced  
**Module:** HTML, CSS & Browser Rendering

## Learning goal

Explain how the browser constructs the DOM/CSSOM.

## Core concept

A browser parses HTML into a DOM and CSS into style information, calculates layout, paints pixels, and composites layers. JavaScript can trigger style recalculation or layout; repeated read/write cycles can cause expensive layout thrashing. Images, fonts, scripts, and network delays also affect perceived loading. Use browser performance tools to measure rather than guessing.

## Worked example / guided practice

Open DevTools and inspect a page’s DOM and computed styles. Identify one render-blocking or oversized resource and suggest a measurable improvement.

## Common mistake to avoid

Not every DOM change forces full layout; performance depends on the change and browser optimization.

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

les-fe-css-layout-responsive
