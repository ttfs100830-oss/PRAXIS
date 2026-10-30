# Git's Snapshot Model and the .git Directory

**Lesson ID:** `les-git-mental-model`  
**Classification:** Core  
**Module:** Local Version Control

## Learning goal

Explain how Git stores content-addressable snapshots.

## Core concept

Git records snapshots through commits. The working tree contains current files, the index/staging area selects what the next commit will contain, and HEAD identifies the current checkout/commit. Branches are movable names pointing to commits, not separate copies of every file. Understanding these areas makes status output much easier to interpret.

## Worked example / guided practice

Change one file, inspect git status, stage only that file, inspect status again, and commit. Explain which version of the file is in the working tree, index, and new commit.

## Common mistake to avoid

A commit captures staged content, not automatically every change visible in the directory.

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

les-comp-filesystems-perms; les-comp-cli-navigation
