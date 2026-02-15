/**
 * Word document search using the Word JavaScript API.
 * Returns the text of the first 3 matches (top 3 search results).
 */

/* global Word */

export interface WordSearchOptions {
  matchCase: boolean;
}

/**
 * Searches the Word document for the given query and returns the text of the top 3 matches.
 * Only works when the add-in is running inside Word.
 */
export async function searchWordDocument(
  query: string,
  options: WordSearchOptions
): Promise<string[]> {
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
        top3.forEach(function (range) {
          range.load("text");
        });
        return context.sync().then(function () {
          const texts = top3.map(function (range) {
            return range.text || "";
          });
          resolve(texts);
        });
      });
    }).catch(function (err) {
      console.error("Word search error:", err);
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
