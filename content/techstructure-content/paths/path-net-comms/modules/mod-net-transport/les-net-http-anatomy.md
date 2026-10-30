# Anatomy of HTTP Requests and Responses

**Lesson ID:** `les-net-http-anatomy`  
**Classification:** Core  
**Module:** Transport & HTTP Basics

## Learning goal

Parse raw HTTP messages, methods, headers, and status codes.

## Core concept

HTTP messages contain a start line, headers, a blank line, and sometimes a body. A request includes a method and target; a response includes a status code. Headers carry metadata such as content type and caching policy. HTTP semantics are distinct from the transport connection; HTTP/1.1, HTTP/2, and HTTP/3 differ in framing and transport details.

## Worked example / guided practice

Annotate a sample GET request and a 200 response. Explain method, path, Host, Content-Type, status, and why a GET usually has no request body in common APIs.

## Common mistake to avoid

A status code describes the result at the HTTP layer; it does not automatically explain the application’s full internal state.

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

les-net-tcp-udp-sockets; les-net-dns-resolution
