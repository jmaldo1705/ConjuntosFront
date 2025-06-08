# Junie Console Process Management

This directory contains utilities for managing Junie console processes.

## Closing Active Processes

If you need to close active processes related to the Junie console (Angular development server), you can use one of the following methods:

### Method 1: Using npm script

Run the following command from the project root:

```
npm run close-junie
```

### Method 2: Running the batch file directly

Navigate to the public directory and run:

```
close-junie-processes.bat
```

## What the script does

The script will:

1. Find and terminate Angular development server processes
2. Find and terminate any Node.js processes running on port 4200 (default Angular port)
3. Display a confirmation message when all processes have been closed

## Note

This script is designed for Windows systems. It uses Windows-specific commands like `taskkill` to terminate processes.
