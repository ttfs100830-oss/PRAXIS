# les-comp-variables-memory — Variables, Primitives, and Reference Semantics

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-prog-models` — Programming Models & Data Formats  
**Classification:** core  
**Prerequisites:** `les-comp-source-to-exec`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-variables-memory` |
| Title | Variables, Primitives, and Reference Semantics |
| Scope | Trace how primitive values and object references are stored in memory. |
| Estimated Time | 45 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

Variables are names bound to values. How those values are stored and passed around determines whether changes are visible to other parts of a program. Confusion between value semantics and reference semantics is one of the most common sources of bugs for beginners.

---

## 3. Learning Objectives

1. Explain what a variable is (name → value binding).
2. Distinguish primitive values from reference values.
3. Trace assignment and function-argument passing for both kinds.
4. Predict the result of mutating an object through two variables that refer to it.

---

## 4. Core Concepts

### Primitives
Simple values stored directly: numbers, booleans, characters (language-dependent).  
Assignment copies the value.

### References / Pointers
Variables hold an address (or reference) to data living on the heap.  
Assignment copies the reference, not the data.

### Example (Python / JavaScript style)

```python
a = 10
b = a          # b is bound to the same immutable integer object/value
b = 20         # a is still 10

x = [1, 2, 3]
y = x          # y points to the same list
y.append(4)    # x is now [1, 2, 3, 4]
```

---

## 5. Stack vs Heap (simplified)

- Local primitive variables and references usually live on the stack.
- The objects/arrays they refer to live on the heap.
- When a function returns, its stack frame is discarded; heap objects live until no longer referenced.

---

## 6. Common Mistakes

- Assuming `y = x` always makes an independent copy.
- Mutating a shared object and being surprised that another variable sees the change.
- Confusing value equality (`==` in Python) with identity (`is` in Python); JavaScript `===` means strict equality, not a universal identity operator.

---

## 7. Exercises

1. Draw the memory state after the list example above.
2. Write a small function that receives a list and appends an element. Call it and show that the caller’s list changed.

---

## 8. Completion Criteria

- [ ] Can explain value vs reference semantics
- [ ] Can predict the effect of assignment and mutation
- [ ] Understands that multiple variables can refer to the same object

---

## 9. Related Lessons

- Previous: `les-comp-source-to-exec`
- Next: `les-comp-data-formats`, `les-comp-control-functions`


---

## Worked examples and mastery practice

### Worked example: names and object references in Python
```python
a = [10]
b = a
b.append(20)
print(a)       # [10, 20]
print(a is b)  # True
```
Assignment binds a name to an object; it does not universally copy the object. Because lists are mutable, modifying the shared list through `b` is visible through `a`. By contrast, rebinding `b = [99]` makes `b` refer to a different list. With immutable integers, `b = a` does not create a mutable shared integer; rebinding `b` does not change `a`.

Python is commonly described as using object references and call-by-object-sharing. Do not explain Python variables with a simplistic “all primitives are on the stack” model. Python's implementation manages objects and memory; exact layout is an implementation detail. In JavaScript, `===` means strict equality, not a universal “identity operator”; object comparisons with `===` compare whether both operands refer to the same object.

### Mastery task
Predict the output of a program that assigns one list to two names, mutates through one name, and then rebinds one name. Explain aliasing and give one way to make a shallow copy (`b = a.copy()`) while noting that nested objects can still be shared.

---

## Assignment, aliasing, and argument passing in Python

Python names bind to objects. Assignment such as `b = a` binds another name to the same object; it does not automatically clone that object. For immutable integers, rebinding one name does not mutate the integer or change the other name's binding. For mutable lists, both names can refer to the same list, so mutation through one name is visible through the other.

```python
a = 10
b = a
b = 20
print(a, b)  # 10 20

x = [1, 2]
y = x
y.append(3)
print(x, y, x is y)  # [1, 2, 3] [1, 2, 3] True

y = x.copy()
y.append(4)
print(x, y)  # [1, 2, 3] [1, 2, 3, 4]
```

The final example makes a **shallow copy**: the outer list is new, but nested mutable objects are still shared. Python is often described as using call-by-object-sharing: a function receives bindings to the same objects passed by the caller. Mutating a passed list can be observed by the caller; rebinding the local parameter does not rebind the caller's name.

Avoid oversimplifying stack and heap diagrams. Many language implementations use stack frames and heap allocation, but exact storage is implementation-specific. In JavaScript, `===` means strict equality; for objects it compares reference identity, while for primitive values it compares values under strict-equality rules. It is not a general deep-equality operator.

### Mastery task

Predict the output when a list is assigned to two names, mutated through one name, then one name is rebound to a copy. Explain aliasing, shallow copying, and the difference between Python `is` and JavaScript `===`.


---

## Worked examples and mastery practice

### Worked example: names and object references in Python
```python
a = [10]
b = a
b.append(20)
print(a)       # [10, 20]
print(a is b)  # True
```
Assignment binds a name to an object; it does not universally copy the object. Because lists are mutable, modifying the shared list through `b` is visible through `a`. By contrast, rebinding `b = [99]` makes `b` refer to a different list. With immutable integers, `b = a` does not create a mutable shared integer; rebinding `b` does not change `a`.

Python is commonly described as using object references and call-by-object-sharing. Do not explain Python variables with a simplistic “all primitives are on the stack” model. Python's implementation manages objects and memory; exact layout is an implementation detail. In JavaScript, `===` means strict equality, not a universal “identity operator”; object comparisons with `===` compare whether both operands refer to the same object.

### Mastery task
Predict the output of a program that assigns one list to two names, mutates through one name, and then rebinds one name. Explain aliasing and give one way to make a shallow copy (`b = a.copy()`) while noting that nested objects can still be shared.
