# IPv4/IPv6, Subnets, Loopback, and Ports

**Lesson ID:** `les-net-ip-ports-nat`  
**Classification:** Core  
**Module:** Network Addressing & DNS

## Learning goal

Explain how IPs identify hosts and ports identify OS processes.

## Core concept

An IP address identifies a network interface/address in an IP network. A subnet prefix separates network bits from host bits. A transport port identifies an application endpoint on a host. NAT rewrites address and sometimes port information as traffic crosses a boundary, commonly allowing many private hosts to share a public IPv4 address.

## Worked example / guided practice

For a hypothetical client 192.168.1.20 using local port 53000 to reach a server on port 443, label source/destination IPs and ports before and after a simple NAT mapping.

## Common mistake to avoid

Private addresses are not globally routed on the public Internet, but they can communicate through gateways and NAT.

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

les-net-packets-layers; les-comp-processes-threads
