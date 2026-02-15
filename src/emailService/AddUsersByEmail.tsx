import React, { useCallback, useEffect, useRef, useState } from "react";
import { fetchSuggestedEmails, submitAddUsersByEmail } from "./api";
import type { AddUsersByEmailCallbacks } from "./types";
import EmailInputField from "./components/EmailInputField";
import ChipsPopover from "./components/ChipsPopover";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CHIP_WIDTH_BASE = 24;
const CHIP_WIDTH_PER_CHAR = 7;
const INPUT_PADDING = 20;
const MIN_INPUT_WIDTH = 80;
const PLUS_N_RESERVE = 40;

function getVisibleCount(chips: { id: string; email: string }[], containerWidth: number): number {
  if (containerWidth <= 0) return chips.length;
  const baseReserve = containerWidth - INPUT_PADDING - MIN_INPUT_WIDTH;
  if (baseReserve <= 0) return 0;
  let total = 0;
  for (let i = 0; i < chips.length; i++) {
    const w = CHIP_WIDTH_BASE + chips[i].email.length * CHIP_WIDTH_PER_CHAR;
    if (total + w > baseReserve) {
      if (i === 0) return 0;
      const withPlus = baseReserve - PLUS_N_RESERVE;
      total = 0;
      for (let j = 0; j < chips.length; j++) {
        const wj = CHIP_WIDTH_BASE + chips[j].email.length * CHIP_WIDTH_PER_CHAR;
        if (total + wj > withPlus) return j;
        total += wj;
      }
      return chips.length;
    }
    total += w;
  }
  return chips.length;
}

function generateId(): string {
  return Math.random().toString(36).slice(2);
}

export interface AddUsersByEmailProps extends AddUsersByEmailCallbacks {
  className?: string;
  /** Emails already in the users table; suggestions exclude these until the user is deleted. */
  existingEmails?: string[];
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
  existingEmails = [],
}) => {
  const [chips, setChips] = useState<{ id: string; email: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleCount = getVisibleCount(chips, containerWidth);
  const visibleChips = chips.slice(0, visibleCount);
  const overflowCount = chips.length - visibleCount;
  const overflowChips = overflowCount > 0 ? chips.slice(visibleCount) : [];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const updateWidth = () => setContainerWidth(el.getBoundingClientRect().width);
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const schedulePopoverClose = useCallback(() => {
    if (popoverCloseTimeoutRef.current) clearTimeout(popoverCloseTimeoutRef.current);
    popoverCloseTimeoutRef.current = setTimeout(() => setPopoverOpen(false), 150);
  }, []);

  const cancelPopoverClose = useCallback(() => {
    if (popoverCloseTimeoutRef.current) {
      clearTimeout(popoverCloseTimeoutRef.current);
      popoverCloseTimeoutRef.current = null;
    }
  }, []);

  const handleOverflowMouseEnter = useCallback(() => {
    cancelPopoverClose();
    setPopoverOpen(true);
  }, [cancelPopoverClose]);

  const handleOverflowMouseLeave = useCallback(() => {
    schedulePopoverClose();
  }, [schedulePopoverClose]);

  const handlePopoverMouseEnter = useCallback(() => {
    cancelPopoverClose();
  }, [cancelPopoverClose]);

  const handlePopoverMouseLeave = useCallback(() => {
    schedulePopoverClose();
  }, [schedulePopoverClose]);

  const emailList = chips.map((c) => c.email);

  useEffect(() => {
    onEmailsChange?.(emailList);
  }, [emailList.join(",")]);

  const loadSuggestions = useCallback(async () => {
    const list = await fetchSuggestedEmails();
    const fromChips = chips.map((c) => c.email.toLowerCase());
    const fromTable = existingEmails.map((e) => e.trim().toLowerCase());
    const existing = fromChips.concat(fromTable);
    setSuggestions(list.filter((e) => existing.indexOf(e.trim().toLowerCase()) === -1));
  }, [chips, existingEmails]);

  useEffect(() => {
    if (showSuggestions) loadSuggestions();
  }, [showSuggestions, loadSuggestions]);

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
    setShowSuggestions(false);
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
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
      }}
    >
      <div
        ref={containerRef}
        style={{ flex: 1, minWidth: "280px", position: "relative" }}
        onKeyDown={handleKeyDown}
      >
        <EmailInputField
          chips={visibleChips}
          overflowCount={overflowCount}
          onOverflowMouseEnter={handleOverflowMouseEnter}
          onOverflowMouseLeave={handleOverflowMouseLeave}
          inputValue={inputValue}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          onInputChange={handleInputChange}
          onInputFocus={() => setShowSuggestions(true)}
          onInputBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onInputClick={() => setShowSuggestions(true)}
          onRemoveChip={removeChip}
          onSelectSuggestion={addEmail}
          placeholder="Add emails…"
        />
        {popoverOpen && overflowCount > 0 && (
          <ChipsPopover
            chips={overflowChips}
            onRemoveChip={removeChip}
            onMouseEnter={handlePopoverMouseEnter}
            onMouseLeave={handlePopoverMouseLeave}
          />
        )}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        style={{
          padding: "8px 20px",
          marginTop: "4px",
          backgroundColor: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
          alignSelf: "center",
        }}
      >
        Add Users ({chips.length + (inputValue.trim() ? 1 : 0)})
      </button>
    </div>
  );
};

export default AddUsersByEmail;
