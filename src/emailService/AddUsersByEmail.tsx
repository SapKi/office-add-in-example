import React, { useCallback, useEffect, useState } from "react";
import { fetchSuggestedEmails, submitAddUsersByEmail } from "./api";
import type { AddUsersByEmailCallbacks } from "./types";
import EmailInputField from "./components/EmailInputField";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function generateId(): string {
  return Math.random().toString(36).slice(2);
}

export interface AddUsersByEmailProps extends AddUsersByEmailCallbacks {
  className?: string;
}

/**
 * Parent component for adding users by email.
 * - Holds email list state and passes callbacks to children (EmailInputField, chips).
 * - Children communicate back via onRemoveChip, onSelectSuggestion, onInputChange.
 * - Parent notifies page via onEmailsChange and onSubmit.
 */
const AddUsersByEmail: React.FC<AddUsersByEmailProps> = ({
  onEmailsChange,
  onSubmit,
  className,
}) => {
  const [chips, setChips] = useState<{ id: string; email: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const emailList = chips.map((c) => c.email);

  useEffect(() => {
    onEmailsChange?.(emailList);
  }, [emailList.join(",")]);

  const loadSuggestions = useCallback(async () => {
    const list = await fetchSuggestedEmails();
    const existing = new Set(chips.map((c) => c.email));
    setSuggestions(list.filter((e) => !existing.has(e)));
  }, [chips]);

  useEffect(() => {
    if (showSuggestions) loadSuggestions();
  }, [showSuggestions]);

  const addEmail = useCallback((email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;
    if (!EMAIL_REGEX.test(trimmed)) return;
    setChips((prev) => {
      if (prev.some((c) => c.email === trimmed)) return prev;
      return [...prev, { id: generateId(), email: trimmed }];
    });
    setInputValue("");
    setSuggestions((s) => s.filter((e) => e !== trimmed));
  }, []);

  const removeChip = useCallback((id: string) => {
    setChips((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      if (value.includes(",") || value.includes(" ") || value.includes("\n")) {
        value
          .split(/[\s,\n]+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((e) => addEmail(e));
        setInputValue("");
      }
    },
    [addEmail]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (inputValue.trim()) addEmail(inputValue);
      }
    },
    [inputValue, addEmail]
  );

  const handleSubmit = useCallback(async () => {
    const emails = chips.map((c) => c.email);
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && EMAIL_REGEX.test(trimmed)) emails.push(trimmed);
    if (emails.length === 0) return;
    onSubmit?.(emails);
    await submitAddUsersByEmail(emails);
    setChips([]);
    setInputValue("");
  }, [chips, inputValue, onSubmit]);

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{ flex: 1, minWidth: "280px" }}
        onKeyDown={handleKeyDown}
      >
        <EmailInputField
          chips={chips}
          inputValue={inputValue}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onInputChange={handleInputChange}
          onInputFocus={() => setShowSuggestions(true)}
          onInputBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onRemoveChip={removeChip}
          onSelectSuggestion={addEmail}
          placeholder="Add emails…"
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        style={{
          padding: "8px 20px",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Add Users ({chips.length + (inputValue.trim() ? 1 : 0)})
      </button>
    </div>
  );
};

export default AddUsersByEmail;
