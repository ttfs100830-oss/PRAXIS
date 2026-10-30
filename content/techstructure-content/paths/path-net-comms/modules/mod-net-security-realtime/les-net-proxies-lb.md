# Forward Proxies, Reverse Proxies, and Load Balancers

**Lesson ID:** `les-net-proxies-lb`  
**Classification:** Core  
**Module:** Security, Proxies & Real-Time

## Learning goal

Distinguish forward proxies from reverse proxies that distribute traffic.

## Core concept

A forward proxy acts on behalf of clients; a reverse proxy sits in front of servers. A load balancer distributes requests across backends using a configured policy and health checks. These components can terminate TLS, route by host/path, enforce limits, and add observability, but may introduce headers and trust-boundary concerns.

## Worked example / guided practice

Draw client → reverse proxy/load balancer → two app instances. Mark where TLS terminates and explain what happens if one backend fails its health check.

## Common mistake to avoid

Forwarded headers are trustworthy only when the application trusts the proxy that sets them and prevents client spoofing.

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
