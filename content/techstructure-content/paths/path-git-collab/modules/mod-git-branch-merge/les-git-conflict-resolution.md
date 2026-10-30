# Diagnosing and Resolving Merge Conflicts

**Lesson ID:** `les-git-conflict-resolution`  
**Classification:** Core  
**Module:** Merging & Advanced History

## Learning goal

Interpret conflict markers and resolve competing changes.

## Core concept

A conflict occurs when Git cannot automatically combine overlapping changes or incompatible file operations. The conflict markers show competing versions. Resolve by understanding intended behavior, editing the file to a valid final state, removing markers, running tests, and staging the resolved file. “Accept ours” or “theirs” blindly can discard required work.

## Worked example / guided practice

Create a conflict in a disposable branch by editing the same line twice. Inspect markers, combine the intended changes, search for leftover markers, test, and complete the merge.

## Common mistake to avoid

A file that no longer contains conflict markers may still contain a logical mistake.

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

les-git-merge-rebase
