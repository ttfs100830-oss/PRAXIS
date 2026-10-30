# les-comp-cpu-memory — CPU, RAM, and Persistent Storage

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-hardware-os` — Hardware, OS & Execution Mechanics  
**Classification:** core  
**Prerequisites:** none  

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-cpu-memory` |
| Title | CPU, RAM, and Persistent Storage |
| Scope | Explain how instructions and data flow from persistent disk into volatile RAM and are executed. |
| Estimated Time | 35–45 minutes |
| Difficulty | Beginner |

---

## 2. Introduction — Why This Matters

Every piece of software you will ever write, run, or debug ultimately executes on physical hardware. Understanding the relationship between the **CPU**, **RAM**, and **persistent storage** is the foundation of all systems thinking.

When a program feels slow, when an application runs out of memory, or when data disappears after a crash, the root cause almost always lives in how these three components interact. Without this mental model, later topics (processes, virtual memory, databases, containers) become magic.

This lesson builds the lowest-level accurate picture of how a computer actually runs code.

---

## 3. Learning Objectives

By the end of this lesson you will be able to:

1. Describe the roles of the CPU, RAM, and persistent storage.
2. Explain the difference between volatile and non-volatile memory.
3. Trace the high-level flow of instructions and data from disk → RAM → CPU.
4. Explain why programs must be loaded into RAM before they can execute.
5. Identify the fundamental performance and durability trade-offs between these components.

---

## 4. Terminology

| Term | Simple Definition |
|------|-------------------|
| **CPU (Central Processing Unit)** | The “brain” that fetches, decodes, and executes instructions. |
| **RAM (Random Access Memory)** | Fast, temporary working memory. Contents are lost when power is removed. |
| **Persistent Storage** | Long-term storage (SSD, HDD, NVMe). Data survives power loss. |
| **Volatile Memory** | Memory that requires continuous power to retain data (RAM). |
| **Non-volatile Memory** | Memory that retains data without power (disk, flash). |
| **Fetch-Decode-Execute Cycle** | The basic loop the CPU uses to run every instruction. |
| **Bus** | The communication pathways that move data between CPU, RAM, and storage. |

---

## 5. Detailed Conceptual Explanation

### 5.1 The Three Layers of Memory Hierarchy

Modern computers have a hierarchy of storage ordered by speed and capacity:

```
CPU Registers  →  extremely fast, tiny
L1 / L2 / L3 Cache → very fast, small
RAM            →  fast, medium size
Persistent Storage (SSD/HDD) → slower, very large
```

For this lesson we focus on the three that every developer must understand: **CPU**, **RAM**, and **persistent storage**.

### 5.2 Persistent Storage

Persistent storage is where your operating system, applications, and data live when the computer is turned off. Common types:

- **HDD** (Hard Disk Drive) — spinning magnetic platters
- **SSD** (Solid State Drive) — flash memory, much faster than HDD
- **NVMe** — high-performance SSD connected via PCIe

Characteristics:
- Data survives power loss
- Capacity is measured in hundreds of gigabytes to terabytes
- Access is relatively slow compared with RAM (especially random access)

### 5.3 RAM — Working Memory

RAM is the computer’s active workspace. When you open a program:

1. The OS copies the program’s code and data from disk into RAM.
2. The CPU can then execute the instructions that now reside in RAM.

Key properties of RAM:
- Extremely fast compared with disk
- Volatile — everything disappears when power is removed
- Capacity is typically 8 GB – 64 GB on modern machines
- Random access: any location can be read/written in roughly the same time

### 5.4 The CPU and the Fetch-Decode-Execute Cycle

The CPU repeatedly performs three steps:

1. **Fetch** — retrieve the next instruction from RAM (using the Program Counter)
2. **Decode** — interpret what the instruction means
3. **Execute** — perform the operation (add numbers, compare values, jump, etc.)

This cycle runs billions of times per second.

### 5.5 The Complete Flow

```
[Disk]  --load-->  [RAM]  --fetch-->  [CPU]
          |                  |
          |                  +-- write results back to RAM
          |
          +-- later save results back to disk (if needed)
```

Important consequences:
- A program that is only on disk cannot run.
- If RAM is full, the OS may use disk as “swap” (very slow).
- When a process crashes or the machine loses power, anything not written back to disk is lost.

---

## 6. Diagram — Data Flow

```
┌─────────────────┐
│ Persistent Disk │
│  (program.bin)  │
└────────┬────────┘
         │ load (slow)
         ▼
┌─────────────────┐
│      RAM        │
│  instructions   │
│  + data         │
└────────┬────────┘
         │ fetch (fast)
         ▼
┌─────────────────┐
│      CPU        │
│  registers      │
│  ALU / control  │
└─────────────────┘
```

---

## 7. Practical Engineering Applications

- **Why containers and VMs need memory limits** — they share the host’s RAM.
- **Why databases use buffer pools** — they keep hot data in RAM for speed.
- **Why “out of memory” kills processes** — the OS cannot give the process more RAM.
- **Why you should save work frequently** — RAM is volatile.

