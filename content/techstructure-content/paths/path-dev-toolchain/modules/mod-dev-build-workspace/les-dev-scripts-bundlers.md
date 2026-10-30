# Task Runners, Transpilers, and Bundlers

**Lesson ID:** `les-dev-scripts-bundlers`  
**Classification:** Core  
**Module:** Project Structure & Troubleshooting

## Learning goal

Configure automated task scripts and code transformation.

## Core concept

Project scripts name repeatable commands such as dev, build, test, and lint. A bundler resolves imports and transforms assets or code into deployable output; a development server may add fast refresh and diagnostics. Build output is generated, so debugging should distinguish source files from bundled files and source maps.

## Worked example / guided practice

Read the scripts in a package manifest, run the test or build script, and record the exact command and resulting output directory.

## Common mistake to avoid

Do not assume a successful development server means a production build will succeed.

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

les-dev-project-anatomy; les-comp-type-systems
