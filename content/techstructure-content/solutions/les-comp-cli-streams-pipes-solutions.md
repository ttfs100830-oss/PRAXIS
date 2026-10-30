# Solutions — Standard Streams, Redirection, and Pipes

**Lesson ID:** `les-comp-cli-streams-pipes`  
**Scope:** Chain small CLI programs together using pipes and redirect output.

## Worked answers and grading notes

### Solution 1
Example: `grep -R --include="*.md" "TODO" . 2>errors.txt | sort > todos.txt` searches Markdown content, sends errors to a separate file, sorts matches, and saves stdout. Adapt options to the installed grep/shell.

### Solution 2
`>` overwrites, `>>` appends, `<` redirects stdin, `2>` redirects stderr, `|` connects stdout to stdin, and `tee file` duplicates stream to stdout and a file.

## Mastery-task grading rubric

Award credit when the submission: (1) addresses the lesson scope, (2) is technically correct, (3) handles the stated edge cases, (4) explains important trade-offs, and (5) includes runnable code/commands and expected output when the task requests them. Accept equivalent correct solutions; do not award full credit for unexplained or unsafe commands.
