import React from "react";
import EmailChip from "./EmailChip";
import EmailSuggestionDropdown from "./EmailSuggestionDropdown";

export interface EmailInputFieldProps {
  chips: { id: string; email: string }[];
  overflowCount?: number;
  onOverflowMouseEnter?: () => void;
  onOverflowMouseLeave?: () => void;
  inputValue: string;
  suggestions: string[];
  showSuggestions: boolean;
  onInputChange: (value: string) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
  onInputClick?: () => void;
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
  onOverflowMouseEnter,
  onOverflowMouseLeave,
  inputValue,
  suggestions,
  showSuggestions,
  onInputChange,
  onInputFocus,
  onInputBlur,
  onInputClick,
  onRemoveChip,
  onSelectSuggestion,
  placeholder = "Add emails…",
}) => {
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
      <div
        role="presentation"
        className="email-input-row"
        onClick={onInputClick}
        style={{
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "center",
          minHeight: "40px",
          padding: "6px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          backgroundColor: "#fff",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        {chips.map((chip) => (
          <EmailChip
            key={chip.id}
            email={chip.email}
            onRemove={() => onRemoveChip(chip.id)}
            noMarginBottom
          />
        ))}
        {overflowCount > 0 && (
          <span
            role="button"
            tabIndex={0}
            onMouseEnter={onOverflowMouseEnter}
            onMouseLeave={onOverflowMouseLeave}
            style={{
              display: "inline-flex",
              alignItems: "center",
              flexShrink: 0,
              padding: "6px 12px",
              marginRight: "6px",
              marginBottom: 0,
              borderRadius: "6px",
              backgroundColor: "#dfe8f7",
              color: "#344054",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              border: "none",
            }}
          >
            +{overflowCount}
          </span>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onClick={onInputClick}
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
