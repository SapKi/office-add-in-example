import React from "react";

export interface EmailChipProps {
  email: string;
  onRemove: () => void;
}

/**
 * Single email chip with remove (x) action. Child notifies parent via onRemove.
 */
const EmailChip: React.FC<EmailChipProps> = ({ email, onRemove }) => {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        borderRadius: "16px",
        backgroundColor: "#e5e7eb",
        color: "#374151",
        fontSize: "14px",
        marginRight: "6px",
        marginBottom: "6px",
      }}
    >
      {email}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${email}`}
        style={{
          marginLeft: "2px",
          padding: 0,
          border: "none",
          background: "none",
          cursor: "pointer",
          color: "#6b7280",
          fontSize: "14px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </span>
  );
};

export default EmailChip;
