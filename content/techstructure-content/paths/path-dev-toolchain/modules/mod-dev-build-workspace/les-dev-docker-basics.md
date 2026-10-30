# Docker Container Basics

**Lesson ID:** `les-dev-docker-basics`  
**Classification:** Core  
**Module:** Project Structure & Troubleshooting

## Learning goal

Run, inspect, stop, and remove prebuilt containers.

## Core concept

Docker packages an application and its required runtime files into an image; a container is a running instance of that image with isolated processes and configured networking, mounts, and environment. Containers share the host kernel, unlike full virtual machines. Images are built in layers, and build context determines which files can be copied.

## Worked example / guided practice

Read a simple Dockerfile and identify its base image, working directory, copied files, install step, and startup command. Explain why secrets should not be baked into an image layer.

## Common mistake to avoid

Docker does not replace application configuration, persistent storage planning, or security review.

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

les-comp-os-kernel
