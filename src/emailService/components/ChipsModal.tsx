import React, { useEffect } from "react";
import EmailChip from "./EmailChip";

export interface ChipsModalProps {
  chips: { id: string; email: string }[];
  onRemoveChip: (id: string) => void;
  onClose: () => void;
}

/**
 * Small modal that lists all selected email chips. Used when many emails are chosen
 * so the main input shows only a few chips + "+N" pill.
 */
const ChipsModal: React.FC<ChipsModalProps> = ({ chips, onRemoveChip, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      />
      <div
        role="dialog"
        aria-label="Selected emails"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: "420px",
          maxHeight: "70vh",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 16px 8px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#111" }}>
            Selected emails ({chips.length})
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              padding: "4px 8px",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "#6b7280",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>
        <div
          style={{
            padding: "12px 16px 16px",
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            alignContent: "flex-start",
          }}
        >
          {chips.map((chip) => (
            <EmailChip
              key={chip.id}
              email={chip.email}
              onRemove={() => onRemoveChip(chip.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ChipsModal;
