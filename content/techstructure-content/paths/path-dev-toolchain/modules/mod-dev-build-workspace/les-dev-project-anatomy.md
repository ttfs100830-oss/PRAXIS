# Anatomy of a Real Software Repository

**Lesson ID:** `les-dev-project-anatomy`  
**Classification:** Core  
**Module:** Project Structure & Troubleshooting

## Learning goal

Identify the purpose of standard repository files.

## Core concept

A project root usually contains source code, dependency metadata, tests, configuration, documentation, and generated output. Source files should be separated from build artifacts and secrets. A README explains how to install, run, test, and configure the project. A predictable layout reduces onboarding time and makes tooling easier to configure.

## Worked example / guided practice

Inspect a small repository and label its entry point, configuration, tests, dependency manifest, and generated files. Add a README section with reproducible setup and test commands.

## Common mistake to avoid

Do not commit generated folders or secret environment files merely because they appear in your working directory.

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

les-dev-pkg-manifests
