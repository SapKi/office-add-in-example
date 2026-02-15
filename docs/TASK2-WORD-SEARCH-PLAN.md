# Task 2 – Word JS Add-in Search: Investigation & Plan

## Are Task 1 and Task 2 directly related?

**No.** They are separate features that can live in the **same add-in**:

| Task 1 | Task 2 |
|--------|--------|
| User creation by email (input + chips + suggestions) | Word document search (query + options + top 3 results) |
| Pure UI + dummy API, no Word API | Uses **Word JavaScript API** (document search) |
| In `src/emailService/` | New code in `src/taskpane/` (search UI + Word.run) |

**Recommendation:** Keep one taskpane and add a **simple way to switch** between the two experiences (e.g. tabs or nav: “Users” | “Search”) so one add-in satisfies both assignments.

---

## Task 2 requirements (from the brief)

1. **Single-page Word JS Add-in** – Already have taskpane; add Search UI to it.
2. **React 18** – Already in use.
3. **Chakra UI** – Not in project yet; need to add and use for the search screen.
4. **Search interface:**
   - Text input for search query.
   - Checkboxes: **Case sensitive** on/off.
   - **Top 3 search results** shown in the add-in.
5. **Use Word Add-in search** – Use the Word JavaScript API search (e.g. `body.search()` with `SearchOptions`).

---

## Word JavaScript API – Search (from docs)

- **Entry point:** `Word.run(async (context) => { ... })`.
- **Search:** `context.document.body.search(searchText, searchOptions)`.
- **Returns:** `Word.RangeCollection` (list of `Range` objects).
- **SearchOptions:** e.g. `{ matchCase: true }` for case-sensitive search.
- **Getting text:** Load `items` (and each range’s `text`), then `await context.sync()`. Take first 3 items and show their `.text` (and optionally location) in the add-in.

Pattern:

```ts
await Word.run(async (context) => {
  const searchResults = context.document.body.search(query, { matchCase: caseSensitive });
  searchResults.load("items");
  await context.sync();
  // Load .text on first 3 items
  const top3 = searchResults.items.slice(0, 3);
  top3.forEach(r => r.load("text"));
  await context.sync();
  return top3.map(r => r.text);
});
```

---

## Chakra UI

- **Task 2 requires Chakra UI.** The repo does not have it yet.
- **Option A – Chakra v2:** Works with React 18 and typical Node versions. Install: `@chakra-ui/react`, `@emotion/react`, `@emotion/styled`, `framer-motion`. Wrap app in `<ChakraProvider>`.
- **Option B – Chakra v3:** Newer; may require Node 20+. Use if the project is already on Node 20+.

**Recommendation:** Start with **Chakra v2** for compatibility; use v3 only if you explicitly want it and can enforce Node 20+.

---

## Proposed structure

```
src/taskpane/
  index.tsx              (unchanged; renders App)
  components/
    App.tsx               (add nav/tabs: Users | Search; render SettingsPage or SearchPage)
    SearchPage.tsx        (NEW – Chakra UI: input, case-sensitive checkbox, “Search” button, top 3 results)
```

- **SearchPage:** Chakra `Input`, `Checkbox`, `Button`, `VStack`/`Box` for results. On submit, call `Word.run(...)` with `body.search(query, { matchCase })`, take first 3 ranges, load `.text`, then set state and render the list.
- **App:** Either tabs (e.g. “Users” | “Search”) or two buttons to switch between `<SettingsPage />` and `<SearchPage />`. When not running inside Word, you can still show Search but Word.run will only work inside the host.

---

## Implementation steps (high level)

1. **Add Chakra UI** – Install deps, wrap `App` (or root in `index.tsx`) with `ChakraProvider`.
2. **Add SearchPage** – Chakra layout, input, case-sensitive checkbox, button; on submit call Word search and store top 3 results in state; display list (and optionally “no results” or “open in Word to search” when not in Word).
3. **Wire Word search** – Helper (e.g. `searchWordDocument(query, matchCase): Promise<string[]>`) that uses `Word.run` and the pattern above; `SearchPage` calls it and shows the first 3 strings (or range previews).
4. **Integrate into App** – Tabs or nav to switch between Task 1 (SettingsPage) and Task 2 (SearchPage).
5. **README** – Document setup (install, npm run dev-server, sideload), assumptions (Chakra v2, one taskpane for both tasks), design (tabs, top 3 only), and challenges (e.g. Word API async, loading range text, handling “not in Word”).

---

## README.md (Task 2 section to add)

- **Setup:** `npm install`, `npm run dev-server`, sideload manifest in Word (desktop or web).
- **Assumptions / design:**  
  - One taskpane for both Task 1 and Task 2; tab or nav to switch.  
  - Chakra v2 for Task 2 UI.  
  - “Top 3” = first 3 ranges returned by `body.search()`; we show their text (and optionally a short context).
- **Challenges:**  
  - Word API is async and requires `context.sync()`; we use a single `Word.run` and load `items` then `.text` for the first 3.  
  - When the add-in runs outside Word (e.g. browser only), search is disabled or shows a message (“Open in Word to search”).

---

## References (from your brief)

- Word Add-in template (this repo)
- [Microsoft Learn: Beginner's guide to Office Add-ins](https://learn.microsoft.com/en-us/office/dev/add-ins/)
- [Word JavaScript API overview](https://learn.microsoft.com/en-us/javascript/api/word?view=word-js-preview)
- [Word JavaScript API reference](https://learn.microsoft.com/en-us/javascript/api/word/word.searchoptions?view=word-js-preview) (SearchOptions, e.g. `matchCase`)
- [React documentation](https://react.dev/)
- [Office Add-ins documentation](https://learn.microsoft.com/en-us/office/dev/add-ins/)

I can next: (1) add Chakra and the Search UI skeleton, (2) implement the Word search helper and wire it to SearchPage, or (3) add the App tabs and README section. Tell me which you want to do first.
