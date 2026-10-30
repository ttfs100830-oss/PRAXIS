# Network Troubleshooting CLI Tools (curl, ping, dig)

**Lesson ID:** `les-net-troubleshooting-cli`  
**Classification:** Core  
**Module:** Security, Proxies & Real-Time

## Learning goal

Diagnose network failures using command-line diagnostic tools.

## Core concept

Network troubleshooting works best layer by layer: resolve the name, test reachability where appropriate, verify the port/service, inspect HTTP response and TLS, then check application logs. Tools such as ping, traceroute/tracert, nslookup/dig, curl, and ss/netstat answer different questions and have platform differences. Firewalls may block probes even when a service works.

## Worked example / guided practice

For “site does not load,” write a short diagnostic sequence using DNS lookup, curl -v, and a port/service check. For each command, state what a success or failure does—and does not—prove.

## Common mistake to avoid

A failed ping does not prove a website is down; ICMP may be blocked.

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

les-net-http-anatomy; les-comp-cli-processes
