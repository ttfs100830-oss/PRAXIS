# Semantic Versioning and Lockfiles

**Lesson ID:** `les-dev-semver-lockfiles`  
**Classification:** Core  
**Module:** Runtimes & Package Management

## Learning goal

Explain why lockfiles guarantee deterministic installs.

## Core concept

Semantic versioning commonly expresses MAJOR.MINOR.PATCH. A compatible patch release fixes bugs, a minor release adds backward-compatible features, and a major release may break compatibility. Version ranges describe acceptable versions; a lockfile records a resolved dependency tree for repeatable installs. Exact semantics vary by ecosystem and package manager.

## Worked example / guided practice

Compare a manifest range such as ^1.4.0 with the exact version recorded in a lockfile. Explain why two developers should commit the lockfile for an application when the package manager expects one.

## Common mistake to avoid

A lockfile improves repeatability but does not guarantee that every machine, OS, native dependency, or external service behaves identically.

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
