/**
 * Email service types for user creation by email.
 */

export interface EmailChipItem {
  id: string;
  email: string;
}

export interface UserRow {
  id: string;
  userName: string;
  email: string;
  status: "Active" | "Inactive";
  addedOn: string;
  role: "Admin" | "Member" | "Viewer";
}

export interface AddUsersByEmailCallbacks {
  onEmailsChange?: (emails: string[]) => void;
  onSubmit?: (emails: string[]) => void;
}
