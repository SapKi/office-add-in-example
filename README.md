## Installation

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev-server
   ```

3. Sideload the add-in into Word (Desktop):

   ```bash
   npm run start:desktop
   ```

4. Or sideload into Word on the web:

   ```bash
   npm run start:web
   ```

5. Stop sideloading:

   ```bash
   npm run stop
   ```

---

## Task 1 – User creation by email

See **`src/emailService/README.md`** for the email input component (bi-directional parent–child communication, dummy API, Figma-aligned UI).

---

## Task 2 – Word JS Add-in Search

### Setup

- Same as above. After `npm install`, the taskpane includes both **Users** (Task 1) and **Search** (Task 2) tabs.
- **Chakra UI** is used for the Search interface (`@chakra-ui/react` v2, React 18–compatible).

### Features

- **Search tab:** Text input for search query, **Case sensitive** checkbox, **Search** button.
- **Top 3 results:** The first 3 matches from the Word document are shown in the add-in (using `Word.run` and `document.body.search()` with `SearchOptions.matchCase`).
- Search runs only when the add-in is opened **inside Word** (desktop or web); otherwise a message is shown.

### Assumptions and design decisions

- **Single taskpane:** Both Task 1 (Users) and Task 2 (Search) live in one taskpane, with tabs to switch between them.
- **Chakra UI v2:** Used for Task 2 to stay compatible with React 18 and common Node versions (Chakra v3 may require Node 20+).
- **Top 3 results:** Implemented as the first 3 items in the `RangeCollection` returned by `body.search()`; each result shows the matched range’s text.
- **Case sensitive:** Wired to Word’s `SearchOptions.matchCase` (on = case sensitive, off = ignore case).

### Challenges and how they were addressed

1. **Word API is async:** Search uses `Word.run()` and two `context.sync()` calls (one to load search result items, one to load each range’s `text`). The helper (`src/taskpane/wordSearch.ts`) returns a Promise that resolves with the top 3 result strings.
2. **Running outside Word:** When the taskpane is opened in a browser without Word, `Word` is undefined. The Search UI checks `isWordAvailable()` and shows a short message instead of calling the API.
3. **Loading result text:** Each `Range` in the collection must have `.load("text")` called before `context.sync()` to read `.text`; the helper does this for the first 3 ranges only.
