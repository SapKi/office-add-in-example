import React from "react";
import EmailChip from "./EmailChip";
import EmailSuggestionDropdown from "./EmailSuggestionDropdown";

export interface EmailInputFieldProps {
  chips: { id: string; email: string }[];
  overflowCount?: number;
  onOverflowClick?: () => void;
  inputValue: string;
  suggestions: string[];
  showSuggestions: boolean;
  onInputChange: (value: string) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
  onRemoveChip: (id: string) => void;
  onSelectSuggestion: (email: string) => void;
  placeholder?: string;
}

/**
 * Input area that displays email chips and an optional suggestion dropdown.
 * Communicates with parent via callbacks (onInputChange, onRemoveChip, onSelectSuggestion).
 */
const EmailInputField: React.FC<EmailInputFieldProps> = ({
  chips,
  overflowCount = 0,
  onOverflowClick,
  inputValue,
  suggestions,
  showSuggestions,
  onInputChange,
  onInputFocus,
  onInputBlur,
  onRemoveChip,
  onSelectSuggestion,
  placeholder = "Add emails…",
}) => {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          minHeight: "40px",
          padding: "6px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        {chips.map((chip) => (
          <EmailChip
            key={chip.id}
            email={chip.email}
            onRemove={() => onRemoveChip(chip.id)}
          />
        ))}
        {overflowCount > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onOverflowClick?.();
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 10px",
              marginRight: "6px",
              marginBottom: "6px",
              borderRadius: "16px",
              backgroundColor: "#e5e7eb",
              color: "#374151",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            +{overflowCount}
          </button>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          placeholder={chips.length === 0 && overflowCount === 0 ? placeholder : ""}
          style={{
            flex: 1,
            minWidth: "120px",
            border: "none",
            outline: "none",
            fontSize: "14px",
            padding: "4px 0",
          }}
        />
      </div>
      <EmailSuggestionDropdown
        suggestions={suggestions}
        onSelect={onSelectSuggestion}
        visible={showSuggestions}
      />
    </div>
  );
};

export default EmailInputField;
