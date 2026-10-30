# les-comp-algo-thinking — Algorithmic Thinking and Basic Flow Control

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-data-modularity` — Algorithms, Modularity & Concurrency  
**Classification:** core  
**Prerequisites:** `les-comp-control-functions`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-algo-thinking` |
| Title | Algorithmic Thinking and Basic Flow Control |
| Scope | Implement basic algorithmic logic and iteration. |
| Estimated Time | 40 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

Algorithmic thinking is the ability to break a problem into clear, ordered steps that a computer can execute. This lesson practices turning informal descriptions into correct loops and conditionals.

---

## 3. Learning Objectives

1. Translate a problem statement into step-by-step logic.
2. Implement common patterns: counting, searching, accumulating.
3. Choose between `for` and `while` appropriately.
4. Verify correctness with simple test cases.

---

## 4. Common Patterns

- Linear search
- Counting occurrences
- Accumulating a sum or product
- Filtering items that satisfy a condition
- Early exit when a sentinel value is found

---

## 5. Exercises

1. Write a function that returns the sum of all even numbers in a list.
2. Write a function that returns `True` if a list contains a given target value.

---

## 6. Completion Criteria

- [ ] Can implement basic search and accumulation algorithms
- [ ] Writes clear loop-based solutions
- [ ] Tests edge cases (empty list, single element)

---

## 7. Related Lessons

- Next: `les-comp-collections`


---

## Worked examples and mastery practice

### Worked example: turn a requirement into steps
Requirement: “Return whether a list contains a target.” First clarify inputs and output, then choose an algorithm. Linear search checks items from left to right until a match is found or the list ends.
```python
def contains(items, target):
    for item in items:
        if item == target:
            return True
    return False

print(contains([4, 7, 9], 7))  # True
print(contains([4, 7, 9], 2))  # False
```
For a list of `n` items, worst-case comparisons are `n`, so time complexity is O(n); extra space is O(1). A useful habit is to state the invariant (“everything before the current item has already been checked”) and test empty, one-item, match-first, match-last, and no-match cases.

### Mastery task
Write plain-language steps and Python code to count values above a threshold. Test an empty list and a list with negative, equal-to-threshold, and greater-than-threshold values. State time and extra-space complexity.

---

## Additional worked practice: count, accumulate, and test boundaries

A reliable algorithm starts by stating its input, output, and edge cases. For the sum of even values, the accumulator begins at zero because zero is the identity for addition. Each value is checked independently, and only even values contribute.

```python
def sum_even(values):
    total = 0
    for value in values:
        if value % 2 == 0:
            total += value
    return total

print(sum_even([3, 4, 8, 9]))  # 12
print(sum_even([]))            # 0
```

The loop visits each element once, so the running time is O(n); it uses O(1) extra space. For search, returning immediately on a match is an early exit. If no match exists, the loop finishes and returns `False`. Be careful not to return `False` inside the loop after checking only the first nonmatching item.

### Test table

| Input | Expected result | Reason |
|---|---:|---|
| `[2, 4, 6]` | `12` | all values are even |
| `[1, 3]` | `0` | no even values |
| `[]` | `0` | no elements to add |
| contains target at first position | `True` | early exit after one comparison |
| target absent | `False` | every element is checked |

### Mastery task

Implement `count_above(values, threshold)` and `contains(values, target)`. Test an empty list, a single-item list, a match at the end, and a missing target. Explain the worst-case number of comparisons for a list of length n.


---

## Worked examples and mastery practice

### Worked example: turn a requirement into steps
Requirement: “Return whether a list contains a target.” First clarify inputs and output, then choose an algorithm. Linear search checks items from left to right until a match is found or the list ends.
```python
def contains(items, target):
    for item in items:
        if item == target:
            return True
    return False

print(contains([4, 7, 9], 7))  # True
print(contains([4, 7, 9], 2))  # False
```
For a list of `n` items, worst-case comparisons are `n`, so time complexity is O(n); extra space is O(1). A useful habit is to state the invariant (“everything before the current item has already been checked”) and test empty, one-item, match-first, match-last, and no-match cases.

### Mastery task
Write plain-language steps and Python code to count values above a threshold. Test an empty list and a list with negative, equal-to-threshold, and greater-than-threshold values. State time and extra-space complexity.
