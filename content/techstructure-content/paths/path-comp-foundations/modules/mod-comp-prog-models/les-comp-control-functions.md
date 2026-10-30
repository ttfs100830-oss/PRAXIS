# les-comp-control-functions — Control Flow, Functions, and Call Stacks

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-prog-models` — Programming Models & Data Formats  
**Classification:** core  
**Prerequisites:** `les-comp-variables-memory`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-control-functions` |
| Title | Control Flow, Functions, and Call Stacks |
| Scope | Construct conditional branches and trace execution frames. |
| Estimated Time | 45 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

Control flow determines which statements run and in what order. Functions let us package reusable logic. The call stack is the runtime mechanism that makes nested function calls work and is the key to understanding stack traces.

---

## 3. Learning Objectives

1. Use if/else and loops correctly.
2. Define and call functions with parameters and return values.
3. Trace the call stack through nested calls.
4. Read a simple stack trace.

---

## 4. Control Structures

```python
score = 82
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C or below"

for item in [1, 2, 3]:
    print(item)

remaining = 3
while remaining > 0:
    remaining -= 1
```

Expected behavior: the grade is `B`; the `for` loop prints 1, 2, and 3; the `while` loop terminates when `remaining` reaches zero. The `while` condition must eventually become false or the loop may run forever.

---

## 5. Functions and the Call Stack

Each function call pushes a new **stack frame** containing:
- Parameters
- Local variables
- Return address

When the function returns, its frame is popped.

```
main()
  └─ process_order()
       └─ calculate_total()
            └─ apply_tax()
```

A stack trace shows this chain at the moment of an error.

---

## 6. Exercises

1. Write a function that takes two numbers and returns the larger one.
2. Intentionally cause a stack overflow with infinite recursion and observe the error.

---

## 7. Completion Criteria

- [ ] Comfortable with basic conditionals and loops
- [ ] Can define and call pure functions
- [ ] Understands that a stack trace is a list of active frames

---

## 8. Related Lessons

- Next: `les-comp-type-systems`, `les-comp-oop-classes`, `les-comp-errors-exceptions`


---

## Worked examples and mastery practice

### Worked example: control flow and call frames
```python
def discount(price, rate):
    if price < 0 or not 0 <= rate <= 1:
        raise ValueError("invalid price or rate")
    return price * (1 - rate)

print(discount(100, 0.2))  # 80.0
```
A function definition creates a callable; calling it evaluates arguments and creates an execution frame containing local bindings. `return` sends a value back to the caller. A traceback shows frames for the chain of calls that led to an error. The function above checks boundaries before calculating the discounted price.

A pure function returns a result based only on its inputs and has no observable side effects. `discount(100, .2)` is pure; a function that writes a file or changes a global variable is not.

### Mastery task
Write a function that accepts a list of numbers and returns the largest non-negative number, or `None` if no such number exists. Include an empty-list case, trace at least one call, and explain the stopping/return condition.

---

## A complete function and call-stack trace

```python
def discounted_price(price, rate):
    if price < 0:
        raise ValueError("price must be non-negative")
    if not 0 <= rate <= 1:
        raise ValueError("rate must be between 0 and 1")
    return price * (1 - rate)

print(discounted_price(100, 0.2))  # 80.0
```

A function definition creates a callable object; a call evaluates arguments and creates an execution frame with local bindings. `return` ends the current call and sends a value to the caller. If `discounted_price` calls another function and that function raises an exception, the traceback records the chain of calls. A pure function's result depends only on its inputs and it has no observable side effects; printing, writing files, or changing external state makes a function impure.

When choosing between `for` and `while`, use `for` when iterating over a known sequence or iterable, and `while` when repetition depends on a condition that changes during execution. Ensure a `while` loop can eventually stop.

### Mastery task

Implement `safe_average(values)` that returns `None` for an empty list and the arithmetic mean otherwise. Add tests for empty, one-item, and multiple-item inputs. Describe the call stack if one helper function calls another.


---

## Worked examples and mastery practice

### Worked example: control flow and call frames
```python
def discount(price, rate):
    if price < 0 or not 0 <= rate <= 1:
        raise ValueError("invalid price or rate")
    return price * (1 - rate)

print(discount(100, 0.2))  # 80.0
```
A function definition creates a callable; calling it evaluates arguments and creates an execution frame containing local bindings. `return` sends a value back to the caller. A traceback shows frames for the chain of calls that led to an error. The function above checks boundaries before calculating the discounted price.

A pure function returns a result based only on its inputs and has no observable side effects. `discount(100, .2)` is pure; a function that writes a file or changes a global variable is not.

### Mastery task
Write a function that accepts a list of numbers and returns the largest non-negative number, or `None` if no such number exists. Include an empty-list case, trace at least one call, and explain the stopping/return condition.
