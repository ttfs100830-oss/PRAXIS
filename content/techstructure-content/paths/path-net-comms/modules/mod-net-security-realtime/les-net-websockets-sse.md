# Real-Time Protocols: WebSockets and SSE

**Lesson ID:** `les-net-websockets-sse`  
**Classification:** Advanced  
**Module:** Security, Proxies & Real-Time

## Learning goal

Select the appropriate protocol for bidirectional or server-push events.

## Core concept

Server-Sent Events (SSE) provide a server-to-client event stream over HTTP and are naturally one-way. WebSockets establish a persistent bidirectional connection for messages in both directions. Polling repeatedly requests updates and may be simpler for low-frequency needs. Consider reconnect behavior, authentication, proxy timeouts, scaling, and message delivery semantics.

## Worked example / guided practice

Choose between polling, SSE, and WebSockets for a live dashboard, a server-driven notification feed, and a collaborative editor. Justify each choice by directionality and interaction frequency.

## Common mistake to avoid

A persistent connection does not by itself guarantee durable delivery or exactly-once processing.

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

les-net-http-anatomy
