# les-comp-modules-scope — Lexical Scope, Closures, and Module Systems

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-data-modularity` — Algorithms, Modularity & Concurrency  
**Classification:** core  
**Prerequisites:** `les-comp-control-functions`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-modules-scope` |
| Title | Lexical Scope, Closures, and Module Systems |
| Scope | Organize code across multiple files while avoiding global pollution. |
| Estimated Time | 40 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

As programs grow, we must control which names are visible where. Lexical scope, closures, and module systems are the tools that keep large codebases understandable and free of accidental name collisions.

---

## 3. Learning Objectives

1. Explain lexical (static) scope.
2. Understand how closures capture variables.
3. Use import/export (or equivalent) to structure code across files.
4. Avoid unnecessary global variables.

---

## 4. Key Ideas

- **Lexical scope**: the visibility of a variable is determined by its location in the source code.
- **Closure**: a function that remembers the variables from the scope in which it was created.
- **Module**: a file or component that explicitly exports a public interface and keeps the rest private.

---

## 5. Exercises

1. Write a function that returns another function which increments a private counter (classic closure).
2. Split a small program into two files and import a function from one into the other.

---

## 6. Completion Criteria

- [ ] Understands scope rules
- [ ] Can create and use a simple closure
- [ ] Can organize code into modules with explicit exports

---

## 7. Related Lessons

- Previous: `les-comp-control-functions`
- Later: package management and project structure lessons


---

## Worked examples and mastery practice

### Worked example: Python module and scope
`helpers.py`:
```python
def normalize_name(name):
    return name.strip().title()

_PRIVATE_LIMIT = 100  # leading underscore is a convention, not enforcement
```
`main.py`:
```python
from helpers import normalize_name
print(normalize_name("  ada lovelace "))  # Ada Lovelace
```
Python's LEGB lookup rule searches Local, Enclosing, Global, then Built-in scopes. A closure can retain access to a variable from an enclosing function after that function returns. In JavaScript ES modules, use `export` and `import`; module-scoped declarations are not automatically global. Prefer explicit imports over polluting global namespaces.

### Mastery task
Split a small program into a validation module and a main entry point. Show one explicit Python import and one JavaScript `export`/`import` example. Explain why `_private_helper` is only a convention in Python.

---

## A two-file example

A module is a file or package that defines a boundary for names and responsibilities. Keep reusable logic in one module and import it where needed.

`helpers.py`:
```python
def normalize_name(name):
    return " ".join(name.strip().split()).title()

_internal_version = 1  # leading underscore communicates internal use by convention
```

`app.py`:
```python
from helpers import normalize_name

print(normalize_name("  mira   royal "))  # Mira Royal
```

Python resolves a name using LEGB: Local, Enclosing, Global, Built-in. A closure can retain access to a variable in an enclosing function after that outer function returns. A leading underscore does not enforce privacy; it signals that the name is an implementation detail. JavaScript ES modules make exports explicit with `export` and imports with `import`.

```javascript
// helpers.js
export function normalizeName(name) {
  return name.trim().replace(/\s+/g, " ");
}
// app.js
import { normalizeName } from "./helpers.js";
console.log(normalizeName("  Mira   Royal "));
```

### Mastery task

Split a small program into a helper module and an entry-point file. Explain which names are exported, how the caller imports them, and why avoiding unnecessary globals makes testing easier.


---

## Worked examples and mastery practice

### Worked example: Python module and scope
`helpers.py`:
```python
def normalize_name(name):
    return name.strip().title()

_PRIVATE_LIMIT = 100  # leading underscore is a convention, not enforcement
```
`main.py`:
```python
from helpers import normalize_name
print(normalize_name("  ada lovelace "))  # Ada Lovelace
```
Python's LEGB lookup rule searches Local, Enclosing, Global, then Built-in scopes. A closure can retain access to a variable from an enclosing function after that function returns. In JavaScript ES modules, use `export` and `import`; module-scoped declarations are not automatically global. Prefer explicit imports over polluting global namespaces.

### Mastery task
Split a small program into a validation module and a main entry point. Show one explicit Python import and one JavaScript `export`/`import` example. Explain why `_private_helper` is only a convention in Python.
