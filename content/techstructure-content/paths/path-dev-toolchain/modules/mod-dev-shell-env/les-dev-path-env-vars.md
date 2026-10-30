# PATH, .env Files, and Secret Hygiene

**Lesson ID:** `les-dev-path-env-vars`  
**Classification:** Core  
**Module:** Shells, Environment & Editor Mastery

## Learning goal

Diagnose command not found errors and inject configuration via environment variables.

## Core concept

Environment variables are named values inherited by child processes. PATH is an ordered list of directories used to locate executables; the first matching executable often wins. A shell-local variable may not be exported to child processes. On Windows, use the appropriate PowerShell environment syntax and reopen terminals after persistent PATH changes.

## Worked example / guided practice

Print PATH and locate the executable for a tool that fails. Compare the result with the intended install directory; change one entry at a time and open a fresh terminal to test.

## Common mistake to avoid

A package installed on disk is not necessarily discoverable from every terminal. Diagnose executable location and PATH before reinstalling.

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

les-dev-shells-profiles
