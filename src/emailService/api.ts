/**
 * Dummy API for email service. Replace with real API when available.
 */

/** Dummy suggested/recent emails for the dropdown */
const DUMMY_SUGGESTED_EMAILS: string[] = [
  "email@example.long.com",
  "email@long.com",
  "user@company.com",
  "admin@example.com",
  "member@team.org",
];

/**
 * Fetches suggested emails (e.g. recent or from API). Dummy implementation.
 */
export async function fetchSuggestedEmails(): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [...DUMMY_SUGGESTED_EMAILS];
}

/**
 * Submits list of emails to add users. Dummy implementation - logs to console.
 */
export async function submitAddUsersByEmail(emails: string[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 200));
  console.log("[emailService] Add users by email:", emails);
  // In real app: return fetch('/api/users/invite', { method: 'POST', body: JSON.stringify({ emails }) });
}
