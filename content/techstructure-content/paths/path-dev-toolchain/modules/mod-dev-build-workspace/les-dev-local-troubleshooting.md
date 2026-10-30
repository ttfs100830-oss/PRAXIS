# Systematic Local Environment Troubleshooting

**Lesson ID:** `les-dev-local-troubleshooting`  
**Classification:** Core  
**Module:** Project Structure & Troubleshooting

## Learning goal

Resolve port conflicts, permissions, and dependency issues.

## Core concept

Troubleshooting is a controlled process: reproduce the failure, capture the exact error, identify the failing layer, change one variable, and retest. Check working directory, executable versions, environment variables, dependency installation, ports, and permissions before deleting files or reinstalling everything.

## Worked example / guided practice

Given “command not found,” test whether the executable exists, whether the current shell can find it, and whether a new terminal sees the same PATH. Record evidence before changing configuration.

## Common mistake to avoid

Prefer reversible, narrow fixes. Avoid destructive cleanup commands until you know what they remove.

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

les-dev-scripts-bundlers; les-comp-cli-processes
