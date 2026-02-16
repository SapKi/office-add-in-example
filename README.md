# Word Add-in - Search Interface

Microsoft Word add-in that provides document search functionality.

## Features

- ✅ Text input for entering search queries
- ✅ Case sensitive checkbox option
- ✅ Displays top 3 search results
- ✅ Uses Word JavaScript API (`Body.search()`)

## Quick Start

### Prerequisites

- Node.js (v16+)
- Microsoft Word (Office 2021+ or Microsoft 365)
- npm

### Installation

```bash
npm install
```

### Running the Add-in

**Recommended way (one command):**

```bash
npm run start:desktop
```

This will:
1. Start the webpack dev server on `https://localhost:3000`
2. Automatically sideload the add-in into Word desktop
3. Open Word (or use existing instance)
4. Display the Search interface in the task pane

**Alternative (two terminals):**

```bash
# Terminal 1: Start dev server
npm run dev-server

# Terminal 2: Sideload add-in
npm run start:desktop
```

### Testing the Search

1. **Insert sample text** (optional):
   - Click "Insert sample text to test search" button
   - This adds sample paragraphs to your document

2. **Search the document**:
   - Enter a search term (e.g., "document", "search", "sample")
   - Toggle "Case sensitive" if needed
   - Click "Search" or press Enter
   - See top 3 results displayed below

## Project Structure

```
src/
├── taskpane/
│   ├── components/
│   │   └── SearchPage.tsx    # Main search interface
│   ├── wordSearch.ts         # Word API search functions
│   ├── index.tsx             # Entry point
│   └── taskpane.html         # HTML template
└── chakra-ui-react.d.ts      # Type declarations
```

## Scripts

- `npm run start:desktop` - Start dev server and sideload in Word desktop
- `npm run start:hidden` - Start dev server in background (hidden) then sideload Word; see `RUN_SILENT.md`
- `npm run start:web` - Start dev server and sideload in Word Online
- `npm run dev-server` - Start webpack dev server only
- `npm run build` - Build for production
- `npm run stop` - Stop the add-in debugging session

## Troubleshooting

**Add-in not loading?**
- Make sure the dev server is running (`npm run dev-server`)
- Accept the self-signed HTTPS certificate when prompted
- Check Word version (requires Office 2021+ or Microsoft 365)

**Search not working?**
- Ensure you're running inside Word (not standalone browser)
- Check browser console for errors
- Verify the document has content to search

**Port conflicts?**
- Default port is 3000 (HTTPS)
- Change in `package.json` → `config.dev_server_port`

## Development

The add-in uses:
- **React 18** with TypeScript
- **Chakra UI** for components
- **Word JavaScript API** for document search
- **Webpack** for bundling

## API Reference

The search uses the Word API:
```typescript
context.document.body.search(searchText, { matchCase: boolean })
```

Returns: `Word.RangeCollection` - collection of matching ranges
