# Working Tree, Staging Area, and Atomic Commits

**Lesson ID:** `les-git-staging-commits`  
**Classification:** Core  
**Module:** Local Version Control

## Learning goal

Move changes deliberately to craft atomic commits.

## Core concept

Staging is an intentional selection of changes for the next commit. Small commits should represent one coherent change and have messages that describe intent. Use git diff to inspect unstaged changes and git diff --staged to inspect what will be committed. Avoid committing credentials, generated output, or unrelated formatting.

## Worked example / guided practice

Make two unrelated edits in a practice repository. Stage only one, inspect the staged diff, commit it, then verify the other edit remains uncommitted.

## Common mistake to avoid

Always review the staged diff before committing when working in a shared repository.

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

les-git-mental-model
