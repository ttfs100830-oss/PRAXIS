# Remote Repositories: Fetch, Pull, and Push

**Lesson ID:** `les-git-remotes-sync`  
**Classification:** Core  
**Module:** Collaboration & Remote Sync

## Learning goal

Synchronize local branches with remote tracking branches.

## Core concept

A remote is a named reference to another repository, commonly origin. Fetch downloads remote refs and objects without integrating them into the current branch; pull typically fetches and then integrates; push publishes local commits subject to permissions and branch rules. Check status and divergence before syncing.

## Worked example / guided practice

Run git remote -v and git fetch. Compare your branch with its upstream before deciding whether to merge, rebase, or push.

## Common mistake to avoid

Fetching is usually a safer first step than assuming pull will integrate cleanly.

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

les-git-branches-head
