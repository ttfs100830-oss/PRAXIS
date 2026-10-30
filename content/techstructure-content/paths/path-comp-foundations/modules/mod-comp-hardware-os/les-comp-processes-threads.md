# les-comp-processes-threads — Processes, Threads, and Memory Allocation

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-hardware-os` — Hardware, OS & Execution Mechanics  
**Classification:** core  
**Prerequisites:** `les-comp-os-kernel`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-processes-threads` |
| Title | Processes, Threads, and Memory Allocation |
| Scope | Describe how the OS isolates process memory and schedules CPU time across threads. |
| Estimated Time | 45 minutes |
| Difficulty | Beginner |

---

## 2. Introduction — Why This Matters

Modern computers run many programs at once. The operating system creates the illusion of simultaneous execution by rapidly switching the CPU between programs. Understanding **processes** and **threads** is essential for debugging performance problems, writing concurrent code, and reasoning about memory safety.

---

## 3. Learning Objectives

1. Define a process and a thread.
2. Explain process isolation and why it matters for stability and security.
3. Describe the difference between a process’s address space and a thread’s stack.
4. Explain basic CPU scheduling concepts.
5. Recognize common symptoms of process and thread problems.

---

## 4. Terminology

| Term | Definition |
|------|------------|
| **Process** | An instance of a running program with its own isolated memory address space |
| **Thread** | A unit of execution inside a process; shares the process’s memory |
| **Address space** | The range of memory addresses a process can use |
| **Stack** | Per-thread memory used for function calls and local variables |
| **Heap** | Shared memory region used for dynamic allocation |
| **Context switch** | The act of the OS saving one thread’s state and loading another’s |
| **Scheduler** | The kernel component that decides which thread runs next |

---

## 5. Detailed Explanation

### Processes
When you start a program, the OS creates a process. Each process receives:
- Its own private virtual address space
- A process ID (PID)
- Open file handles, environment variables, and other resources

Because address spaces are isolated, one process cannot directly read or write another process’s memory. This is a fundamental security and stability guarantee.

### Threads
A process starts with one thread (the main thread). Additional threads can be created. All threads in a process share:
- The same code
- The same heap
- The same open files

But each thread has its own:
- Stack
- Register state
- Program counter

### Memory Layout of a Process (simplified)

```
High addresses
┌─────────────────┐
│      Stack      │  ← grows downward (per thread)
├─────────────────┤
│       ↓         │
│                 │
│       ↑         │
├─────────────────┤
│      Heap       │  ← grows upward (shared)
├─────────────────┤
│  Static data    │
├─────────────────┤
│  Code (text)    │
└─────────────────┘
Low addresses
```

### Scheduling
The OS scheduler runs threads for short time slices (milliseconds). When a thread blocks (waiting for I/O) or its time slice expires, the scheduler performs a context switch.

---

## 6. Practical Applications

- Why a crash in one browser tab usually doesn’t kill the whole browser (process isolation or careful thread design).
- Why multi-threaded programs can have race conditions (shared heap).
- Why “100% CPU” on one core may still leave other cores idle.

---

## 7. Common Mistakes

- Confusing processes with threads.
- Assuming all threads run truly simultaneously (they time-share on single-core machines).
- Forgetting that threads share the heap (leading to data races).

---

## 8. Exercises

1. On Linux/macOS run `ps aux` or `top` and identify three processes and their PIDs.
2. Explain why two processes can both have a variable named `x` without conflict.

---

## 9. Mastery Task

Draw the memory layout of a process that has two threads and label the stack, heap, and code regions.

---

## 10. Completion Criteria

- [ ] Can define process vs thread
- [ ] Understands address-space isolation
- [ ] Can explain what a context switch is

---

## 11. Summary

Processes provide isolation; threads provide concurrent execution inside a shared address space. The OS scheduler multiplexes the CPU among runnable threads.

---

## 12. Related Lessons

- Previous: `les-comp-os-kernel`
- Next: `les-comp-filesystems-perms`
- Later: `les-comp-concurrency-async`


---

## Worked examples and mastery practice

### Worked example: process versus thread
A process is a running program instance with its own virtual address space and OS-managed resources. Threads within the same process share that process's heap and global data, but each thread has its own execution state and stack. If process A writes to an ordinary private variable, process B does not see that write automatically. If two threads update the same shared counter without synchronization, updates can race.

A simplified virtual-memory view maps process-specific virtual addresses to physical memory pages. This isolation is a major security boundary, but shared-memory mappings and kernel-managed IPC are deliberate exceptions.

### Mastery task
Draw two processes, each with a virtual address space, and two threads inside one process. Label per-thread stacks and shared process memory. Describe one reason to use multiple processes and one reason to use multiple threads.

---

## Virtual memory and thread layout

Each process normally receives its own virtual address space. The OS and hardware memory-management unit translate virtual addresses to physical memory and enforce access permissions. This isolation helps prevent one process from casually reading or overwriting another process's memory. It does not mean every process has all of its virtual pages resident in RAM at once.

Threads within the same process share the process's code and heap/global data, but each thread has its own execution state and stack. The stack holds call frames and local execution details; the heap is commonly used for dynamically allocated objects. This is a useful conceptual model, though actual allocation details depend on the language runtime and platform.

```text
Process A address space                 Process B address space
+----------------------+                +----------------------+
| code / mapped files  |                | code / mapped files  |
| heap shared by A's   |                | heap shared by B's   |
| threads              |                | threads              |
| thread A1 stack      |                | thread B1 stack      |
| thread A2 stack      |                | thread B2 stack      |
+----------------------+                +----------------------+
        isolated by OS/hardware from the other process
```

A race condition can occur when threads access shared mutable state without coordination. If two threads both read `counter = 0`, compute `1`, and write `1`, the final result may be 1 rather than 2. A lock or atomic operation can protect the update; which tool is appropriate depends on the language and data structure.

### Mastery task

Draw a process with two threads, showing one shared heap and two separate stacks. Describe one race condition and explain how synchronization prevents the lost update.


---

## Worked examples and mastery practice

### Worked example: process versus thread
A process is a running program instance with its own virtual address space and OS-managed resources. Threads within the same process share that process's heap and global data, but each thread has its own execution state and stack. If process A writes to an ordinary private variable, process B does not see that write automatically. If two threads update the same shared counter without synchronization, updates can race.

A simplified virtual-memory view maps process-specific virtual addresses to physical memory pages. This isolation is a major security boundary, but shared-memory mappings and kernel-managed IPC are deliberate exceptions.

### Mastery task
Draw two processes, each with a virtual address space, and two threads inside one process. Label per-thread stacks and shared process memory. Describe one reason to use multiple processes and one reason to use multiple threads.
