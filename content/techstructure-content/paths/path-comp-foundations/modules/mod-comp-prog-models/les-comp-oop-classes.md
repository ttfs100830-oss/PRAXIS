# les-comp-oop-classes — Object-Oriented Programming: Classes and Instances

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-prog-models` — Programming Models & Data Formats  
**Classification:** core  
**Prerequisites:** `les-comp-control-functions`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-oop-classes` |
| Title | Object-Oriented Programming: Classes and Instances |
| Scope | Design basic classes with state and behavior encapsulation. |
| Estimated Time | 45 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

Object-oriented programming organizes code around data (state) and the operations that belong with that data (behavior). Classes define the shape; instances are the concrete objects.

---

## 3. Learning Objectives

1. Define a simple class with attributes and methods.
2. Create instances and call methods.
3. Explain encapsulation at a basic level.
4. Understand the difference between class and instance.

---

## 4. Core Ideas

```python
class Counter:
    def __init__(self, start=0):
        self.value = start

    def increment(self):
        self.value += 1

    def current(self):
        return self.value

c1 = Counter()
c2 = Counter(10)
c1.increment()
print(c1.current())  # 1
print(c2.current())  # 10
```

- `__init__` initializes new instances
- `self` refers to the current instance
- Each instance has its own independent state

---

## 5. Why Encapsulation Matters

Grouping data with the functions that operate on it reduces the chance that external code will put the data into an invalid state.

---

## 6. Exercises

1. Write a `BankAccount` class with `deposit`, `withdraw`, and `balance` methods. Prevent negative balances.
2. Create two accounts and show that their balances are independent.

---

## 7. Completion Criteria

- [ ] Can define a class and create instances
- [ ] Understands that each instance has its own state
- [ ] Can explain basic encapsulation

---

## 8. Related Lessons

- Previous: `les-comp-control-functions`
- Later: design patterns and architecture lessons


---

## Worked examples and mastery practice

### Worked example: encapsulating an account
```python
class BankAccount:
    def __init__(self, owner, opening_balance=0):
        if opening_balance < 0:
            raise ValueError("opening balance cannot be negative")
        self.owner = owner
        self._balance = opening_balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self._balance += amount

    @property
    def balance(self):
        return self._balance

account = BankAccount("Ari", 25)
account.deposit(5)
print(account.balance)  # 30
```
Python's leading underscore communicates “internal use by convention”; it does not enforce true private access. A class groups state and behavior, and methods can protect invariants such as a non-negative balance. Raising exceptions is covered more deeply in the error-handling lesson.

### Mastery task
Design a `ShoppingCart` class with `add_item`, `remove_item`, and `total` behavior. State its invariants, prevent invalid quantities, and explain which attributes should be treated as internal.

---

## Encapsulation through invariants

Encapsulation means keeping an object's state and the operations that maintain its rules together. In Python, a leading underscore is a convention for internal attributes rather than enforced privacy. A property can provide a controlled public interface.

```python
class BankAccount:
    def __init__(self, opening_balance=0):
        if opening_balance < 0:
            raise ValueError("opening balance cannot be negative")
        self._balance = opening_balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self._balance += amount

    def withdraw(self, amount):
        if amount <= 0 or amount > self._balance:
            raise ValueError("invalid withdrawal")
        self._balance -= amount

account = BankAccount(25)
account.deposit(5)
print(account.balance)  # 30
```

The account enforces an invariant: its balance cannot become negative through the public methods. Raising `ValueError` is appropriate when a caller supplies an invalid value; the next lesson on exceptions explains how to handle it. Each instance has its own state, while class attributes are shared through the class unless shadowed on an instance.

### Mastery task

Implement a `ShoppingCart` that tracks item quantities and prices, rejects non-positive quantities and negative prices, and calculates a total. State the invariants and show two independent cart instances.


---

## Worked examples and mastery practice

### Worked example: encapsulating an account
```python
class BankAccount:
    def __init__(self, owner, opening_balance=0):
        if opening_balance < 0:
            raise ValueError("opening balance cannot be negative")
        self.owner = owner
        self._balance = opening_balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self._balance += amount

    @property
    def balance(self):
        return self._balance

account = BankAccount("Ari", 25)
account.deposit(5)
print(account.balance)  # 30
```
Python's leading underscore communicates “internal use by convention”; it does not enforce true private access. A class groups state and behavior, and methods can protect invariants such as a non-negative balance. Raising exceptions is covered more deeply in the error-handling lesson.

### Mastery task
Design a `ShoppingCart` class with `add_item`, `remove_item`, and `total` behavior. State its invariants, prevent invalid quantities, and explain which attributes should be treated as internal.
