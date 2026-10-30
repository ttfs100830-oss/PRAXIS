# Networks, Packets, and the TCP/IP Layered Model

**Lesson ID:** `les-net-packets-layers`  
**Classification:** Core  
**Module:** Network Addressing & DNS

## Learning goal

Trace how application data is encapsulated and routed.

## Core concept

Networks move data in packets. Layering separates concerns: link delivery on a local network, IP routing between networks, transport behavior between endpoints, and application protocols such as HTTP. Encapsulation adds headers as data moves down a stack; receiving layers interpret and remove their own headers. Real implementations do not always map perfectly to textbook layers.

## Worked example / guided practice

Trace a browser request from application data through transport and IP to a local link, then explain what each layer contributes.

## Common mistake to avoid

A port identifies a transport endpoint, not a machine; an IP address identifies a network interface/addressing endpoint, not an application.

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