---

## 8. Common Mistakes & Debugging Guidance

| Mistake | Reality | How to diagnose |
|---------|---------|-----------------|
| Assuming data on disk is “in memory” | Only data currently loaded into RAM is accessible to the CPU at full speed | Use tools like `htop`, Activity Monitor, or `free -h` |
| Believing more disk space solves memory problems | Disk is not a substitute for RAM | Watch for high swap usage |
| Thinking closing a window frees all memory | Memory may be retained by background processes or caches | Check process list |

---

## 9. Exercises

**Exercise 1 — Observation**  
Open a terminal and run:
```bash
free -h          # Linux
# or
vm_stat          # macOS
```
Record the total RAM and how much is currently used.

**Exercise 2 — Mental Model**  
In your own words, explain what happens when you double-click an application icon. Trace the path from disk to CPU.

**Exercise 3 — Failure Scenario**  
A program works fine on a machine with 32 GB RAM but crashes on a machine with 8 GB. What is the most likely cause?

---

## 10. Practical Mastery Task

Write a short paragraph (5–8 sentences) that explains to a non-technical friend:
- What RAM is
- Why a computer needs both RAM and a hard drive/SSD
- What happens to open documents if the power suddenly goes out

---

## 11. Completion Criteria

You have completed this lesson when you can:

- [ ] Correctly distinguish volatile vs non-volatile memory
- [ ] Draw the disk → RAM → CPU flow from memory
- [ ] Explain why programs must be loaded into RAM
- [ ] Identify at least two real-world consequences of the memory hierarchy

---

## 12. Summary

- Persistent storage holds programs and data when the machine is off.
- RAM is the fast, temporary workspace the CPU uses.
- The CPU executes instructions by repeatedly fetching them from RAM.
- Understanding this hierarchy is the foundation for every later systems topic.

---

## 13. Related Lessons

- Next: `les-comp-data-encoding` — Binary, Character Encoding, and Time
- Next: `les-comp-os-kernel` — Operating Systems, Kernel vs. User Space
- Later: `les-comp-processes-threads` — how the OS manages multiple programs in RAM


---

## Worked examples and mastery practice

### Worked example: tracing a program's data
Suppose a Python script reads `price = 12` and calculates `total = price * 3`. The script file begins on persistent storage. When launched, the operating system creates a process and loads the program and required runtime into memory. The CPU fetches and executes machine instructions; values and intermediate state are held in registers and RAM, while caches can reduce the latency of repeated memory access. Saving a result to a file writes it to persistent storage; merely changing a Python variable does not.

For a rough scale comparison, if an operation needs data already in a CPU register it can be much faster than waiting for storage I/O. Exact latency depends on hardware and workload, so avoid memorizing a single universal timing number.

### Mastery task
Draw and explain the path from a saved Python file to its instructions running, then explain what changes when the program writes a report to disk. Label CPU, RAM, persistent storage, and at least one cache level. Explain why power loss normally erases RAM state but not a saved file.

---

## Worked numeric example: memory units

A program's file size on disk is not the same as its current RAM use. The operating system loads program code and data as needed, and runtime allocations can grow or shrink. CPU registers hold tiny amounts of immediately needed data; caches keep copies of frequently accessed data closer to the CPU; RAM holds active code and data; persistent storage retains files when power is off.

For units, many operating systems report memory in bytes. In decimal storage marketing, 1 GB is 1,000,000,000 bytes. A binary gibibyte (GiB) is 1,073,741,824 bytes (1024³). Thus 8 GiB is 8,589,934,592 bytes. Tools may display GB and GiB inconsistently, so check the unit before comparing numbers.

A simplified path is: persistent file → OS loader → virtual memory pages mapped into RAM → CPU fetches instructions/data through caches and registers → execution. The cache is not a separate step that every instruction must visibly traverse in a simple diagram; modern CPUs use several cache levels and hardware prefetching.

### Mastery task

Draw and explain the path of a program from saved executable to running process. Include storage, virtual memory/RAM, cache, registers, and CPU, and explain what normally happens to RAM contents after power loss.


---

## Worked examples and mastery practice

### Worked example: tracing a program's data
Suppose a Python script reads `price = 12` and calculates `total = price * 3`. The script file begins on persistent storage. When launched, the operating system creates a process and loads the program and required runtime into memory. The CPU fetches and executes machine instructions; values and intermediate state are held in registers and RAM, while caches can reduce the latency of repeated memory access. Saving a result to a file writes it to persistent storage; merely changing a Python variable does not.

For a rough scale comparison, if an operation needs data already in a CPU register it can be much faster than waiting for storage I/O. Exact latency depends on hardware and workload, so avoid memorizing a single universal timing number.

### Mastery task
Draw and explain the path from a saved Python file to its instructions running, then explain what changes when the program writes a report to disk. Label CPU, RAM, persistent storage, and at least one cache level. Explain why power loss normally erases RAM state but not a saved file.
