# Domain Name System (DNS) Resolution Lifecycle

**Lesson ID:** `les-net-dns-resolution`  
**Classification:** Core  
**Module:** Network Addressing & DNS

## Learning goal

Trace how a domain name resolves to an IP address.

## Core concept

DNS maps names to records such as A/AAAA addresses and CNAME aliases. A resolver may answer from cache or query DNS infrastructure. TTL controls how long records may be cached; it is not an exact promise that every client updates at that second. DNS failure can result from stale caches, incorrect records, network restrictions, or resolver issues.

## Worked example / guided practice

Use nslookup or dig for a hostname and identify the queried name, record type, answer, and TTL if shown. Compare results from two resolvers if you suspect a stale answer.

## Common mistake to avoid

DNS translates names to records; it does not guarantee that the destination service is healthy.

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
