# JavaScript Syntax, Types, and Operators

**Lesson ID:** `les-fe-js-syntax-types`  
**Classification:** Core  
**Module:** JavaScript Fundamentals

## Learning goal

Learn JS-specific variables, primitives, and logical operators.

## Core concept

JavaScript has primitive values such as string, number, bigint, boolean, undefined, symbol, and null, plus objects. Variables declared with const cannot be reassigned, but referenced objects may still be mutated; let allows reassignment. Use strict equality (===) to avoid many coercion surprises, and check types at boundaries rather than assuming external data is valid.

## Worked example / guided practice

Write a short snippet that declares a const object, changes one property, and then attempts reassignment in a separate example. Predict which operation is allowed and explain why.

## Common mistake to avoid

JSON data arrives as untrusted runtime values; TypeScript annotations or editor hints do not validate incoming JSON by themselves.

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

les-comp-variables-memory
