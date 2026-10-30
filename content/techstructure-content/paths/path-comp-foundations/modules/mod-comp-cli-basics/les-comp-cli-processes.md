# les-comp-cli-processes — Inspecting and Managing Running Processes

**Path:** `path-comp-foundations`  
**Module:** `mod-comp-cli-basics` — Command-Line Interface Fundamentals  
**Classification:** core  
**Prerequisites:** `les-comp-processes-threads`, `les-comp-cli-navigation`

---

## 1. Lesson Metadata

| Field | Value |
|-------|-------|
| Lesson ID | `les-comp-cli-processes` |
| Title | Inspecting and Managing Running Processes |
| Scope | Monitor system resource usage and safely terminate hung processes. |
| Estimated Time | 35 minutes |
| Difficulty | Beginner |

---

## 2. Introduction

When a program hangs, consumes too much memory, or refuses to exit, you need to inspect and control processes from the terminal. This lesson covers the essential tools.

---

## 3. Learning Objectives

1. List running processes and interpret key columns.
2. Find a process by name or port.
3. Send signals (especially SIGTERM and SIGKILL) safely.
4. Monitor CPU and memory usage.

---

## 4. Essential Commands

```bash
ps aux                 # snapshot of all processes
ps aux | grep name     # filter by name
top                    # interactive live view
htop                   # improved interactive view (if installed)
pgrep -a name          # find PIDs by name
kill <pid>             # send SIGTERM (polite request to exit)
kill -9 <pid>          # send SIGKILL (force)
killall name           # kill by name
```

---

## 5. Common Signals

| Signal | Number | Meaning |
|--------|--------|---------|
| SIGTERM | 15 | Polite termination request (default) |
| SIGINT  | 2  | Interrupt (Ctrl+C) |
| SIGKILL | 9  | Force kill (cannot be caught) |
| SIGHUP  | 1  | Hangup / reload configuration |

Always prefer SIGTERM first. Use SIGKILL only when a process is unresponsive.

---

## 6. Practical Examples

```bash
# Find what is using port 3000
lsof -i :3000
# or
ss -tlnp | grep 3000

# Kill a hung Node process
pkill -f "node server.js"
```

---

## 7. Exercises

1. Start a long-running command (`sleep 300`) in one terminal, then from another terminal find its PID and terminate it with SIGTERM.
2. Use `top` or `htop` to identify the process currently using the most CPU.

---

## 8. Mastery Task

Write a short shell recipe that:
1. Finds all processes matching a given name.
2. Prints their PID, CPU%, and memory%.
3. Optionally kills them after confirmation.

---

## 9. Completion Criteria

- [ ] Can list and filter processes
- [ ] Understands SIGTERM vs SIGKILL
- [ ] Can free a stuck port or hung process

---

## 10. Related Lessons

- Previous: `les-comp-cli-streams-pipes`, `les-comp-processes-threads`
- Later: deployment and container process management lessons


---

## Worked examples and mastery practice

### Worked example: investigate before terminating
On Linux, `ps -eo pid,ppid,stat,%cpu,%mem,comm` prints process ID, parent PID, state, CPU, memory, and command. `top` or `htop` gives a live view. `kill PID` normally sends SIGTERM, requesting graceful shutdown; `kill -KILL PID` sends SIGKILL and prevents cleanup, so use it only when necessary. `pgrep` searches process names, but flags vary between Linux and macOS. On macOS, `ps`, `top`, and Activity Monitor are available; Linux-only commands such as `ss` may not be installed.

Before terminating a process, confirm its PID and command to avoid killing the wrong process. A listening port can often be investigated with platform-appropriate tools such as `lsof -i :3000`; on Linux, `ss -ltnp` may be available.

### Mastery task
Write a safe troubleshooting checklist for a development server that appears stuck: identify the process, inspect resource use, determine whether it owns the expected port, request graceful termination, and verify the port is released.

---

## Interpreting process listings safely

A process ID (PID) identifies a running process. A parent PID (PPID) identifies the process that started it. CPU and memory columns show resource use; state columns indicate whether a process is running, sleeping, stopped, or in another OS-specific state. Column names and formatting vary by operating system and `ps` implementation.

On many Linux systems:
```sh
ps -eo pid,ppid,stat,%cpu,%mem,comm
 top
 pgrep -af python
```

`ss -tlnp` is a Linux command commonly used to inspect listening TCP sockets; it may not exist on macOS. On macOS, `lsof -nP -iTCP:3000 -sTCP:LISTEN` can help identify a process listening on port 3000 if `lsof` is available. `pgrep` options differ between platforms, so consult `man pgrep` on the system in use.

To stop a process safely, identify the exact PID and command first. `kill PID` normally sends SIGTERM on Unix-like systems, asking the process to terminate and clean up. Check whether it exited. SIGKILL (`kill -KILL PID`) prevents the process from handling a cleanup request and should be a last resort. Never terminate a process just because its name looks familiar; confirm it is the intended process.

### Mastery task

Describe how you would identify a development server listening on port 3000, request graceful shutdown, and verify it stopped. Include a Linux approach and a macOS alternative, noting portability limits.


---

## Worked examples and mastery practice

### Worked example: investigate before terminating
On Linux, `ps -eo pid,ppid,stat,%cpu,%mem,comm` prints process ID, parent PID, state, CPU, memory, and command. `top` or `htop` gives a live view. `kill PID` normally sends SIGTERM, requesting graceful shutdown; `kill -KILL PID` sends SIGKILL and prevents cleanup, so use it only when necessary. `pgrep` searches process names, but flags vary between Linux and macOS. On macOS, `ps`, `top`, and Activity Monitor are available; Linux-only commands such as `ss` may not be installed.

Before terminating a process, confirm its PID and command to avoid killing the wrong process. A listening port can often be investigated with platform-appropriate tools such as `lsof -i :3000`; on Linux, `ss -ltnp` may be available.

### Mastery task
Write a safe troubleshooting checklist for a development server that appears stuck: identify the process, inspect resource use, determine whether it owns the expected port, request graceful termination, and verify the port is released.
