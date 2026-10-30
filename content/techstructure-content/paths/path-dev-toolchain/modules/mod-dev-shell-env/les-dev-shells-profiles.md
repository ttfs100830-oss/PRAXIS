# Shells and Startup Profiles

**Lesson ID:** `les-dev-shells-profiles`  
**Classification:** Core  
**Module:** Shells, Environment & Editor Mastery

## Learning goal

Configure shell startup scripts without breaking terminals.

## Core concept

A shell reads startup files to configure prompts, aliases, functions, and environment variables. Interactive and login shells may read different files; exact behavior depends on Bash, Zsh, PowerShell, and platform. Keep startup scripts fast and safe, and avoid commands that require user input in files that run automatically.

## Worked example / guided practice

Inspect which shell you use, then add a harmless alias in the appropriate interactive profile. Open a new terminal and verify it; if startup breaks, launch the shell without profiles or rename the file to recover.

## Common mistake to avoid

A startup profile is configuration code, not a universal file shared by every shell. Never paste Bash syntax into PowerShell without adapting it.

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

les-comp-cli-streams-pipes
