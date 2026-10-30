# The Client-Server Model and Role Separation

**Lesson ID:** `les-arch-client-server`  
**Classification:** Core  
**Module:** Software Systems & Request Lifecycles

## Learning goal

Explain why presentation clients are separated from backend servers.

## Core concept

In a client-server model, a client initiates a request and a server provides a service. A browser can be a client to an API, while that API is itself a client of a database or another service. Keep secrets and authoritative validation on the server; client-side checks improve usability but cannot enforce security by themselves.

## Worked example / guided practice

Trace a login form submission from browser to API to database and back. Mark which layer validates input, verifies credentials, and decides whether a resource may be accessed.

## Common mistake to avoid

The client is under the user’s control; never rely on client-side authorization for protected data.

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

les-arch-what-is-system; les-net-http-anatomy
