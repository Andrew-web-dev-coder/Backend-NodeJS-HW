# Backend NodeJS HW — Work with Logs

##  Project Description
This project includes two Node.js applications that work together to generate and analyze log files.

### 1. Log Generator
Generates random log entries based on time intervals:
- Creates a **new folder every minute**.
- Creates a **new log file every 10 seconds** inside the current folder.
- Each log entry randomly represents either a `success` or an `error` event.

### 2. Log Analyzer
Analyzes the generated logs and calculates statistics:
- Counts the number of `success` and `error` entries.
- Supports a CLI parameter `--type` to filter logs by type (`success` or `error`).
- Gracefully handles missing folders, malformed logs, or empty directories.

Both applications share a custom `Logger` class implemented as a reusable module in the `shared/` directory.

---

##  Installation and Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/Andrew-web-dev-coder/Backend-NodeJS-HW.git
cd Backend-NodeJS-HW
git checkout lab1-logs
npm install

▶ How to Run:
Run the Log Generator
npm run gen


This will continuously generate random log entries every 10 seconds and create a new folder every minute.

Run the Log Analyzer
npm run analyze


This command scans all log files inside the logs folder and prints statistics.

Use CLI Filter
npm run analyze -- --type error
npm run analyze -- --type success


The --type parameter filters logs by the specified type.

Technologies Used:

Node.js

fs-extra

commander

ES Modules (import/export)

Async/Await for file operations

Features:

Shared reusable logger module.

Automatic folder and file creation based on time.

Command-line filtering of logs.

Error handling for missing or malformed log files.

Clean, modular, and well-structured Node.js code.