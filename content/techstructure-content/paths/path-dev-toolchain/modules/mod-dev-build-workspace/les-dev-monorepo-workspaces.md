# Package Workspaces and Basic Monorepos

**Lesson ID:** `les-dev-monorepo-workspaces`  
**Classification:** Advanced  
**Module:** Project Structure & Troubleshooting

## Learning goal

Set up a basic monorepo using package manager workspaces.

## Core concept

A monorepo stores multiple related packages or applications in one repository. Workspaces let a package manager link local packages and coordinate dependency installation. Benefits include shared tooling and atomic changes; costs include larger repositories, more complex builds, and the need to define ownership and dependency boundaries.

## Worked example / guided practice

Sketch a repository containing a web app and a shared utility package. Show which package depends on which and explain why a shared package should not depend back on the app.

## Common mistake to avoid

A monorepo is an organizational choice, not automatically better than multiple repositories.

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

les-dev-semver-lockfiles
