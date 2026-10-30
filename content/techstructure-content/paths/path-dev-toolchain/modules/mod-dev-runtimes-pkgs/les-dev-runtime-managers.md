# Managing Node.js and Python Runtimes

**Lesson ID:** `les-dev-runtime-managers`  
**Classification:** Core  
**Module:** Runtimes & Package Management

## Learning goal

Switch between project-specific runtime versions.

## Core concept

A runtime executes a language or application, while a version manager helps select among installed runtime versions. Different projects may require different versions, so document the expected version and verify the active one in the terminal. Version managers can change PATH shims, which means a correct installation can still be hidden by an earlier PATH entry.

## Worked example / guided practice

Run the runtime version command in the project directory and compare it with the project requirement. Switch to the required version, then verify again in a newly opened terminal.

## Common mistake to avoid

Avoid upgrading a shared runtime blindly: a version change can alter dependency compatibility and build behavior.

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

les-dev-path-env-vars; les-comp-source-to-exec
