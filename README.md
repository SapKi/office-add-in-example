# Word Search Add-in

A Microsoft Word add-in that lets you search the current document, see the top results in the task pane, and jump to or highlight matches in the document.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [How to Launch](#how-to-launch)
- [Using the Add-in](#using-the-add-in)
- [Scripts Reference](#scripts-reference)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Document search** – Search the current Word document by typing a query. Uses the Word JavaScript API (`Body.search()`).
- **Top 3 results** – The task pane shows the first three matches (with a short context: a few words before and after the match). The match is shown in bold/highlighted in the list.
- **Previous / Next** – If there are more than three matches, use **← Previous results** and **Next results →** to page through them (still showing 3 at a time).
- **Case sensitive** – Check **Case sensitive** to match exact letter case (e.g. "Contract" vs "contract").
- **Match behavior** – Search prefers whole-word matches first; if none are found, it falls back to partial (contain) matches.
- **Click to jump and highlight** – Click a result in the list to:
  - Scroll the document to that occurrence
  - Select it and highlight it in yellow
  - Clear any previous highlight so only the clicked result is highlighted
- **Highlight all on Search** – When you click the **🔍 Search** button, all current matches in the document are highlighted in yellow (in addition to showing the top 3 in the pane).
- **Insert sample text** – **Insert Sample Text** inserts several paragraphs of sample legal/employment agreement text so you can try search without typing content yourself. Suggested terms: `Employee`, `Employer`, `Contract`, `termination`, `salary`, `benefits`, `confidentiality`, `notice`, `duties`, `compensation`, `schedule`, `policy`, `property`.
- **Search as you type** – Results update automatically as you type (with a short delay). Highlights are cleared when the query is cleared or when you search again.


---

## Prerequisites

- **Node.js** (v16 or newer)
- **npm** (comes with Node)
- **Microsoft Word** (Office 2021 or Microsoft 365; desktop or web)
- **Windows** (for `start:hidden` and PowerShell scripts; other launch methods work on macOS/Linux where supported)

---

## Installation

1. Clone or download this repository.
2. Open a terminal in the project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. (First-time only) Accept the self-signed HTTPS certificate when the dev server or Office prompts you, so Word can load the add-in from `https://localhost:3000`.

---

## How to Launch

You must have the **dev server running** and then **sideload the add-in** into Word. Choose one of the options below.

### Option 1: One command (recommended) – dev server + Word

Starts the webpack dev server and sideloads the add-in into Word desktop. Word will open (or use an existing instance).

```bash
npm run start:desktop
```

When prompted, answer **Yes** to allow localhost/loopback for the add-in.

### Option 2: Run dev server in the background, then open Word

Starts the dev server in a **hidden** window, waits ~8 seconds, then sideloads the add-in. Word opens visibly; no extra command window for webpack.

```bash
npm run start:hidden
```

Requires PowerShell. When the script finishes, the dev server keeps running in the background. Press any key to close the script window.

### Option 3: Two terminals (manual control)

**Terminal 1 – dev server:**

```bash
npm run dev-server
```

Wait until webpack reports that it’s compiled (e.g. “compiled successfully”).

**Terminal 2 – sideload add-in:**

```bash
npm run start:desktop
```

Answer **Yes** when asked about localhost.

---

## Using the Add-in

1. **Open the add-in**  
   In Word, go to the **Home** tab (or where the add-in is registered) and click **Search Add-in** (magnifying glass icon).

2. **Optional: insert sample text**  
   Click **Insert Sample Text** to add test paragraphs. Then try searching for words like `Employee`, `Contract`, or `termination`.

3. **Search**  
   - Type in the **search box** (e.g. `document`, `search`, `sample`).  
   - Results update as you type; the top 3 matches appear in the list with context.  
   - Optionally check **Case sensitive**.  
   - Click **🔍 Search** to highlight **all** matches in the document and refresh the list.

4. **Navigate results**  
   - Use **← Previous results** and **Next results →** to see more sets of three matches.  
   - Click any result row to jump to that place in the document and highlight only that occurrence in yellow.

5. **Clear highlights**  
   - Clear the search box, or run a new search; previous highlights are cleared when appropriate.

If you open the task pane **outside** Word (e.g. in a browser), you’ll see a message that you need to run the add-in inside Word to search the document.

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run start:desktop` | Start dev server and sideload add-in into Word desktop (one command). |
| `npm run start:hidden` | Start dev server in background (hidden), then sideload; Word opens visibly. |
| `npm run dev-server` | Start webpack dev server only (HTTPS on port 3000). |
| `npm run start:desktop` | Sideload add-in (use after dev server is already running). |
| `npm run start:web` | Sideload for Word on the web. |
| `npm run build` | Production build; output in `dist/`. |
| `npm run stop` | Stop the add-in debugging session. |
| `npm run validate` | Validate `manifest.xml`. |

Default dev URL: **https://localhost:3000** (task pane and assets, including ribbon icons).

---

## Project Structure

```
├── assets/                 # Icons for the ribbon (e.g. icon-16.png, icon-32.png, icon-80.png)
├── dist/                    # Build output (generated; only essential files kept)
├── src/
│   ├── taskpane/
│   │   ├── components/
│   │   │   └── SearchPage.tsx   # Main search UI (Chakra UI)
│   │   ├── index.tsx            # Entry; mounts SearchPage
│   │   ├── taskpane.html        # Task pane HTML template
│   │   └── wordSearch.ts        # Word API: search, highlight, insert sample
│   └── chakra-ui-react.d.ts     # Chakra UI type declarations
├── manifest.xml            # Office add-in manifest (required for sideloading)
├── package.json
├── start-silent.ps1        # Used by npm run start:hidden
├── tsconfig.json
└── webpack.config.js
```

---

## Troubleshooting

**Add-in doesn’t load or task pane is blank**

- Ensure the dev server is running (`npm run dev-server` or use `start:desktop` / `start:hidden`).
- Accept the self-signed certificate when the browser or Word prompts (for `https://localhost:3000`).
- Try opening `https://localhost:3000/taskpane.html` in a browser and accept the certificate there too.

**Search does nothing / “Run this add-in inside Word”**

- The add-in must run inside Word (desktop or web). If you open only the task pane URL in a browser, the Word API isn’t available and search won’t work.

**Ribbon icon doesn’t update (still shows old/placeholder logo)**

- Word caches add-in icons. Close Word, clear the Office add-in cache, then restart:
  - Delete the contents of: `%LOCALAPPDATA%\Microsoft\Office\16.0\Wef\`
  - Or: File → Options → Trust Center → Trust Center Settings → Trusted Add-in Catalogs → enable “Next time Office starts, clear all previously-started web add-ins cache” → OK, then quit Word.
- Restart Word and run `npm run start:desktop` (or `start:hidden`) again so the add-in loads from `https://localhost:3000/assets/...`.

**Port 3000 already in use**

- Change the dev server port in `package.json` under `config.dev_server_port` (e.g. to `3001`). Update `manifest.xml` icon and task pane URLs if you use a different host/port.

**To stop the add-in**

- Run `npm run stop` to stop the debugging session. Stop the dev server with Ctrl+C in the terminal where it’s running (or close the hidden process if you used `start:hidden`).

---

## Tech Stack

- **React 18** + TypeScript  
- **Chakra UI** for the task pane UI  
- **Word JavaScript API** for document search, selection, and highlighting  
- **Webpack 5** for build and dev server (HTTPS, port 3000)
