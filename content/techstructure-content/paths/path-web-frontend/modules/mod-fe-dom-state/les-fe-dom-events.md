# DOM Tree Manipulation and Event Delegation

**Lesson ID:** `les-fe-dom-events`  
**Classification:** Core  
**Module:** DOM Manipulation, State & DevTools

## Learning goal

Attach event listeners and mutate DOM nodes.

## Core concept

The DOM is the browser’s object representation of a document. Event listeners respond to user or browser actions. Events can bubble from a target through ancestors, allowing event delegation on a stable parent. Use textContent for plain text and be cautious with innerHTML when data may be untrusted.

## Worked example / guided practice

Attach a click handler to a list parent and identify which child was clicked using event.target. Explain why delegation can work when list items are added later.

## Common mistake to avoid

Do not insert untrusted strings as HTML; that can create cross-site scripting risks.

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

les-fe-browser-rendering; les-fe-js-functions-objects
