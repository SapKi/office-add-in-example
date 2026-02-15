# Email Service – User Creation by Email (Take-Home Assignment)

This module implements the **user input component** for adding users by email, with bi-directional parent–child communication.

---

## Task 1 – Requirements Coverage

| Requirement | Implementation |
|-------------|----------------|
| **Bi-sided communication (parent ↔ child)** | **Parent (`AddUsersByEmail`):** Owns state (chips, inputValue, suggestions). Passes callbacks to children. **Children:** `EmailInputField` → `EmailChip`, `EmailSuggestionDropdown`; `ChipsPopover` → `EmailChip`. Children call `onRemoveChip`, `onSelectSuggestion`, `onInputChange`, `onOverflowMouseEnter/Leave`. Parent also exposes `onEmailsChange` and `onSubmit` to the page. |
| **Component = input area only** | `AddUsersByEmail` is the input area (chips + input + “Add Users” button). The full page (table, sidebar) lives in `SettingsPage` and uses this component. |
| **On submit: log / dummy API** | `handleSubmit` calls `onSubmit?.(emails)` (page callback) and `submitAddUsersByEmail(emails)` in `api.ts`, which logs to console and can be replaced with a real API. |
| **Design (Figma)** | Input with email chips, “+N” overflow pill, suggestion dropdown, popover on hover for overflow emails; styling aligned with provided Figma (colors, square chips, etc.). |

---

## Bi-Directional Communication

- **Parent → child:** Props (e.g. `chips`, `inputValue`, `suggestions`, `onRemoveChip`, `onSelectSuggestion`, `onInputChange`).
- **Child → parent:** Callbacks invoked by children (`onRemoveChip(id)`, `onSelectSuggestion(email)`, `onInputChange(value)`, etc.).
- **Parent → page:** Optional `onEmailsChange(emails)` and `onSubmit(emails)`.

---

## Sub-Components

- **`AddUsersByEmail`** – Parent; state + submit logic.
- **`EmailInputField`** – Chips + input + “+N” pill + suggestion dropdown container.
- **`EmailChip`** – Single email pill with remove (×).
- **`EmailSuggestionDropdown`** – Suggestion list (e.g. from API).
- **`ChipsPopover`** – Overflow list on hover over “+N”.

---

## Replacing Dummy API with Real Fetch

In **`api.ts`**:

1. **Suggested emails** – Replace `fetchSuggestedEmails()` body with your endpoint, e.g.:
   ```ts
   const res = await fetch('/api/users/suggested-emails');
   const data = await res.json();
   return data.emails; // or data
   ```

2. **Submit / invite** – Replace `submitAddUsersByEmail(emails)` body with:
   ```ts
   await fetch('/api/users/invite', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ emails }),
   });
   ```

The component continues to call these functions; only the implementation in `api.ts` needs to change.

---

## Usage

```tsx
import { AddUsersByEmail } from "./emailService";

<AddUsersByEmail
  existingEmails={users.map((u) => u.email)}  // optional: exclude from suggestions
  onEmailsChange={(emails) => { /* optional */ }}
  onSubmit={(emails) => { /* optional: e.g. add to list */ }}
/>
```

The screen recording was not viewable; the behaviour above (add by email, suggestions, overflow “+N”, popover, submit → console/dummy API) is intended to match the assignment and Figma.
