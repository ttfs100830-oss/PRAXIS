# les-comp-filesystems-perms — File Systems, Paths, and Permissions

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-hardware-os` — Hardware, OS & Execution Mechanics  
**Classification:** core  
**Prerequisites:** `les-comp-os-kernel`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-filesystems-perms` |
| Title | File Systems, Paths, and Permissions |
| Scope | Navigate hierarchical file trees and interpret read/write/execute permissions. |
| Estimated Time | 40 minutes |
| Difficulty | Beginner |

---

## 2. Introduction — Why This Matters

Almost every program reads or writes files. Understanding how the operating system organizes files into a hierarchy and how it enforces permissions is required for writing reliable software, debugging “Permission denied” errors, and securing systems.

---

## 3. Learning Objectives

1. Describe a hierarchical file system.
2. Distinguish absolute vs relative paths.
3. Interpret Unix permission bits (rwx for owner/group/other).
4. Explain what the execute bit means for files vs directories.
5. Use basic commands to inspect and change permissions.

---

## 4. Terminology

| Term | Definition |
|------|------------|
| **File system** | The organization of data on a storage device into files and directories |
| **Absolute path** | A path starting from the root (`/home/user/file.txt`) |
| **Relative path** | A path relative to the current working directory (`./file.txt`) |
| **Inode** | Data structure that stores metadata about a file |
| **Permission bits** | rwx flags controlling who can read, write, or execute |
| **Owner / Group / Other** | The three categories of users for permission checks |
| **umask** | Default permission mask applied when creating new files |

---

## 5. Detailed Explanation

### Hierarchical Structure
Everything starts at the root directory `/`. Directories contain files and other directories, forming a tree.

```
/
├── home/
│   └── alice/
│       ├── documents/
│       └── .bashrc
├── etc/
├── var/
└── tmp/
```

### Paths
- Absolute: starts with `/`
- Relative: interpreted from the current working directory
- Special entries: `.` (current) and `..` (parent)

### Unix Permissions
Each file/directory has a mode, commonly displayed as:

```
-rwxr-xr--  1 alice staff  4096 Oct 29 10:00 script.sh
```

Breaking it down:
- First character: type (`-` file, `d` directory, `l` symlink)
- Next three: owner permissions (rwx)
- Next three: group permissions
- Last three: other permissions

Numeric form (octal):
- `r = 4`, `w = 2`, `x = 1`
- `755` = owner rwx, group rx, other rx
- `644` = owner rw, group r, other r

### Execute Bit Meaning
- On a **file**: the file can be run as a program
- On a **directory**: the user can enter (cd into) the directory and access names inside it

---

## 6. Practical Commands

```bash
ls -l                  # long listing with permissions
pwd                    # print working directory
cd /path/to/dir        # change directory
chmod 755 script.sh    # set permissions
chown user:group file  # change owner (usually requires root)
```

---

## 7. Common Mistakes

- Using relative paths without knowing the current directory.
- Forgetting that execute permission is required on every directory in a path.
- Setting world-writable permissions on sensitive files.

---

## 8. Exercises

1. Create a directory and a file, then use `ls -l` and `chmod` to make the file executable only by the owner.
2. Explain why `chmod 000 directory` prevents even the owner from listing its contents (on most systems).

---

## 9. Mastery Task

Write the permission string and octal mode for a file that the owner can read/write/execute, the group can only read, and others have no access.

---

## 10. Completion Criteria

- [ ] Can read and interpret `ls -l` output
- [ ] Understands absolute vs relative paths
- [ ] Can set basic permissions with `chmod`

---

## 11. Summary

File systems organize data hierarchically. Permissions control who may read, write, or execute each object. Mastery of paths and permission bits is required for everyday development and operations work.

---

## 12. Related Lessons

- Previous: `les-comp-os-kernel`, `les-comp-processes-threads`
- Next: `les-comp-cli-navigation`


---

## Worked examples and mastery practice

### Worked example: directory permissions
On POSIX systems, `r` on a directory allows listing its names, `w` allows changing directory entries (usually combined with `x`), and `x` means search/traverse the directory. Thus `chmod 000 private_dir` removes ordinary owner/group/other permissions; even if a file inside is readable, the path cannot normally be traversed without directory search permission. `chmod u+x script.sh` adds execute permission for the owner only.

A file's inode stores metadata and references to its data blocks on many Unix-like filesystems; a directory maps names to file references. `umask` masks permission bits when new files/directories are created; it is not a command that changes existing permissions.

### Mastery task
Explain why reading `/home/alex/report.txt` may fail even if `report.txt` has read permission. Give a safe example of using `chmod u+x` and explain why broad `chmod -R 777` is usually a poor fix.

---

## Directory permissions and umask

On Unix-like systems, read (`r`) on a directory permits listing its names; execute (`x`) permits searching/traversing it when the name is known; write (`w`) permits changing directory entries, typically together with execute permission. A file may have read permission but still be inaccessible if a parent directory lacks search permission.

`chmod u+x script.sh` adds execute permission for the file owner without changing other permission bits. `chmod 000 directory` removes read, write, and execute permissions for owner/group/others; it is a dangerous test to run on directories you need, and an administrator or owner may need to restore permissions. On a directory, removing execute permission prevents traversal even if read permission remains.

A **umask** filters permission bits when new files/directories are created; it does not directly set the final permissions by itself. A process requests default modes (often 666 for files and 777 for directories), and the umask removes selected bits. Inodes store file metadata on many Unix file systems; directory entries map names to inode references. Exact implementation varies by file system.

### Mastery task

Explain why reading a file requires search permission on its parent directories. Demonstrate `chmod u+x script.sh` in a safe temporary directory, and explain the difference between `chmod` and `umask`.


---

## Worked examples and mastery practice

### Worked example: directory permissions
On POSIX systems, `r` on a directory allows listing its names, `w` allows changing directory entries (usually combined with `x`), and `x` means search/traverse the directory. Thus `chmod 000 private_dir` removes ordinary owner/group/other permissions; even if a file inside is readable, the path cannot normally be traversed without directory search permission. `chmod u+x script.sh` adds execute permission for the owner only.

A file's inode stores metadata and references to its data blocks on many Unix-like filesystems; a directory maps names to file references. `umask` masks permission bits when new files/directories are created; it is not a command that changes existing permissions.

### Mastery task
Explain why reading `/home/alex/report.txt` may fail even if `report.txt` has read permission. Give a safe example of using `chmod u+x` and explain why broad `chmod -R 777` is usually a poor fix.
