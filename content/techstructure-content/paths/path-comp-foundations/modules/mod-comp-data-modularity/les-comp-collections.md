# les-comp-collections — Arrays, Hash Maps, and Sets

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-data-modularity` — Algorithms, Modularity & Concurrency  
**Classification:** core  
**Prerequisites:** `les-comp-algo-thinking`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-collections` |
| Title | Arrays, Hash Maps, and Sets |
| Scope | Select and manipulate appropriate in-memory data structures. |
| Estimated Time | 45 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

Choosing the right data structure is often the difference between an efficient program and an unusable one. This lesson covers the three workhorse collections.

---

## 3. Learning Objectives

1. Use dynamic arrays/lists for ordered sequences.
2. Use hash maps/dictionaries for key-value lookup.
3. Use sets for uniqueness and fast membership tests.
4. Select the appropriate structure for a given problem.

---

## 4. Characteristics

| Structure | Ordered | Fast lookup by key | Uniqueness |
|-----------|---------|--------------------|------------|
| Array / List | Yes | No (unless indexed) | No |
| Hash Map / Dict | No* | Yes | Keys unique |
| Set | No | Yes (membership) | Yes |

\* insertion-ordered in many modern languages

---

## 5. Exercises

1. Count word frequencies in a sentence using a hash map.
2. Remove duplicates from a list while preserving order (hint: set + list).

---

## 6. Completion Criteria

- [ ] Comfortable creating and using all three structures
- [ ] Can justify the choice of structure for simple problems

---

## 7. Related Lessons

- Previous: `les-comp-algo-thinking`
- Later: database indexing concepts build on these ideas


---

## Worked examples and mastery practice

### Worked example: choose the right collection
```python
words = ["red", "blue", "red"]      # ordered sequence; duplicates allowed
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
unique = set(words)
print(counts)  # {'red': 2, 'blue': 1}
print(sorted(unique))  # ['blue', 'red']
```
Lists preserve order and allow duplicates; dictionaries map hashable keys to values; sets store unique hashable elements. Hash collisions can occur when different keys produce the same hash; Python's dictionary/set implementation resolves collisions while checking equality. Do not rely on set iteration order. Lists are mutable and therefore cannot be dictionary keys; tuples can be keys only if all their elements are hashable.

When removing duplicates while preserving first-seen order, `list(dict.fromkeys(items))` is a common Python approach. Avoid removing elements from a list while iterating over that same list because indexes shift and items can be skipped.

### Mastery task
Given a list of event names, produce (1) a frequency dictionary, (2) a list of unique names in first-seen order, and (3) a set for membership tests. Explain why each representation is appropriate.

---

## Additional detail: hashing, mutation, and order

A hash map uses a hash function to help locate a key. Different keys can produce the same hash value; this is a **collision**, and a correct implementation resolves collisions while still checking key equality. Average dictionary lookup is commonly O(1), but this is an average-case description, not a guarantee that every operation takes exactly the same time. Python dictionary keys must be hashable; lists and dictionaries are mutable and therefore cannot be dictionary keys. Tuples are hashable only when all their elements are hashable.

```python
counts = {}
for word in ["red", "blue", "red"]:
    counts[word] = counts.get(word, 0) + 1

unique_in_order = list(dict.fromkeys(["red", "blue", "red"]))
print(counts)           # {'red': 2, 'blue': 1}
print(unique_in_order)  # ['red', 'blue']
```

Python dictionaries preserve insertion order in modern Python. Sets represent membership/uniqueness and should not be used when output order matters. Never mutate a list by removing elements from it while iterating forward over that same list: indices shift and some elements may be skipped. Build a new list instead, for example `[x for x in values if x != target]`.

### Mastery task

Write `word_frequencies(text)` that normalizes case and counts words, then write `deduplicate(items)` that preserves first-seen order. Test repeated words, mixed case, an empty string, and duplicate values. Explain why a set alone is not sufficient for preserving order.


---

## Worked examples and mastery practice

### Worked example: choose the right collection
```python
words = ["red", "blue", "red"]      # ordered sequence; duplicates allowed
counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1
unique = set(words)
print(counts)  # {'red': 2, 'blue': 1}
print(sorted(unique))  # ['blue', 'red']
```
Lists preserve order and allow duplicates; dictionaries map hashable keys to values; sets store unique hashable elements. Hash collisions can occur when different keys produce the same hash; Python's dictionary/set implementation resolves collisions while checking equality. Do not rely on set iteration order. Lists are mutable and therefore cannot be dictionary keys; tuples can be keys only if all their elements are hashable.

When removing duplicates while preserving first-seen order, `list(dict.fromkeys(items))` is a common Python approach. Avoid removing elements from a list while iterating over that same list because indexes shift and items can be skipped.

### Mastery task
Given a list of event names, produce (1) a frequency dictionary, (2) a list of unique names in first-seen order, and (3) a set for membership tests. Explain why each representation is appropriate.
