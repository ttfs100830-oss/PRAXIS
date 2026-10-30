# les-comp-data-encoding — Binary, Character Encoding, and Time

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-hardware-os` — Hardware, OS & Execution Mechanics  
**Classification:** core  
**Prerequisites:** `les-comp-cpu-memory`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-data-encoding` |
| Title | Binary, Character Encoding, and Time |
| Scope | Represent integers, floating-point numbers, UTF-8 text, and UTC timestamps. |
| Estimated Time | 40–50 minutes |
| Difficulty | Beginner |

---

## 2. Introduction — Why This Matters

Computers only understand bits (0 and 1). Everything you see — numbers, text, timestamps, images — is an encoding of bits. When encoding is misunderstood, you get classic bugs:

- `0.1 + 0.2 !== 0.3`
- “mojibake” (garbled text: `Ã©` instead of `é`)
- Off-by-one-day timestamp errors
- Integer overflow

This lesson gives you the precise mental models needed to avoid these traps for the rest of your career.

---

## 3. Learning Objectives

1. Convert small integers between binary, decimal, and hexadecimal.
2. Explain why floating-point arithmetic is approximate.
3. Understand UTF-8 and why it is the modern standard for text.
4. Correctly work with UTC and ISO-8601 timestamps.
5. Recognize common encoding-related bugs and their root causes.

---

## 4. Terminology

| Term | Definition |
|------|------------|
| **Bit** | A single binary digit: 0 or 1 |
| **Byte** | 8 bits |
| **Integer** | Whole number (positive, negative, or zero) |
| **Floating-point** | Number that can have a fractional part (IEEE 754) |
| **Character Encoding** | Mapping between characters and byte sequences |
| **UTF-8** | Variable-width Unicode encoding; the web standard |
| **UTC** | Coordinated Universal Time — the global time standard |
| **ISO-8601** | Standard string format for dates and times (`2026-10-29T14:30:00Z`) |

---

## 5. Integers and Binary

Every integer is stored as a sequence of bits.  
Example (8-bit unsigned):

```
Decimal 13 → Binary 00001101
```

Two’s complement is used for signed integers so that the same addition hardware works for negative numbers.

**Common sizes:**
- 8-bit → −128 … 127 (signed) or 0 … 255 (unsigned)
- 32-bit → roughly ±2 billion
- Fixed-width 64-bit integer → a large but finite range; language semantics differ (for example, Python integers can grow beyond 64 bits, while JavaScript Number cannot exactly represent every large integer).

**Overflow** occurs when a result does not fit in the allocated bits. This is a frequent source of security bugs and silent data corruption.

---

## 6. Floating-Point Numbers (IEEE 754)

Floating-point numbers are stored in scientific-notation form:

```
sign × mantissa × 2^exponent
```

Because the mantissa has limited precision, many fractions cannot be represented exactly.

Classic demonstration (Python / JavaScript):

```python
print(0.1 + 0.2)          # 0.30000000000000004
print(0.1 + 0.2 == 0.3)   # False
```

**Practical rules:**
- Never use binary floating-point for money.
- Use decimal types (`Decimal` in Python, `BigDecimal` in Java, etc.) for financial calculations.
- Be aware of accumulated rounding error in scientific computing.

---

## 7. Text Encoding — From ASCII to UTF-8

### ASCII (historical)
- 7 bits, 128 characters
- Only English letters, digits, and basic punctuation

### Unicode
- Assigns a unique number (code point) to every character in every language
- Example: `U+00E9` is `é`

### UTF-8
- The dominant encoding on the web and in modern systems
- Variable width: 1–4 bytes per character
- ASCII characters still occupy one byte (backward compatible)
- Can represent every Unicode character

**Why you see mojibake:**
A file saved as UTF-8 is later interpreted as Latin-1 (or vice-versa). The bytes are the same; the interpretation is wrong.

---

## 8. Time and Timestamps

**UTC** is the global reference. Local times are offsets from UTC.

**ISO-8601** is the unambiguous string format:

```
2026-10-29T14:30:00Z          # Z means UTC
2026-10-29T10:30:00-04:00     # New York local time on this date (EDT)
```

**Best practices:**
- Store timestamps in UTC.
- Convert to local time only at the presentation layer.
- Prefer libraries that handle time zones correctly (`zoneinfo` in Python 3.9+, `date-fns-tz`, etc.).
- Avoid the old `YYYY-MM-DD HH:MM:SS` format without zone information.

---

## 9. Common Mistakes & Debugging Guidance

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| `0.1 + 0.2 !== 0.3` | Binary floating-point | Use decimal arithmetic for money |
| Text appears as `Ã©` or `` | Encoding mismatch | Ensure every layer (file, DB, HTTP, terminal) agrees on UTF-8 |
| Date is one day off | Time-zone or DST handling error | Store UTC; convert only for display |
| Integer becomes negative after addition | Overflow | Use larger integer type or check bounds |

