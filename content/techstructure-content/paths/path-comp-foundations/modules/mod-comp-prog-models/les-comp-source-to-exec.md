# les-comp-source-to-exec — Source Code, Compilation, and Interpretation

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-prog-models` — Programming Models & Data Formats  
**Classification:** core  
**Prerequisites:** `les-comp-processes-threads`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-source-to-exec` |
| Title | Source Code, Compilation, and Interpretation |
| Scope | Compare compilation, virtual machines, and interpreted runtimes. |
| Estimated Time | 40 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

Source code is human-readable text. CPUs execute machine code. The path between those two extremes determines startup time, performance, portability, and debugging experience. This lesson compares the major execution models.

---

## 3. Learning Objectives

1. Distinguish source code, bytecode, and machine code.
2. Explain ahead-of-time compilation.
3. Explain interpretation and virtual machines.
4. Compare the trade-offs of each model.
5. Identify which model common languages use.

---

## 4. Execution Models

### Ahead-of-Time (AOT) Compilation
Source → Compiler → Native machine code  
Examples: C, C++, Go, Rust  

Pros: maximum runtime performance, no interpreter needed  
Cons: platform-specific binaries, longer compile times

### Interpretation
Source → Interpreter executes line by line  
Classic examples: early BASIC, some scripting shells  

### Bytecode + Virtual Machine
Source → Compiler → Bytecode → VM interprets or JIT-compiles  
Examples: Java (JVM), C# (CLR), Python (CPython bytecode), JavaScript (modern engines)

### JIT Compilation
The VM translates hot bytecode into native machine code at runtime.  
Modern JavaScript engines and the JVM rely heavily on JIT.

---

## 5. Practical Comparison

| Language | Primary Model | Notes |
|----------|---------------|-------|
| C / Rust / Go | AOT native | Fast startup, fast runtime |
| Java | Bytecode + JIT | “Write once, run anywhere” |
| Python | Bytecode + Interpreter | Highly dynamic, slower loops |
| JavaScript | Parsing + JIT | Extremely optimized VMs |

---

## 6. Why It Matters for Developers

- Understanding why Python feels slower for tight loops.
- Understanding why Java needs a warm-up period.
- Choosing the right language for the performance profile of a problem.
- Debugging “works on my machine” issues related to different runtimes.

---

## 7. Exercises

1. Name one language for each model: pure AOT, bytecode VM, primarily interpreted.
2. Explain why distributing a Python program is different from distributing a Go program.

---

## 8. Completion Criteria

- [ ] Can explain the difference between compilation and interpretation
- [ ] Understands the role of a virtual machine and bytecode
- [ ] Can place common languages into the correct model

---

## 9. Related Lessons

- Previous: `les-comp-processes-threads`
- Next: `les-comp-variables-memory`


---

## Worked examples and mastery practice

### Worked example: Python and Go
A Python source file is parsed and compiled to Python bytecode, which a Python virtual machine executes; implementation details vary by interpreter. Go normally compiles source into a native executable for the target platform. Both workflows can include multiple stages such as parsing, type checking, optimization, linking, and runtime support. “Compiled” and “interpreted” are not mutually exclusive labels for every part of a modern runtime.

```python
# hello.py
print("hello")
```
Running `python hello.py` asks the Python runtime to execute the file. A Go program is commonly built with `go build` and then run as an executable. Distribution choices affect deployment: a Python app may require a compatible interpreter and dependencies; a Go binary can often be shipped as a single executable, though target OS/architecture and external libraries still matter.

### Mastery task
Compare a Python application and a Go command-line tool across source, build/runtime steps, dependencies, and distribution. Avoid claiming that every Python implementation or every Go build behaves identically.

---

## Follow one program through execution

Consider `print(2 + 3)` in Python. The implementation parses source text, compiles it to an internal code representation (CPython commonly uses bytecode), and the Python runtime executes that representation. This is why describing Python as simply “interpreted line by line” is incomplete. Exact implementation details vary across Python implementations and versions.

For a Go program, the compiler normally produces a native executable for a target platform and architecture. That executable is still dependent on the target OS/ABI and may depend on external libraries or system services. Java commonly compiles source to bytecode that runs on a JVM; the JVM may interpret bytecode and JIT-compile frequently used code into native machine code. Modern JavaScript engines also combine parsing, bytecode or intermediate representations, and JIT optimization.

| Stage | Meaning | Example artifact |
|---|---|---|
| Source | Human-authored text | `main.py`, `Main.java` |
| Intermediate code | Runtime-oriented representation | CPython bytecode, JVM bytecode |
| Native machine code | Instructions for a target CPU | Executable code in a Go binary |
| Runtime | Services needed to execute/manage program | Python interpreter, JVM, JS engine |

Compilation and interpretation are not mutually exclusive labels for entire languages. A runtime can compile some parts and interpret others. Distribution trade-offs include startup time, portability, runtime dependencies, build complexity, and optimization opportunities.

### Mastery task

Compare how a small Python program and a Go program are commonly prepared and distributed. Identify source, compiler/runtime, and the artifact delivered, and avoid claiming that one model is always faster in every situation.


---

## Worked examples and mastery practice

### Worked example: Python and Go
A Python source file is parsed and compiled to Python bytecode, which a Python virtual machine executes; implementation details vary by interpreter. Go normally compiles source into a native executable for the target platform. Both workflows can include multiple stages such as parsing, type checking, optimization, linking, and runtime support. “Compiled” and “interpreted” are not mutually exclusive labels for every part of a modern runtime.

```python
# hello.py
print("hello")
```
Running `python hello.py` asks the Python runtime to execute the file. A Go program is commonly built with `go build` and then run as an executable. Distribution choices affect deployment: a Python app may require a compatible interpreter and dependencies; a Go binary can often be shipped as a single executable, though target OS/architecture and external libraries still matter.

### Mastery task
Compare a Python application and a Go command-line tool across source, build/runtime steps, dependencies, and distribution. Avoid claiming that every Python implementation or every Go build behaves identically.
