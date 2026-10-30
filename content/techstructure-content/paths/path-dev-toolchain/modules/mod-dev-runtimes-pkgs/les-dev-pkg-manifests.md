# Package Managers and Manifest Files

**Lesson ID:** `les-dev-pkg-manifests`  
**Classification:** Core  
**Module:** Runtimes & Package Management

## Learning goal

Initialize projects and distinguish between prod/dev dependencies.

## Core concept

A package manifest declares project metadata, dependencies, and often scripts. The manifest describes the intended dependency set; the package manager resolves and installs packages into a local dependency directory or cache. Runtime dependencies are needed by the deployed app; development dependencies are usually only needed for tooling and tests.

## Worked example / guided practice

Inspect a JavaScript package.json and identify its name, scripts, and dependencies. Add a small script only after checking the package manager syntax, then run it through the package manager.

## Common mistake to avoid

Do not confuse a dependency declaration with the installed package itself; both the manifest and install state can matter.

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

les-dev-runtime-managers; les-comp-data-formats; les-comp-modules-scope