---

## 10. Exercises

**Exercise 1**  
Convert the decimal number 42 to binary and hexadecimal.

**Exercise 2**  
In a Python or JavaScript REPL, evaluate `0.1 + 0.2`. Explain the result.

**Exercise 3**  
Write an ISO-8601 UTC timestamp for “now” and for “three hours ago”.

---

## 11. Practical Mastery Task

Create a small program (any language) that:
1. Prints the binary representation of the integer 255.
2. Demonstrates the floating-point surprise with 0.1 + 0.2.
3. Outputs the current time in ISO-8601 UTC format.

---

## 12. Completion Criteria

- [ ] Can convert small integers between binary / decimal / hex
- [ ] Can explain why floating-point is approximate
- [ ] Knows that UTF-8 is the correct default for text
- [ ] Stores timestamps in UTC and uses ISO-8601

---

## 13. Summary

Bits are the only thing computers understand. Integers, floats, text, and time are all encodings of bits. Mastering these encodings prevents an entire class of subtle, expensive bugs.

---

## 14. Related Lessons

- Previous: `les-comp-cpu-memory`
- Next: `les-comp-os-kernel`
- Later: `les-comp-data-formats` (JSON, YAML, CSV serialization)


---

## Worked examples and mastery practice

### Worked examples
**Binary and hexadecimal.** Decimal 42 is binary `101010` and hexadecimal `0x2A`. Hex is a compact notation: each hex digit represents four bits (`A` is decimal 10). To convert `0x2A`, compute `2 × 16 + 10 = 42`.

**UTF-8.** The text `A` is Unicode code point U+0041 and encodes as one UTF-8 byte `41` in hex. A character such as `é` may use more than one byte in UTF-8; character count and byte count are not always equal.

**Time.** Store an instant as UTC, for example `2026-10-29T14:30:00Z`. In New York on this date, the corresponding local time is `2026-10-29T10:30:00-04:00` (EDT). A numeric offset is not a substitute for a named time zone when future or historical daylight-saving rules matter.

**Number semantics.** Python `int` can represent arbitrarily large integers subject to available memory. JavaScript `Number` is IEEE-754 binary64, so integers are exactly represented only through `2^53 - 1`; JavaScript `BigInt` supports larger integer values.

---

## Binary, hexadecimal, and character bytes

Hexadecimal (base 16) is compact because one hex digit represents exactly four binary bits. Decimal 42 is binary `101010` and hexadecimal `0x2A`: `2 × 16 + 10 = 42`. In Python, `bin(42)` returns `'0b101010'` and `hex(42)` returns `'0x2a'`.

```python
print(bin(42))          # 0b101010
print(hex(42))          # 0x2a
print("é".encode("utf-8"))  # b'\\xc3\\xa9' in common Python displays
```

Unicode assigns code points to text; UTF-8 encodes code points into one to four bytes. A user-perceived character can contain multiple code points, so character count, code-point count, and byte count are different measures. Do not assume one byte per character.

Integer representation also depends on the language and type. A signed 32-bit integer has a finite range, while Python's built-in integers can grow to arbitrary precision subject to available memory. JavaScript's ordinary `Number` uses IEEE 754 double precision; exact integer representation is guaranteed only up to `2**53 - 1`. Therefore, “64-bit” is not a universal statement about ordinary integer semantics across languages.

## UTC and offsets

`2026-10-29T14:30:00Z` represents an instant in UTC. On that date, New York observes daylight time (UTC−04:00), so the corresponding local time is `2026-10-29T10:30:00-04:00`. A fixed offset describes the offset at that instant; a named zone such as `America/New_York` is needed to apply historical and future daylight-saving rules correctly.

### Mastery task

Convert decimal 42 to binary and hex; explain why `é` may occupy more than one UTF-8 byte; and convert a UTC timestamp to a local timestamp using a supplied offset. Show your calculations.


---

## Worked examples and mastery practice

### Worked examples
**Binary and hexadecimal.** Decimal 42 is binary `101010` and hexadecimal `0x2A`. Hex is a compact notation: each hex digit represents four bits (`A` is decimal 10). To convert `0x2A`, compute `2 × 16 + 10 = 42`.

**UTF-8.** The text `A` is Unicode code point U+0041 and encodes as one UTF-8 byte `41` in hex. A character such as `é` may use more than one byte in UTF-8; character count and byte count are not always equal.

**Time.** Store an instant as UTC, for example `2026-10-29T14:30:00Z`. In New York on this date, the corresponding local time is `2026-10-29T10:30:00-04:00` (EDT). A numeric offset is not a substitute for a named time zone when future or historical daylight-saving rules matter.

**Number semantics.** Python `int` can represent arbitrarily large integers subject to available memory. JavaScript `Number` is IEEE-754 binary64, so integers are exactly represented only through `2^53 - 1`; JavaScript `BigInt` supports larger integer values.
