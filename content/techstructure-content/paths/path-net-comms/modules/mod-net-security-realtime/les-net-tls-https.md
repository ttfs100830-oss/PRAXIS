# TLS Encryption, Certificates, and HTTPS

**Lesson ID:** `les-net-tls-https`  
**Classification:** Core  
**Module:** Security, Proxies & Real-Time

## Learning goal

Explain public-key cryptography and the TLS handshake.

## Core concept

HTTPS is HTTP protected by TLS. TLS helps authenticate the server (using certificates), negotiate cryptographic parameters, and protect confidentiality and integrity in transit. Certificate validation includes trust chain, hostname, validity period, and other checks. Encryption does not make a malicious website trustworthy or protect data after it reaches the endpoint.

## Worked example / guided practice

Explain what a browser checks when connecting to https://example.com and why a hostname mismatch matters. Distinguish encryption in transit from authorization to access a resource.

## Common mistake to avoid

Do not disable certificate validation to “fix” a connection; investigate certificate, system clock, proxy, or trust configuration.

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
