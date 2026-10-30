# les-comp-cli-streams-pipes — Standard Streams, Redirection, and Pipes

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-cli-basics` — Command-Line Interface Fundamentals  
**Classification:** core  
**Prerequisites:** `les-comp-cli-navigation`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-cli-streams-pipes` |
| Title | Standard Streams, Redirection, and Pipes |
| Scope | Chain small CLI programs together using pipes and redirect output. |
| Estimated Time | 40 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

Unix philosophy: write small programs that do one thing well and connect them with pipes. Mastery of standard streams and redirection is what turns the shell into a powerful data-processing environment.

---

## 3. Learning Objectives

1. Identify stdin, stdout, and stderr.
2. Redirect stdout and stderr to files.
3. Use pipes to connect commands.
4. Build simple data-processing pipelines.

---

## 4. Standard Streams

Every process starts with three streams:
- **stdin** (0) — standard input
- **stdout** (1) — standard output
- **stderr** (2) — standard error

---

## 5. Redirection Operators

| Operator | Meaning |
|----------|---------|
| `>` | Redirect stdout to file (overwrite) |
| `>>` | Append stdout to file |
| `2>` | Redirect stderr |
| `&>` | Redirect both stdout and stderr |
| `<` | Redirect file to stdin |

Examples:
```bash
ls -l > listing.txt
echo "log line" >> app.log
command 2> errors.txt
```

---

## 6. Pipes

The pipe `|` sends the stdout of one command to the stdin of the next:

```bash
ls -l | grep ".md" | wc -l
cat data.csv | head -n 20 | tail -n 5
ps aux | grep python | grep -v grep
```

---

## 7. Useful Filter Commands

- `grep` — search for patterns
- `sort` — sort lines
- `uniq` — remove consecutive duplicates
- `wc` — count lines/words/bytes
- `head` / `tail` — first/last lines
- `cut` — extract columns
- `tr` — translate characters

---

## 8. Exercises

1. List all files in `/etc` that contain the word “host” and save the result to a file.
2. Count how many processes are currently running that contain “bash” in their command line.

---

## 9. Mastery Task

Build a one-liner that shows the five largest files in the current directory tree (hint: `find` + `du` or `ls` + `sort`).

---

## 10. Completion Criteria

- [ ] Comfortably uses `>`, `>>`, and `|`
- [ ] Can construct multi-stage pipelines
- [ ] Distinguishes stdout from stderr

---

## 11. Related Lessons

- Previous: `les-comp-cli-navigation`
- Next: `les-comp-cli-processes`


---

## Worked examples and mastery practice

### Standard streams and redirection
A process normally has standard input (fd 0), standard output (fd 1), and standard error (fd 2). `>` redirects stdout to a file (overwriting it), `>>` appends, `<` reads stdin from a file, and `2>` redirects stderr. `2>&1` sends stderr to the destination currently used by stdout; ordering matters. A pipe `|` connects one command's stdout to the next command's stdin.

```sh
printf 'pear\napple\npear\n' > fruit.txt
sort fruit.txt | uniq -c > counts.txt
cat counts.txt
```
Expected output is counts for `apple` and `pear` (exact spacing varies). `tee result.txt` writes input to both stdout and a file. On Unix-like systems, `>/dev/null 2>&1` discards stdout and stderr. `&>` is supported by Bash and some related shells, but is not portable POSIX `sh` syntax. Use `grep '\.md$'` to match names ending in `.md`; an unescaped `.` matches any character.

### Mastery task
Find Markdown files under a directory, count them, and save the result to a file while keeping errors separate. State which commands are platform-specific and what each stream carries.

---

## Standard input, output, and error

Most command-line programs use three standard streams: stdin (input, file descriptor 0), stdout (normal output, descriptor 1), and stderr (diagnostics, descriptor 2). A pipe `|` sends one command's stdout to the next command's stdin. Redirection changes where a stream goes.

```sh
# Search Markdown files for TODO, sort matches, and save output
 grep -R --include='*.md' 'TODO' . 2>errors.txt | sort > todos.txt

# Read stdin from a file; append output; duplicate output to terminal and file
 sort < names.txt >> sorted-names.txt
 printf 'done\n' | tee run.log

# Discard normal output and errors in a POSIX-style shell
 command > /dev/null 2>&1
```

`>` overwrites, `>>` appends, `<` supplies stdin, and `2>` redirects stderr. `2>&1` sends stderr to wherever stdout is currently directed; order matters. `/dev/null` is a Unix-like sink. Bash and some related shells support `&>` as shorthand, but it is not portable POSIX `sh` syntax. In `grep`, an unescaped dot means “any character”; use `grep '\\.md$'` to match a literal `.md` at the end of a line.

Filters such as `grep`, `sort`, `uniq`, `wc`, `head`, and `cut` are most useful when you understand their input/output formats. For example, `sort fruits.txt | uniq -c` counts adjacent identical lines after sorting.

### Mastery task

Given a text file of fruit names, count each fruit and save the report. Redirect errors to a separate file and explain the difference between stdout and stderr.


---

## Worked examples and mastery practice

### Standard streams and redirection
A process normally has standard input (fd 0), standard output (fd 1), and standard error (fd 2). `>` redirects stdout to a file (overwriting it), `>>` appends, `<` reads stdin from a file, and `2>` redirects stderr. `2>&1` sends stderr to the destination currently used by stdout; ordering matters. A pipe `|` connects one command's stdout to the next command's stdin.

```sh
printf 'pear\napple\npear\n' > fruit.txt
sort fruit.txt | uniq -c > counts.txt
cat counts.txt
```
Expected output is counts for `apple` and `pear` (exact spacing varies). `tee result.txt` writes input to both stdout and a file. On Unix-like systems, `>/dev/null 2>&1` discards stdout and stderr. `&>` is supported by Bash and some related shells, but is not portable POSIX `sh` syntax. Use `grep '\.md$'` to match names ending in `.md`; an unescaped `.` matches any character.

### Mastery task
Find Markdown files under a directory, count them, and save the result to a file while keeping errors separate. State which commands are platform-specific and what each stream carries.
