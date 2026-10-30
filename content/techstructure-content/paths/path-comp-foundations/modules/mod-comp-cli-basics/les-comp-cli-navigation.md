# les-comp-cli-navigation — Terminal Navigation

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-cli-basics` — Command-Line Interface Fundamentals  
**Classification:** core  
**Prerequisites:** `les-comp-filesystems-perms`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-cli-navigation` |
| Title | Terminal Navigation |
| Scope | Execute core shell commands to inspect directories and move files. |
| Estimated Time | 35 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

The terminal is the primary interface for controlling a computer precisely. Almost every development, debugging, and deployment task eventually requires comfortable navigation of the file system from the command line.

---

## 3. Learning Objectives

1. Open a terminal and identify the current working directory.
2. List directory contents with useful options.
3. Move, copy, rename, and delete files and directories safely.
4. Use tab completion and history to work efficiently.

---

## 4. Core Commands

| Command | Purpose |
|---------|---------|
| `pwd` | Print working directory |
| `ls` | List directory contents |
| `ls -la` | Long listing including hidden files |
| `cd <path>` | Change directory |
| `cd ..` | Go up one level |
| `cd ~` or `cd` | Go to home directory |
| `mkdir <name>` | Create directory |
| `touch <file>` | Create empty file or update timestamp |
| `cp <src> <dst>` | Copy |
| `mv <src> <dst>` | Move / rename |
| `rm <file>` | Delete file |
| `rm -r <dir>` | Delete directory recursively |

---

## 5. Practical Workflow Example

```bash
pwd
ls -la
mkdir projects
cd projects
mkdir demo && cd demo
touch README.md
ls -l
cd ..
mv demo my-demo
ls
```

---

## 6. Safety Notes

- `rm` does not move files to a trash can by default; deletion is permanent.
- Prefer `rm -i` while learning.
- Double-check paths before using `rm -rf`.

---

## 7. Exercises

1. Create a directory structure `~/learning/cli/day1` and place an empty file `notes.txt` inside it.
2. From your home directory, navigate into that folder using a single `cd` command with a relative path, then return home.

---

## 8. Mastery Task

Without using a graphical file manager, create the following structure and then remove it cleanly:

```
~/tmp/batch1/
  ├── src/
  │   └── main.txt
  └── docs/
      └── readme.txt
```

---

## 9. Completion Criteria

- [ ] Can confidently move around the file system with `cd`, `ls`, `pwd`
- [ ] Can create, copy, move, and delete files/directories
- [ ] Understands the danger of recursive delete

---

## 10. Related Lessons

- Previous: `les-comp-filesystems-perms`
- Next: `les-comp-cli-streams-pipes`


---

## Worked examples and mastery practice

### Practical walkthrough
```sh
pwd
ls -la
mkdir -p practice/reports
printf 'status,ok\n' > practice/reports/status.csv
cp practice/reports/status.csv practice/status-copy.csv
find practice -maxdepth 3 -type f
```
Expected result: a `practice` directory containing `reports/status.csv` and `status-copy.csv`. `mkdir -p` creates missing parent directories; `cp` copies a file; `find` lists matching paths. Use `Tab` for shell completion and the Up arrow/history command to recall earlier commands. `&&` runs the next command only if the previous command exits successfully.

### Mastery task
Create a nested directory, create a text file, copy it, rename the copy, and list the result. Explain the difference between an absolute path (starting from the filesystem root) and a relative path (resolved from the current directory).

---

## Navigation workflow and safe file operations

The shell maintains a current working directory. `pwd` prints it, `cd` changes it, `.` means the current directory, and `..` means its parent. An absolute path begins at the root (or drive root on Windows); a relative path is interpreted from the current working directory. `~` commonly expands to a user's home directory in Unix-like shells.

```sh
mkdir -p practice/reports
printf 'ready\n' > practice/reports/status.csv
cp practice/reports/status.csv practice/status-copy.csv
find practice -type f
```

Expected paths include `practice/reports/status.csv` and `practice/status-copy.csv`. `mkdir -p` creates missing parent directories and does not complain if the target directory already exists. `>` redirects output and overwrites the destination; take care not to overwrite valuable files. `cp` copies; `mv` moves or renames. `find` searches a directory tree.

Use Tab completion to complete paths and command names, and the Up arrow to recall earlier commands. History commands differ among shells, but `history` is common in Bash and similar shells. `&&` runs the command to its right only when the command on its left exits successfully, which is useful for sequences that depend on previous steps.

### Mastery task

Create a nested directory, write a small status file, copy it, and list both files. Explain how relative paths are resolved and why `&&` is safer than separating dependent commands with a semicolon.


---

## Worked examples and mastery practice

### Practical walkthrough
```sh
pwd
ls -la
mkdir -p practice/reports
printf 'status,ok\n' > practice/reports/status.csv
cp practice/reports/status.csv practice/status-copy.csv
find practice -maxdepth 3 -type f
```
Expected result: a `practice` directory containing `reports/status.csv` and `status-copy.csv`. `mkdir -p` creates missing parent directories; `cp` copies a file; `find` lists matching paths. Use `Tab` for shell completion and the Up arrow/history command to recall earlier commands. `&&` runs the next command only if the previous command exits successfully.

### Mastery task
Create a nested directory, create a text file, copy it, rename the copy, and list the result. Explain the difference between an absolute path (starting from the filesystem root) and a relative path (resolved from the current directory).
