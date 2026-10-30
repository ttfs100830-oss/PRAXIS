# Fast-Forward Merges, 3-Way Merges, and Rebasing

**Lesson ID:** `les-git-merge-rebase`  
**Classification:** Advanced  
**Module:** Merging & Advanced History

## Learning goal

Combine divergent branches and explain rebasing trade-offs.

## Core concept

Merge integrates histories and can create a merge commit; rebase replays commits onto a new base and changes their commit IDs. Both can be useful. Rebase often produces a linear history but should generally not rewrite commits that others already depend on. Choose based on team policy and collaboration context.

## Worked example / guided practice

Draw two branches that diverge from one commit. Show what a merge commit records and how rebase replays the feature commits onto the target branch.

## Common mistake to avoid

Never force-push rewritten shared history without coordination; use safer force-with-lease only when the workflow explicitly permits it.

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

les-git-remotes-sync
