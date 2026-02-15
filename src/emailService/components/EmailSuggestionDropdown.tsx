import React from "react";

export interface EmailSuggestionDropdownProps {
  suggestions: string[];
  onSelect: (email: string) => void;
  onRemoveSuggestion?: (email: string) => void;
  visible: boolean;
  style?: React.CSSProperties;
}

/**
 * Dropdown showing email suggestions. Child notifies parent via onSelect.
 */
const EmailSuggestionDropdown: React.FC<EmailSuggestionDropdownProps> = ({
  suggestions,
  onSelect,
  visible,
  style = {},
}) => {
  if (!visible || suggestions.length === 0) return null;

  return (
    <div
      role="listbox"
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        marginTop: "4px",
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        maxHeight: "200px",
        overflowY: "auto",
        zIndex: 10,
        ...style,
      }}
    >
      {suggestions.map((email) => (
        <button
          key={email}
          type="button"
          role="option"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(email);
          }}
          style={{
            display: "block",
            width: "100%",
            padding: "8px 12px",
            border: "none",
            background: "none",
            textAlign: "left",
            cursor: "pointer",
            fontSize: "14px",
            color: "#374151",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {email}
        </button>
      ))}
    </div>
  );
};

export default EmailSuggestionDropdown;
