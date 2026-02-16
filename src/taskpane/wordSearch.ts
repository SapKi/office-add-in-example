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
 * Inserts long, varied sample paragraphs into the document so you can test search.
 * Try searching for: Employee, Employer, Contract, termination, salary, benefits,
 * confidentiality, notice, duties, compensation, schedule, policy, property, etc.
 */
export function insertSampleContent(): Promise<void> {
  if (typeof Word === "undefined") {
    return Promise.reject(new Error("Word API not available. Open the add-in inside Word."));
  }

  const sampleParagraphs = [
    "EMPLOYMENT AGREEMENT – This Contract of Hiring is entered into as of the Effective Date between the Employer and the Employee. The Employee agrees to perform the duties set forth herein and to devote full time and best efforts to the business of the Employer.",
    "DEFINITIONS: For the purposes of this agreement, the term \"Employer\" means the company and its affiliates. The term \"Employee\" refers to the individual signing below. The term \"Effective Date\" means the first day of employment. All references to compensation, benefits, and policies are subject to the schedules attached hereto.",
    "TITLE AND DUTIES: The Employee shall serve in the capacity of [Title]. The Employee shall report to [Supervisor] and shall perform such duties as are customarily associated with the position and as may be assigned from time to time by the Employer. The Employee agrees to comply with all applicable policies and procedures of the Employer.",
    "COMPENSATION: The Employer shall pay the Employee a base salary as set forth in Schedule A. Payment shall be made bi-weekly in arrears. The salary shall be reviewed annually and may be adjusted at the sole discretion of the Employer. The Employee shall be eligible for benefits in accordance with company policy as described in Schedule B.",
    "BONUS AND INCENTIVES: The Employee may be eligible to participate in annual bonus and incentive plans as established by the Employer. Any bonus payment shall be discretionary and subject to the achievement of performance goals and the continued employment of the Employee through the payment date.",
    "BENEFITS: The Employee shall be eligible to participate in all benefit plans generally available to similarly situated employees of the Employer, including but not limited to health insurance, dental and vision coverage, retirement plans, and paid time off. Eligibility and terms are governed by the applicable plan documents and company policy.",
    "WORK SCHEDULE: The Employee's normal work schedule shall be as determined by the Employer. The Employee may be required to work additional hours, including evenings and weekends, as necessary to fulfill the duties of the position. Travel may be required from time to time.",
    "CONFIDENTIALITY: The Employee agrees to hold in strict confidence all confidential information of the Employer, including trade secrets, business plans, customer lists, and financial data. This obligation shall survive the termination of employment for a period of three (3) years. The Employee shall not disclose or use such information except as required in the performance of duties.",
    "INTELLECTUAL PROPERTY: All inventions, developments, and works of authorship created by the Employee during the term of employment that relate to the business of the Employer shall be the sole property of the Employer. The Employee agrees to assign all such rights to the Employer and to cooperate in securing any necessary patents or copyrights.",
    "NON-COMPETITION AND NON-SOLICITATION: During the term of employment and for twelve (12) months following termination, the Employee shall not compete with the Employer within the geographic area and business lines described in Schedule C. The Employee further agrees not to solicit the Employer's employees or customers during such period.",
    "TERM AND TERMINATION: This agreement shall remain in effect until terminated. Either party may terminate this Contract with thirty (30) days written notice. The Employer may terminate the Employee immediately for cause, including but not limited to breach of this agreement, misconduct, or failure to perform duties. Upon termination, the Employee shall return all company property, including documents, keys, and equipment.",
    "SEVERANCE: In the event of termination without cause, the Employee may be entitled to severance pay and continued benefits as set forth in Schedule D. Severance is contingent upon the Employee's execution of a release of claims and compliance with the post-employment obligations in this agreement.",
    "GOVERNING LAW AND DISPUTES: This agreement shall be governed by the laws of the state in which the Employer's principal office is located. Any dispute arising out of or relating to this agreement or the employment relationship shall be resolved by binding arbitration in accordance with the rules of the American Arbitration Association.",
    "ENTIRE AGREEMENT: This document, together with the schedules and any written amendments signed by both parties, constitutes the entire agreement between the Employer and the Employee regarding the subject matter hereof and supersedes all prior negotiations, representations, and agreements. No modification shall be effective unless in writing and signed by both parties.",
    "ACKNOWLEDGMENT: By signing below, the Employee acknowledges that he or she has read and understood this agreement, has had the opportunity to seek legal advice, and agrees to be bound by its terms. The Employer and the Employee have executed this Contract of Hiring as of the date first written above.",
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
