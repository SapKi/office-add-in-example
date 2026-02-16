# Run Add-in Silently (No CMD Window)

## Method 1: PowerShell Script (Best - Completely Hidden)

Run this command:
```bash
npm run start:hidden
```

This uses PowerShell to run everything in hidden windows.

---

## Method 2: Node Script (Alternative)

Run this command:
```bash
npm run start:silent
```

This uses Node.js with PowerShell to hide windows.

---

## Method 3: Double-Click VBScript (Easiest)

Just double-click: **`start-silent.vbs`**

This runs completely hidden - no windows at all.

---

## Method 4: Batch File (Minimized)

Double-click: **`start-silent.bat`**

Runs in minimized window.

---

## Troubleshooting

**If Word doesn't open:**
1. Make sure webpack server starts first (wait 8-10 seconds)
2. Check if port 3000 is already in use
3. Try running manually first: `npm run dev-server` then `npm run start:desktop`

**If CMD still shows:**
- Use Method 1 (PowerShell) or Method 3 (VBScript) - these are truly hidden
- The Node script might still show a brief window

**To stop the server:**
```bash
npm run stop
```
