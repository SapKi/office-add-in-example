/**
 * Dummy API for email service. Replace with real API when available.
 */

/** Dummy suggested/recent emails for the dropdown */
const DUMMY_SUGGESTED_EMAILS: string[] = [
  "sarah.chen@company.com",
  "michael.johnson@acme.io",
  "jessica.williams@startup.co",
  "david.kim@legal-firm.com",
  "emma.rodriguez@consulting.org",
  "james.wilson@finance.com",
  "olivia.brown@hr-partners.com",
  "alex.martinez@design-studio.com",
  "sophia.anderson@tech-corp.com",
  "daniel.taylor@operations.io",
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
