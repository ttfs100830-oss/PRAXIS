# les-comp-data-formats — Data Serialization: JSON, YAML, and CSV

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-prog-models` — Programming Models & Data Formats  
**Classification:** core  
**Prerequisites:** `les-comp-variables-memory`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-data-formats` |
| Title | Data Serialization: JSON, YAML, and CSV |
| Scope | Read, write, and validate standard data interchange formats. |
| Estimated Time | 40 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

Programs constantly exchange structured data. JSON, YAML, and CSV are the three most common text-based formats. Knowing their strengths, limitations, and correct usage prevents entire classes of integration bugs.

---

## 3. Learning Objectives

1. Parse and generate JSON.
2. Read simple YAML configuration.
3. Work with CSV data.
4. Choose the appropriate format for a given use case.
5. Recognize common validation and encoding pitfalls.

---

## 4. JSON (JavaScript Object Notation)

- Language-independent data format
- Supports objects, arrays, strings, numbers, booleans, null
- No comments, no trailing commas in strict mode
- Ubiquitous in web APIs

```json
{
  "name": "Ada",
  "languages": ["Python", "Go"],
  "active": true
}
```

---

## 5. YAML

- Designed for human-readable configuration
- Significant indentation
- Supports comments
- Can represent the same data structures as JSON (and more)

```yaml
name: Ada
languages:
  - Python
  - Go
active: true
```

---

## 6. CSV

- Tabular data
- Simple, widely supported
- No standard for escaping or types
- Best for flat, rectangular data

```csv
name,language,year
Ada,Python,2024
```

---

## 7. When to Use Which

| Format | Best for |
|--------|----------|
| JSON | APIs, data interchange, most web services |
| YAML | Configuration files, CI pipelines, Kubernetes manifests |
| CSV | Spreadsheets, data science import/export, simple tables |

---

## 8. Exercises

1. Convert the JSON example above into valid YAML.
2. Write a small program that reads a JSON file and prints one field.

---

## 9. Completion Criteria

- [ ] Can read and write basic JSON
- [ ] Understands YAML indentation rules
- [ ] Knows when CSV is appropriate vs problematic

---

## 10. Related Lessons

- Previous: `les-comp-variables-memory`
- Later: API and configuration lessons that consume these formats


---

## Worked examples and mastery practice

### Worked example: parse and validate JSON
```python
import json

raw = '{"name": "Mira", "active": true, "score": 7}'
data = json.loads(raw)
if not isinstance(data.get("name"), str):
    raise ValueError("name must be a string")
if not isinstance(data.get("score"), int):
    raise ValueError("score must be an integer")
print(data["name"], data["score"])
```
Expected output: `Mira 7`. JSON syntax parsing proves only that the input follows JSON grammar; schema/business validation is a separate step. When reading a file, use `with open("config.json", encoding="utf-8") as f:` and `json.load(f)` so the file is closed even if an exception occurs.

CSV has quoting and escaping rules: a field containing a comma may be quoted, so splitting each line on commas is not a safe general CSV parser. YAML has its own scalar rules and parsers; use safe-loading APIs for untrusted YAML (for PyYAML, `yaml.safe_load`) and validate the resulting structure.

### Mastery task
Read a JSON configuration file, catch invalid JSON, then validate that `port` is an integer in the range 1–65535. Explain why valid JSON can still be invalid application configuration.

---

## Parsing is not the same as validation

Parsing checks whether data follows a format's syntax. Validation checks whether the parsed value satisfies your application's rules. Valid JSON such as `{"port": -5}` parses successfully, but a server port should normally be an integer from 1 through 65535.

```python
import json

raw = '{"name": "Mira", "score": 7}'
data = json.loads(raw)
if not isinstance(data.get("score"), int) or isinstance(data.get("score"), bool):
    raise ValueError("score must be an integer")
print(data["name"], data["score"])  # Mira 7
```

For files, prefer `with open("config.json", encoding="utf-8") as f: data = json.load(f)`. Catch `json.JSONDecodeError` for invalid JSON and `FileNotFoundError` for missing files when you have a meaningful recovery policy. CSV has quoting and escaping rules; use the language's CSV library rather than splitting each line on commas, because a quoted field can contain a comma or newline. YAML has its own syntax and parser behaviors; when processing untrusted YAML, use a safe loader and validate the resulting structure.

### Mastery task

Read a JSON file, handle missing and malformed files distinctly, and validate that `port` is an integer (not a Boolean) between 1 and 65535. Explain why successful parsing alone is insufficient.


---

## Worked examples and mastery practice

### Worked example: parse and validate JSON
```python
import json

raw = '{"name": "Mira", "active": true, "score": 7}'
data = json.loads(raw)
if not isinstance(data.get("name"), str):
    raise ValueError("name must be a string")
if not isinstance(data.get("score"), int):
    raise ValueError("score must be an integer")
print(data["name"], data["score"])
```
Expected output: `Mira 7`. JSON syntax parsing proves only that the input follows JSON grammar; schema/business validation is a separate step. When reading a file, use `with open("config.json", encoding="utf-8") as f:` and `json.load(f)` so the file is closed even if an exception occurs.

CSV has quoting and escaping rules: a field containing a comma may be quoted, so splitting each line on commas is not a safe general CSV parser. YAML has its own scalar rules and parsers; use safe-loading APIs for untrusted YAML (for PyYAML, `yaml.safe_load`) and validate the resulting structure.

### Mastery task
Read a JSON configuration file, catch invalid JSON, then validate that `port` is an integer in the range 1–65535. Explain why valid JSON can still be invalid application configuration.
