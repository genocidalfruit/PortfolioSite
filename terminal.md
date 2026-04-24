# Projects Section Terminal - Complete Functionality Documentation

## Overview

The terminal is a fully interactive command-line interface embedded in the Projects section. It allows users to navigate through a virtual file system of projects, view file contents, and execute commands similar to a Unix-like shell. The terminal supports tab completion, command history, and keyboard shortcuts.

---

## File System Structure

The terminal operates on a nested file system with the following structure:

```
~/projects/
├── vault-ecosystem/ (directory, teal accent)
│   ├── Automated Knowledge Base (file, fa-database)
│   └── Knowledge Base Portal (file, fa-globe)
├── cement-site/ (directory, blue accent)
│   ├── Commercial Inventory UI (file, fa-boxes-stacked)
│   └── Inventory Backend API (file, fa-server)
├── ai-resume-suite/ (directory, purple accent)
│   ├── AI Recruitment Portal (file, fa-users)
│   └── Intelligence Processing Engine (file, fa-brain)
├── Deep Researcher (file, fa-search)
├── Network Intrusion Detection System (file,fa-shield-virus)
├── Portfolio Risk Simulator (file,fa-chart-pie)
└── Options Pricing Engine (file,fa-calculator)
```

**Accent Colors:**
- vault-ecosystem: Teal (#7E9CD8)
- cement-site: Blue
- ai-resume-suite: Purple

**Root Level Files (directly under ~/projects/):**
- Deep Researcher
- Network Intrusion Detection System
- Portfolio Risk Simulator
- Options Pricing Engine

---

## Available Commands

### 1. `help` - Show Available Commands

**Description:** Displays all available commands with their descriptions in a formatted table.

**Usage:**
```bash
~/projects$ help
```

**Output:**
```
  help     Show available commands
  ls       List directory contents
  cat      Display file contents (cat )
  cd       Change directory (cd <folder>, cd .., cd ~)
  clear    Clear terminal
  exit     Close terminal
```

---

### 2. `ls` - List Directory Contents

**Description:** Lists all files and directories in the current working directory.

**Usage:**
```bash
~/projects$ ls
```

**Behavior:**
- Directories are displayed with a trailing `/` suffix
- Files are displayed without any suffix
- Items are sorted alphabetically (case-insensitive)
- Items are separated by two spaces

**Example Output at Root:**
```bash
~/projects$ ls
Deep Researcher  Network Intrusion Detection System  Options Pricing Engine  ai-resume-suite  cement-site  vault-ecosystem
```

**Example Output Inside vault-ecosystem/**
```bash
~/projects/vault-ecosystem$ ls
Automated Knowledge Base  Knowledge Base Portal
```

**Example Output Inside cement-site/**
```bash
~/projects/cement-site$ ls
Commercial Inventory UI  Inventory Backend API
```

**Example Output Inside ai-resume-suite/**
```bash
~/projects/ai-resume-suite$ ls
AI Recruitment Portal  Intelligence Processing Engine
```

---

### 3. `cd` - Change Directory

**Description:** Navigate between directories in the virtual file system.

**Basic Usage:**
```bash
cd <target>
```

#### Go to Root Directory:
```bash
# Three equivalent commands
~/projects$ cd ~
~/projects$

~/projects$ cd /
~/projects$

~/projects$ cd
~/projects$
```

#### Enter a Subdirectory:
```bash
~/projects$ cd vault-ecosystem
~/projects/vault-ecosystem$
```

#### Go Up One Level:
```bash
~/projects/vault-ecosystem$ cd ..
~/projects$
```

#### Case-Insensitive Navigation:
```bash
~/projects$ cd VAULT-ECOSYSTEM
~/projects/vault-ecosystem$

~/projects$ cd Cement-Site
~/projects/cement-site$

~/projects$ cd Ai-Resume-Suite
~/projects/ai-resume-suite$
```

#### Navigate Through All Subdirectories:
```bash
# Start at root
~/projects$ cd vault-ecosystem
~/projects/vault-ecosystem$

# List and view contents
~/projects/vault-ecosystem$ ls
Automated Knowledge Base  Knowledge Base Portal

~/projects/vault-ecosystem$ cat "Automated Knowledge Base"
[sistema built on Obsidian with automated workflows...]

~/projects/vault-ecosystem$ cat "Knowledge Base Portal"
[Public-facing frontend that transforms private Markdown notes...]

# Go back to root
~/projects/vault-ecosystem$ cd ..
~/projects$

# Enter cement-site
~/projects$ cd cement-site
~/projects/cement-site$

~/projects/cement-site$ ls
Commercial Inventory UI  Inventory Backend API

~/projects/cement-site$ cat "Commercial Inventory UI"
[Frontend for a commercial inventory management system...]

~/projects/cement-site$ cat "Inventory Backend API"
[Centralized REST API and PostgreSQL database layer...]

# Return to root
~/projects/cement-site$ cd ..
~/projects$

# Enter ai-resume-suite
~/projects$ cd ai-resume-suite
~/projects/ai-resume-suite$

~/projects/ai-resume-suite$ ls
AI Recruitment Portal  Intelligence Processing Engine

~/projects/ai-resume-suite$ cat "AI Recruitment Portal"
[User-facing portal with interactive dashboards...]

~/projects/ai-resume-suite$ cat "Intelligence Processing Engine"
[Core AI backend integrating the Gemini API...]

# Back to root
~/projects/ai-resume-suite$ cd ..
~/projects$
```

#### Error Cases:
```bash
# Attempt to enter non-existent directory
~/projects$ cd nonexistent
cd: no such directory: nonexistent

# Attempt to enter a file as if it were a directory
~/projects$ cd "Deep Researcher"
cd: not a directory: Deep Researcher

# Attempt to go above root (stays at root, no error)
~/projects$ cd ..
~/projects$
```

---

### 4. `cat` - Display File Contents

**Description:** Shows the description of a file.

**Usage:**
```bash
cat <filename>
```

#### Root Level File Examples:

```bash
# Deep Researcher
~/projects$ cat "Deep Researcher"
Autonomous multi-agent research system built with LangChain and LangGraph. Takes a natural language query and produces a fully cited, structured research report with no human intervention. Powered by four specialized agents: a Manager for orchestration, Search Agent for web research, Writer Agent for drafting, and a Critique Agent that fact-checks claims via live web search before accepting the draft. Uses OpenAI function calling and stores research in SQLite for persistence.

# Network Intrusion Detection System
~/projects$ cat "Network Intrusion Detection System"
Distributed security framework using a Generative Transformer to synthesize attack data and solve class imbalance using SMOTE. A central server manages global model training using PyTorch DistributedDataParallel and distributes quantized ONNX models to edge nodes via MQTT for low-latency threat detection with sub-10ms inference on edge devices.

# Portfolio Risk Simulator
~/projects$ cat "Portfolio Risk Simulator"
Quantitative finance tool using stochastic modeling to simulate thousands of market scenarios via Monte Carlo methods and calculate portfolio risk metrics including Value at Risk (VaR), Conditional VaR, Maximum Drawdown, Sharpe Ratio, and Sortino Ratio. Features interactive chart visualizations and historical backtesting. Built with Python, NumPy, and Plotly Dash.

# Options Pricing Engine
~/projects$ cat "Options Pricing Engine"
Mathematical implementation of the Black-Scholes-Merton formula for European options pricing with support for Greeks sensitivity analysis (Delta, Gamma, Theta, Vega, Rho). Includes binomial tree pricing for American options, implied volatility calculation, and interactive option chain visualization. Built with NumPy and Matplotlib.
```

#### vault-ecosystem File Examples:

```bash
~/projects$ cd vault-ecosystem

~/projects/vault-ecosystem$ cat "Automated Knowledge Base"
A sophisticated PKM system built on Obsidian with automated workflows for metadata integrity, link consistency, and Digital Garden structure. Features include bi-directional linking, backlinking, graph visualization, custom meta properties, and auto-generated tables of content. Built with Python scripting and YAML frontmatter for seamless integration with my personal knowledge base.

~/projects/vault-ecosystem$ cat "Knowledge Base Portal"
Public-facing frontend that transforms private Markdown notes into a high-performance, SEO-friendly web interface. Utilizes static site generation with custom theming, full-text search, tag-based navigation, and dark mode support. Built with Astro and React for optimal performance.
```

#### cement-site File Examples:

```bash
~/projects$ cd cement-site

~/projects/cement-site$ cat "Commercial Inventory UI"
Frontend for a commercial inventory management system featuring product cataloging, tracking, dynamic sorting, filtering by category/date/status, bulk import/export via CSV, barcode scanning support, real-time stock alerts, and dashboard analytics with charts. Built with React and Tailwind CSS.

~/projects/cement-site$ cat "Inventory Backend API"
Centralized REST API and PostgreSQL database layer with JWT authentication, role-based access control, comprehensive CRUD operations, automated API documentation with Swagger/OpenAPI, rate limiting, and automated testing. Built with Express.js and Sequelize ORM for scalability.
```

#### ai-resume-suite File Examples:

```bash
~/projects$ cd ai-resume-suite

~/projects/ai-resume-suite$ cat "AI Recruitment Portal"
User-facing portal with interactive dashboards, drag-and-drop resume uploads, real-time application status tracking, recruiter feedback loops with comments and scoring, candidate ranking visualization, and email notifications. Built with React, D3.js for data visualization.

~/projects/ai-resume-suite$ cat "Intelligence Processing Engine"
Core AI backend integrating the Gemini API for resume parsing, entity extraction (skills, education, experience), candidate scoring algorithms, natural language matching to job descriptions, ATS integration, and recruiter-side analytics dashboard. Built with Python, FastAPI, and LangChain.
```

#### Error Cases:
```bash
# No arguments
~/projects$ cat
Usage: cat <filename>

# File doesn't exist
~/projects$ cat nonexistent
cat: nonexistent: No such file

# Target is a directory
~/projects$ cat vault-ecosystem
cat: vault-ecosystem: Is a directory

# Case-insensitive but must exist
~/projects$ cat deep researcher
cat: deep researcher: No such file
```

---

### 5. `clear` - Clear Terminal

**Description:** Clears all history from the terminal output while keeping the prompt.

**Usage:**
```bash
~/projects$ help
  help     Show available commands
  ls       List directory contents
  cat      Display file contents
  cd       Change directory
  clear    Clear terminal
  exit     Close terminal
~/projects$ clear
~/projects$
```

**Shortcut:** `Ctrl + L` (performs the same action)

---

### 6. `exit` - Close Terminal

**Description:** Exits the terminal mode and returns to the file browser view.

**Usage:**
```bash
~/projects$ exit
```

**Alternative:** Press `Escape` key

---

## Tab Completion System - Complete Guide

### How Tab Completion Works

The terminal features intelligent, context-aware tab completion that adapts based on:
1. What you've typed so far
2. Which command you're using
3. What's available in the current directory

### Completion Triggers

| Action | Result |
|--------|--------|
| Press `Tab` | Show completions / Cycle to next match |
| Press `Tab` repeatedly | Cycle through all available completions |
| `Arrow Up` | Select previous item in completion list |
| `Arrow Down` | Select next item in completion list |
| `Enter` | Apply selected completion |
| `Escape` | Dismiss completion popup |

### Context-Specific Completions

#### Context 1: Empty Input
When the input line is empty and you press Tab, ALL available commands are shown.

```bash
~/projects$ [Press Tab]
```

**Popup displays:**
- `›` help - Show available commands
- `›` ls - List directory contents
- `›` cat - Display file contents
- `›` cd - Change directory
- `›` clear - Clear terminal
- `›` exit - Close terminal

**Behavior:** Since there are 6 matches, pressing Tab cycles through them. If you only have one unique partial match, it auto-completes.

---

#### Context 2: Partial Command Typed

When you start typing a command, Tab shows matching commands AND files/directories starting with that letter.

**Example: Typing 'l' + Tab**
```bash
~/projects$ l[Press Tab]
```
**Popup displays:**
- `›` ls - List directory contents
- All files/directories in current directory starting with 'l'

At root, only 'ls' command matches:
```bash
~/projects$ l[Press Tab]
# Auto-completes to 'ls' if it's the only match
~/projects$ ls
```

**Example: Typing 'c' + Tab at root**
```bash
~/projects$ c[Press Tab]
```
**Popup displays:**
- `›` cat - Display file contents
- `›` cd - Change directory
- `›` clear - Clear terminal
- `▸` cement-site/ (directory)

Multiple matches exist, so it shows the popup. Press Tab again to cycle through.

**Example: Typing 'he' + Tab**
```bash
~/projects$ he[Press Tab]
```
**Auto-completes to:**
```bash
~/projects$ help
```
(Single match, auto-filled)

---

#### Context 3: After `cd` Command
When you type `cd` followed by a space or start typing, Tab shows ONLY directories (not files).

**Example: Empty argument**
```bash
~/projects$ cd [Press Space or Tab]
```
**Popup displays:**
- `▸` ai-resume-suite/
- `▸` cement-site/
- `▸` vault-ecosystem/

**Example: Partial directory name**
```bash
~/projects$ cd v[Press Tab]
```
**Popup displays:**
- `▸` vault-ecosystem/

**Auto-complete result:**
```bash
~/projects$ cd vault-ecosystem 
```
(Note: Auto-adds trailing space after completion)

**Example: Typing 'c' after cd**
```bash
~/projects$ cd c[Press Tab]
```
**Popup displays:**
- `▸` cement-site/

**Result:**
```bash
~/projects$ cd cement-site 
```

**Example: Navigating up**
```bash
~/projects/vault-ecosystem$ cd [Press Tab]
```
**Popup displays:**
- `▸` .. (parent directory)

**Selecting '..':**
```bash
~/projects/vault-ecosystem$ cd ..
~/projects$
```

---

#### Context 4: After `cat` Command
When you type `cat` followed by a space or start typing, Tab shows ONLY files (not directories).

**Example: At root level**
```bash
~/projects$ cat [Press Tab]
```
**Popup displays:**
- `·` Deep Researcher
- `·` Network Intrusion Detection System
- `·` Options Pricing Engine
- `·` Portfolio Risk Simulator

(Note: Directories like vault-ecosystem, cement-site, ai-resume-suite are NOT shown)

**Example: Partial filename with spaces**
```bash
~/projects$ cat D[Press Tab]
```
**Popup displays:**
- `·` Deep Researcher

**Auto-complete result:**
```bash
~/projects$ cat "Deep Researcher"
```
(Note: Auto-adds quotes because filename contains spaces)

**Example: Inside cement-site directory**
```bash
~/projects/cement-site$ cat [Press Tab]
```
**Popup displays:**
- `·` Commercial Inventory UI
- `·` Inventory Backend API

**Typing 'C' + Tab:**
```bash
~/projects/cement-site$ cat C[Press Tab]
```
**Popup displays:**
- `·` Commercial Inventory UI

**Result:**
```bash
~/projects/cement-site$ cat "Commercial Inventory UI"
```

**Typing 'I' + Tab:**
```bash
~/projects/cement-site$ cat I[Press Tab]
```
**Popup displays:**
- `·` Inventory Backend API

**Result:**
```bash
~/projects/cement-site$ cat "Inventory Backend API"
```

---

#### Context 5: After `ls` Command
When you type `ls`, Tab shows ALL entries (both files AND directories).

```bash
~/projects$ ls [Press Tab]
```
**Popup displays:**
- `·` Deep Researcher (file)
- `·` Network Intrusion Detection System (file)
- `·` Options Pricing Engine (file)
- `·` Portfolio Risk Simulator (file)
- `▸` ai-resume-suite/ (directory)
- `▸` cement-site/ (directory)
- `▸` vault-ecosystem/ (directory)

File icons use `·` prefix, directory icons use `▸` prefix.

---

#### Context 6: Inside Subdirectories
When you're inside a subdirectory, Tab completion reflects that directory's contents.

**Example: Inside vault-ecosystem**
```bash
~/projects/vault-ecosystem$ cd [Press Tab]
```
**Popup displays:**
- `▸` .. (parent directory - only directory available)

**Example: Using cat inside vault-ecosystem**
```bash
~/projects/vault-ecosystem$ cat [Press Tab]
```
**Popup displays:**
- `·` Automated Knowledge Base
- `·` Knowledge Base Portal

**Typing 'A' + Tab:**
```bash
~/projects/vault-ecosystem$ cat A[Press Tab]
```
**Auto-completes to:**
```bash
~/projects/vault-ecosystem$ cat "Automated Knowledge Base"
```

---

### Auto-Quoting for Names with Spaces

The terminal automatically adds quotes around filenames that contain spaces:

```bash
# Without quotes (fails - treats "Deep" as the filename)
~/projects$ cat Deep Researcher
cat: Deep: No such file

# With manual quotes (works)
~/projects$ cat "Deep Researcher"
[Displays file content]

# Tab completion auto-adds quotes
~/projects$ cat D[Press Tab]
~/projects$ cat "Deep Researcher"

# Works for all multi-word files
~/projects$ cat "Network Intrusion Detection System"
~/projects$ cat "Portfolio Risk Simulator"
~/projects$ cat "Options Pricing Engine"
```

Inside directories:
```bash
~/projects/cement-site$ cat C[Press Tab]
~/projects/cement-site$ cat "Commercial Inventory UI"

~/projects/cement-site$ cat I[Press Tab]
~/projects/cement-site$ cat "Inventory Backend API"
```

---

## Complete Step-by-Step Navigation Examples

### Example 1: Full Directory Tour Using Tab Completion

```bash
# Start at root, see available commands
~/projects$ [Press Tab]
# Popup shows: help, ls, cat, cd, clear, exit
# Select 'ls' with Enter
~/projects$ ls
Deep Researcher  Network Intrusion Detection System  Options Pricing Engine  ai-resume-suite  cement-site  vault-ecosystem

# Navigate to vault-ecosystem using Tab
~/projects$ cd [Press Tab]
# Popup shows directories: ai-resume-suite, cement-site, vault-ecosystem
# Select vault-ecosystem
~/projects$ cd vault-ecosystem 

# List contents
~/projects/vault-ecosystem$ ls
Automated Knowledge Base  Knowledge Base Portal

# View first file using Tab
~/projects/vault-ecosystem$ cat [Press Tab]
# Popup shows: Automated Knowledge Base, Knowledge Base Portal
# Select Automated Knowledge Base
~/projects/vault-ecosystem$ cat "Automated Knowledge Base"
[Full description displayed]

# View second file
~/projects/vault-ecosystem$ cat K[Press Tab]
~/projects/vault-ecosystem$ cat "Knowledge Base Portal"
[Full description displayed]

# Go back to root using .. with Tab
~/projects/vault-ecosystem$ cd [Press Tab]
# Popup shows: ..
~/projects/vault-ecosystem$ cd ..
~/projects$
```

### Example 2: Exploring All Projects with Minimal Typing

```bash
# Use partial names + Tab for fastest navigation

~/projects$ cd v[Tab]  # vault-ecosystem
~/projects/vault-ecosystem$ cat A[Tab]  # "Automated Knowledge Base"
~/projects/vault-ecosystem$ cat K[Tab]  # "Knowledge Base Portal"
~/projects/vault-ecosystem$ cd ..

~/projects$ cd c[Tab]  # cement-site
~/projects/cement-site$ cat C[Tab]  # "Commercial Inventory UI"
~/projects/cement-site$ cat I[Tab]  # "Inventory Backend API"
~/projects/cement-site$ cd ..

~/projects$ cd a[Tab]  # ai-resume-suite
~/projects/ai-resume-suite$ cat A[Tab]  # "AI Recruitment Portal"
~/projects/ai-resume-suite$ cat I[Tab]  # "Intelligence Processing Engine"
~/projects/ai-resume-suite$ cd ..

# View root-level files
~/projects$ cat D[Tab]  # "Deep Researcher"
~/projects$ cat N[Tab]  # "Network Intrusion Detection System"
~/projects$ cat P[Tab]  # "Portfolio Risk Simulator"
~/projects$ cat O[Tab]  # "Options Pricing Engine"
```

### Example 3: Using Command History

```bash
# Execute some commands
~/projects$ cd vault-ecosystem
~/projects/vault-ecosystem$ ls
~/projects/vault-ecosystem$ cat "Automated Knowledge Base"

# Now use Arrow Up to recall commands
~/projects/vault-ecosystem$ [Arrow Up]
# Input shows: cat "Automated Knowledge Base"

~/projects/vault-ecosystem$ [Arrow Up]
# Input shows: ls

~/projects/vault-ecosystem$ [Arrow Up]
# Input shows: cd vault-ecosystem

~/projects/vault-ecosystem$ [Arrow Up]
# Input shows: cd vault-ecosystem (stays at oldest command)

~/projects/vault-ecosystem$ [Arrow Down]
# Input shows: ls

~/projects/vault-ecosystem$ [Arrow Down]
# Input shows: cat "Automated Knowledge Base"

~/projects/vault-ecosystem$ [Arrow Down]
# Input clears (back to empty prompt)

# Execute the recalled command
~/projects/vault-ecosystem$ [Arrow Up][Arrow Up][Enter]
# Re-executes: cd vault-ecosystem
```

### Example 4: Clearing and Exiting

```bash
# Fill terminal with commands
~/projects$ help
~/projects$ ls
~/projects$ cd vault-ecosystem
~/projects/vault-ecosystem$ cat "Automated Knowledge Base"

# Clear the terminal
~/projects/vault-ecosystem$ clear
~/projects/vault-ecosystem$

# Or use Ctrl+L
~/projects/vault-ecosystem$ [Ctrl+L]
~/projects/vault-ecosystem$

# Exit back to file browser
~/projects/vault-ecosystem$ exit
# Returns to file browser view

# Alternative: Press Escape to exit
~/projects$ [Escape]
# Returns to file browser view
```

---

## Keybindings Reference

| Key / Combination | Context | Action |
|-------------------|---------|--------|
| `Enter` | Always | Execute command / Apply selected completion |
| `Escape` | Terminal active | Close tab completion popup |
| `Escape` | Any mode | Exit terminal mode (return to file browser) |
| `Tab` | Input field | Show completions / Cycle to next completion |
| `Arrow Up` | No completions | Previous command in history |
| `Arrow Up` | Completions open | Previous item in completion list |
| `Arrow Down` | No completions | Next command in history |
| `Arrow Down` | Completions open | Next item in completion list |
| `Ctrl + L` | Terminal active | Clear terminal (same as `clear` command) |
| `Tab` (repeated) | Completions open | Cycle through all matches |

---

## Visual Styling Guide

| Element | Style | Color |
|---------|-------|-------|
| Prompt | Monospace font | Cyan (`var(--accent-cyan)`) |
| Prompt format | | `~/projects/path$ ` |
| User typed input | Monospace font | Cyan |
| Command output | Monospace font, line-height: 1.6 | `#a8b3bc` (light gray-blue) |
| Terminal container background | | `rgba(22, 22, 29, 0.25)` with blur |
| Terminal output background | | `rgba(17, 20, 28, 0.95)` with blur |
| Content panel | | Semi-transparent dark with border |

### Tab Completion Popup Styling

| Element | Icon | Color | Font |
|---------|------|-------|------|
| Commands | `›` | Green `#98BB6C` | Monospace, 0.8rem |
| Directories | `▸` | Blue `#7E9CD8` | Monospace, 0.8rem |
| Files | `·` | Gold `#C8C093` | Monospace, 0.8rem |
| Active selection | | Cyan | Bold |
| Hover state | | Light blue background | |

---

## Error Messages Reference

| Error Message | Cause | Example |
|---------------|-------|---------|
| `command not found: <cmd>` | Typed an unknown command | `~/projects$ asdf` |
| `cd: no such directory: <name>` | Directory doesn't exist | `~/projects$ cd nonexistent` |
| `cd: not a directory: <name>` | Target is a file, not a directory | `~/projects$ cd "Deep Researcher"` |
| `Error: Directory not found.` | Current working directory is invalid | `~/projects/nonexistent$ ls` |
| `cat: <name>: No such file` | File doesn't exist in current directory | `~/projects$ cat nonexistent` |
| `cat: <name>: Is a directory` | Used `cat` on a directory | `~/projects$ cat vault-ecosystem` |
| `Usage: cat <filename>` | No filename provided to `cat` | `~/projects$ cat` |

---

## File System Data Structure

The virtual file system is defined as a JavaScript object:

### Directory Structure:
```javascript
{
    name: 'projects',
    type: 'directory',
    children: {
        'vault-ecosystem': {
            type: 'directory',
            accent: 'teal',
            children: {
                'Automated Knowledge Base': { type: 'file', ... },
                'Knowledge Base Portal': { type: 'file', ... }
            }
        },
        // ... more directories and files
    }
}
```

### File Properties:
```javascript
{
    type: 'file',
    icon: 'fa-database',      // Font Awesome icon class
    description: 'Detailed project description...',
    github: 'https://github.com/...'  // Optional GitHub URL
}
```

### Directory Properties:
```javascript
{
    type: 'directory',
    accent: 'teal',  // Color theme: 'teal', 'blue', or 'purple'
    children: { /* nested entries */ }
}
```

---

## Technical Specifications

### Path Resolution
- All paths are relative to `~/projects/`
- `~` resolves to `~/projects`
- `/` resolves to `~/projects`
- `..` navigates to parent directory (stays at root if already at root)
- Forward slashes only (no backslashes supported)

### String Matching
- All command and path matching is **case-insensitive**
- `CD VAULT-ECOSYSTEM` = `cd vault-ecosystem`
- File/directory names with spaces must be quoted
- Single quotes and double quotes both work for quoting

### History Behavior
- Command history is stored in memory (resets on page reload)
- History navigates from most recent to oldest
- Arrow Up starts with most recent command
- Arrow Down returns to empty input after oldest command
- History is preserved when switching between terminal and file browser modes

### Tab Completion Logic
- Empty input: Shows all commands
- Partial command: Shows matching commands + matching files/dirs
- After `cd`: Shows only directories + parent (`..`)
- After `cat`: Shows only files
- After `ls`: Shows all entries (files + directories)
- Single match: Auto-completes without showing popup
- Single match with spaces: Auto-completes with quotes
- Multiple matches: Shows popup, Tab cycles through

### Auto-Focus
- Terminal input field receives focus when:
  - Terminal is opened from file browser
  - Mode switches to terminal
- Can be manually focused by clicking

### Auto-Scroll
- Terminal output div automatically scrolls to bottom when:
  - New command is executed
  - New output is added to history
- Enables `terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight`

---

## Quick Reference Tables

### All Files with Full Paths and Icons

| Full Path | Icon | Type |
|-----------|------|------|
| ~/projects/Deep Researcher | fa-search | file |
| ~/projects/Network Intrusion Detection System | fa-shield-virus | file |
| ~/projects/Portfolio Risk Simulator | fa-chart-pie | file |
| ~/projects/Options Pricing Engine | fa-calculator | file |
| ~/projects/vault-ecosystem/Automated Knowledge Base |fa-database | file |
| ~/projects/vault-ecosystem/Knowledge Base Portal |fa-globe | file |
| ~/projects/cement-site/Commercial Inventory UI |fa-boxes-stacked | file |
| ~/projects/cement-site/Inventory Backend API |fa-server | file |
| ~/projects/ai-resume-suite/AI Recruitment Portal |fa-users | file |
| ~/projects/ai-resume-suite/Intelligence Processing Engine |fa-brain | file |

### All Directories

| Path | Accent Color | Contents |
|------|--------------|----------|
| ~/projects/vault-ecosystem/ | Teal (#7E9CD8) | 2 files |
| ~/projects/cement-site/ | Blue | 2 files |
| ~/projects/ai-resume-suite/ | Purple | 2 files |

### Command Summary

| Command | Arguments | Shortcut | Description |
|---------|-----------|----------|-------------|
| help | none | - | Show commands |
| ls | none | - | List directory |
| cd | `<dir>` / `..` / `~` | - | Change directory |
| cat | `<file>` | - | Show file description |
| clear | none | Ctrl+L | Clear terminal |
| exit | none | Escape | Exit terminal |

---

## Best Practices

### Efficient Navigation

1. **Use Tab Completion:** Always use Tab to avoid typing full names, especially for files/directories with spaces
2. **Partial Typing:** Type the first unique letter + Tab for fastest navigation
3. **History Navigation:** Use Arrow Up/Down to reuse previous commands
4. **Clear Frequently:** Use `clear` or Ctrl+L to keep terminal clean

### Common Pitfalls

1. **Forgetting Quotes:** Multi-word names require quotes
   - ❌ `cat Deep Researcher` - treats "Deep" as filename
   - ✅ `cat "Deep Researcher"` - correct

2. **Case Sensitivity:** Commands are case-insensitive, but you still need correct spelling
   - ✅ `CD VAULT-ecosystem` works
   - ❌ `cd valut-ecosystem` fails (typo)

3. **cat on Directories:** `cat` only works on files
   - ❌ `cat vault-ecosystem` - error
   - ✅ `cd vault-ecosystem` then `cat "Automated Knowledge Base"` - correct

4. **Missing Arguments:** Some commands require arguments
   - ❌ `cat` - shows usage error
   - ✅ `cat "filename"` - works

### Complete Session Example

```bash
# Open terminal, auto-focused on input

