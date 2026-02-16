/**
 * Word document search using the Word JavaScript API.
 * Returns the top 3 matches with full paragraph context for each.
 */

/* global Word */

export interface WordSearchOptions {
  matchCase: boolean;
}

export interface SearchResultItem {
  /** Full text of the paragraph containing the match (for context). */
  paragraphText: string;
  /** The exact matched text (from the range). */
  matchText: string;
}

/**
 * Searches the Word document and returns the top 3 matches with paragraph context.
 * Only works when the add-in is running inside Word.
 */
export async function searchWordDocument(
  query: string,
  options: WordSearchOptions
): Promise<SearchResultItem[]> {
  if (typeof Word === "undefined") {
    return [];
  }

  const trimmed = query.trim();
  if (!trimmed) return [];

  return new Promise((resolve, reject) => {
    Word.run(function (context) {
      const searchResults = context.document.body.search(trimmed, {
        matchCase: options.matchCase,
      });
      searchResults.load("items");
      return context.sync().then(function () {
        const items = searchResults.items;
        const top3 = items.slice(0, 3);
        const paragraphs: { text?: string }[] = [];
        top3.forEach(function (range) {
          range.load("text");
          const para = range.paragraphs.getFirst();
          para.load("text");
          paragraphs.push(para);
        });
        return context.sync().then(function () {
          const results: SearchResultItem[] = top3.map(function (range, i) {
            return {
              paragraphText: paragraphs[i].text || "",
              matchText: range.text || "",
            };
          });
          resolve(results);
        });
      });
    }).catch(function (err) {
      console.error("Word search error:", err);
      reject(err);
    });
  });
}

/**
 * Selects and highlights the Nth search result (0-based index) in the document.
 * Call after searchWordDocument; uses the same query and options to find the same match.
 */
export function selectAndHighlightResult(
  query: string,
  options: WordSearchOptions,
  resultIndex: number
): Promise<void> {
  if (typeof Word === "undefined") {
    return Promise.reject(new Error("Word API not available. Open the add-in inside Word."));
  }

  const trimmed = query.trim();
  if (!trimmed) return Promise.reject(new Error("Query is empty."));

  return new Promise((resolve, reject) => {
    Word.run(function (context) {
      const searchResults = context.document.body.search(trimmed, {
        matchCase: options.matchCase,
      });
      searchResults.load("items");
      return context.sync().then(function () {
        const items = searchResults.items;
        if (resultIndex < 0 || resultIndex >= items.length) {
          reject(new Error("Invalid result index."));
          return context.sync();
        }
        const range = items[resultIndex];
        range.select();
        range.font.highlightColor = "#FFFF00";
        return context.sync();
      });
    })
      .then(function () {
        resolve();
      })
      .catch(function (err) {
        console.error("Word select/highlight error:", err);
        reject(err);
      });
  });
}

/**
 * Returns true if the Word API is available (add-in is running inside Word).
 */
export function isWordAvailable(): boolean {
  return typeof Word !== "undefined";
}

/**
 * Inserts sample paragraphs into the document so you can test search.
 * Call this when the add-in is running inside Word, then search for:
 * "Employee", "Employer", "Contract", or "termination" to see results.
 */
export function insertSampleContent(): Promise<void> {
  if (typeof Word === "undefined") {
    return Promise.reject(new Error("Word API not available. Open the add-in inside Word."));
  }

  const sampleParagraphs = [
    "EMPLOYMENT AGREEMENT – This Contract of Hiring is entered into as of the Effective Date between the Employer and the Employee. The Employee agrees to perform the duties set forth herein.",
    "COMPENSATION: The Employer shall pay the Employee a base salary as set forth in Schedule A. Payment shall be made bi-weekly. The Employee shall be eligible for benefits in accordance with company policy.",
    "TERM AND TERMINATION: This agreement shall remain in effect until terminated. Either party may terminate this Contract with thirty (30) days written notice. The Employee shall return all company property upon termination. Hire me",
  ];

  return new Promise((resolve, reject) => {
    Word.run(function (context) {
      const body = context.document.body;
      sampleParagraphs.forEach(function (text) {
        body.insertParagraph(text, "End");
      });
      return context.sync();
    })
      .then(function () {
        resolve();
      })
      .catch(function (err) {
        console.error("Insert sample content error:", err);
        reject(err);
      });
  });
}
