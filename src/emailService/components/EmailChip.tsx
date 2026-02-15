import React from "react";

export interface EmailChipProps {
  email: string;
  onRemove: () => void;
  /** "primary" = modal chip style (#dfe8f7) */
  variant?: "default" | "primary";
  /** Set true in single-line input to avoid extra row height */
  noMarginBottom?: boolean;
}

/**
 * Single email chip with remove (x) action. Child notifies parent via onRemove.
 */
const EmailChip: React.FC<EmailChipProps> = ({ email, onRemove, variant = "default", noMarginBottom = false }) => {
  const isPrimary = variant === "primary";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        borderRadius: "6px",
        backgroundColor: "#dfe8f7",
        color: isPrimary ? "#344054" : "#1f2937",
        fontSize: "14px",
        fontWeight: isPrimary ? 500 : 400,
        marginRight: "6px",
        marginBottom: noMarginBottom ? 0 : "6px",
        flexShrink: 0,
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
          color: isPrimary ? "#344054" : "#6b7280",
          fontSize: "16px",
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </span>
  );
};

export default EmailChip;
