# TCP Handshakes, UDP, and OS Network Sockets

**Lesson ID:** `les-net-tcp-udp-sockets`  
**Classification:** Core  
**Module:** Transport & HTTP Basics

## Learning goal

Contrast reliable TCP streams with low-overhead UDP datagrams.

## Core concept

A socket is an API endpoint used by a program to communicate over a transport protocol. TCP provides a reliable ordered byte stream with connection setup and retransmission; UDP sends datagrams without TCP’s built-in delivery and ordering guarantees. Applications may build reliability on UDP, and TCP does not preserve application message boundaries.

## Worked example / guided practice

Choose TCP for a file transfer requiring ordered bytes and explain why UDP may fit a latency-sensitive voice stream. Identify what reliability or congestion behavior the application must handle.

## Common mistake to avoid

Neither TCP nor UDP alone defines the application protocol carried inside it.

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

les-net-ip-ports-nat
