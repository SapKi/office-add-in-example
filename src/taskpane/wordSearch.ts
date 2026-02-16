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
