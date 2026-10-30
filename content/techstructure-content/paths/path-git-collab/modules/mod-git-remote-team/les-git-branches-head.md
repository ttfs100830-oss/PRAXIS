# Branches as Pointers and HEAD Navigation

**Lesson ID:** `les-git-branches-head`  
**Classification:** Core  
**Module:** Collaboration & Remote Sync

## Learning goal

Create and switch branches conceptually as pointers.

## Core concept

A branch is a named pointer to a commit. Creating a branch gives work an independent line of development while sharing existing history. HEAD usually points to the current branch, or directly to a commit in detached-HEAD state. Branches make parallel work manageable but do not automatically prevent conflicting edits.

## Worked example / guided practice

Create a feature branch, make a small change, commit it, and switch back to the original branch. Verify which branch contains the commit.

## Common mistake to avoid

Do not confuse switching branches with copying a separate repository.

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

les-git-history-diff
