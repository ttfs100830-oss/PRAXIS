# Inspecting History, Diffs, and Undoing Local Mistakes

**Lesson ID:** `les-git-history-diff`  
**Classification:** Core  
**Module:** Local Version Control

## Learning goal

Inspect project evolution and safely undo local mistakes.

## Core concept

Git history lets you inspect how a project changed and why. git log summarizes commits; git show inspects a commit; git diff compares states. A diff is a line-oriented comparison, not a complete semantic explanation. Use commit IDs and paths to narrow investigation, and avoid rewriting shared history unless the team agrees.

## Worked example / guided practice

Use git log --oneline, then git show on one commit. Find the file changed and describe the intent from both the diff and commit message.

## Common mistake to avoid

A commit message can be inaccurate; verify the actual diff.

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

les-git-staging-commits