# See what's available
~/projects$ ls
Deep Researcher  Network Intrusion Detection System  Options Pricing Engine  ai-resume-suite  cement-site  vault-ecosystem

# Explore vault-ecosystem
~/projects$ cd vault-ecosystem
~/projects/vault-ecosystem$ ls
Automated Knowledge Base  Knowledge Base Portal

# Read about first project
~/projects/vault-ecosystem$ cat "Automated Knowledge Base"
[sistema built on Obsidian with automated workflows for metadata integrity...]

# Go back and explore cement-site
~/projects/vault-ecosystem$ cd ..
~/projects$ cd cement-site
~/projects/cement-site$ ls
Commercial Inventory UI  Inventory Backend API

~/projects/cement-site$ cat "Inventory Backend API"
[Centralized REST API and PostgreSQL database layer...]

# Explore ai-resume-suite
~/projects/cement-site$ cd ..
~/projects$ cd ai-resume-suite
~/projects/ai-resume-suite$ ls
AI Recruitment Portal  Intelligence Processing Engine

~/projects/ai-resume-suite$ cat "Intelligence Processing Engine"
[Core AI backend integrating the Gemini API...]

# View all root-level projects
~/projects/ai-resume-suite$ cd ..
~/projects$ cat "Deep Researcher"
[Autonomous multi-agent research system...]

~/projects$ cat "Network Intrusion Detection System"
[Distributed security framework...]

~/projects$ cat "Portfolio Risk Simulator"
[Quantitative finance tool...]

~/projects$ cat "Options Pricing Engine"
[Mathematical implementation of the Black-Scholes-Merton formula...]

# Clear and exit
~/projects$ clear
~/projects$ exit
```
