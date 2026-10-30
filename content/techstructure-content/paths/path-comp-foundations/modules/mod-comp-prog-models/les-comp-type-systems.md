# les-comp-type-systems — Static vs. Dynamic Typing and Type Safety

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-prog-models` — Programming Models & Data Formats  
**Classification:** core  
**Prerequisites:** `les-comp-control-functions`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-type-systems` |
| Title | Static vs. Dynamic Typing and Type Safety |
| Scope | Explain how static type checkers catch structural bugs before runtime. |
| Estimated Time | 40 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

Type systems classify values and restrict which operations are legal. Static typing catches entire categories of bugs before the program runs; dynamic typing defers checks until execution. Both have valid use cases.

---

## 3. Learning Objectives

1. Define static typing and dynamic typing.
2. Explain the difference between compile-time and runtime type errors.
3. Recognize the benefits of type annotations even in dynamically typed languages.
4. Understand gradual typing (TypeScript, Python type hints).

---

## 4. Comparison

| Aspect | Static (Java, Go, TypeScript) | Dynamic (Python, JavaScript, Ruby) |
|--------|-------------------------------|------------------------------------|
| When checked | Before execution | During execution |
| Performance | Often better (more info for optimizer) | More runtime checks |
| Flexibility | Less flexible | Highly flexible |
| Early error detection | Excellent | Limited |

---

## 5. Practical Value

Type annotations serve as machine-checked documentation and enable powerful editor tooling (autocomplete, safe renames, jump-to-definition).

---

## 6. Exercises

1. Give one example of a bug a static type checker would catch that a dynamic language would only discover at runtime.
2. Add type annotations to a small Python or JavaScript function.

---

## 7. Completion Criteria

- [ ] Can explain static vs dynamic typing
- [ ] Understands why TypeScript and Python type hints exist
- [ ] Appreciates the trade-offs

---

## 8. Related Lessons

- Previous: `les-comp-control-functions`
- Later: language-specific tooling lessons


---

## Worked examples and mastery practice

### Worked example: static checks versus runtime checks
Python is dynamically typed; type annotations help tools such as mypy or pyright analyze code, but Python does not generally enforce annotations at runtime.
```python
def greet(name: str) -> str:
    return "Hello, " + name

print(greet("Ari"))
```
A static checker can flag `greet(3)` before execution, but ordinary Python may only fail when `+` attempts to combine a string and integer. Type systems differ in when and how they enforce constraints. JavaScript does not support TypeScript-style `name: string` annotations in ordinary `.js` files; TypeScript adds a compile-time type-checking layer and emits JavaScript.

Static typing can catch classes of mistakes early, but it does not prove a program has no bugs. Runtime validation is still needed for untrusted input and external data.

### Mastery task
For a function receiving an API payload, identify what a static type checker can catch and what must still be checked at runtime. Compare plain Python with Python plus a static checker, and JavaScript with TypeScript.

---

## Static checking versus runtime validation

A static checker analyzes code before execution and can flag incompatible operations. Dynamic languages can still have static analysis tools, and statically typed programs can still fail at runtime due to invalid input, network failures, or logic errors.

```python
def greet(name: str) -> str:
    return "Hello, " + name

print(greet("Mira"))
# A static checker can flag greet(3), but ordinary Python does not enforce hints by itself.
```

Python type hints are metadata used by editors and tools such as mypy or pyright; the interpreter generally does not enforce them automatically. TypeScript syntax is checked by the TypeScript compiler and erased from ordinary emitted JavaScript; `name: string` is not valid standard JavaScript parameter-annotation syntax. Data arriving from JSON, a database, or a network still needs runtime validation because external data is not made trustworthy by a static annotation.

Static typing can catch certain mistakes early and improve refactoring/tooling. Dynamic typing can make experimentation concise, but some type errors appear only when the problematic path executes. Neither style guarantees correctness, and “static is always faster” is too broad: performance depends on language, compiler, runtime, and program.

### Mastery task

Give one type error a static checker could catch before running, annotate a Python function, and explain why untrusted JSON still needs runtime validation.


---

## Worked examples and mastery practice

### Worked example: static checks versus runtime checks
Python is dynamically typed; type annotations help tools such as mypy or pyright analyze code, but Python does not generally enforce annotations at runtime.
```python
def greet(name: str) -> str:
    return "Hello, " + name

print(greet("Ari"))
```
A static checker can flag `greet(3)` before execution, but ordinary Python may only fail when `+` attempts to combine a string and integer. Type systems differ in when and how they enforce constraints. JavaScript does not support TypeScript-style `name: string` annotations in ordinary `.js` files; TypeScript adds a compile-time type-checking layer and emits JavaScript.

Static typing can catch classes of mistakes early, but it does not prove a program has no bugs. Runtime validation is still needed for untrusted input and external data.

### Mastery task
For a function receiving an API payload, identify what a static type checker can catch and what must still be checked at runtime. Compare plain Python with Python plus a static checker, and JavaScript with TypeScript.
