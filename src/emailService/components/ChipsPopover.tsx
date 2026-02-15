import React from "react";
import EmailChip from "./EmailChip";

export interface ChipsPopoverProps {
  chips: { id: string; email: string }[];
  onRemoveChip: (id: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * Figma-style popover: panel above the input with vertical list of email pills.
 * Shown on hover over the "+N" element; stays open while hovering popover.
 */
const ChipsPopover: React.FC<ChipsPopoverProps> = ({
  chips,
  onRemoveChip,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      role="dialog"
      aria-label="Selected emails"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: "absolute",
        right: 0,
        bottom: "100%",
        marginBottom: "6px",
        width: "380px",
        maxWidth: "calc(100vw - 32px)",
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        maxHeight: "260px",
        overflowY: "auto",
        zIndex: 20,
        padding: "12px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 10px",
          alignContent: "flex-start",
        }}
      >
        {chips.map((chip) => (
          <EmailChip
            key={chip.id}
            email={chip.email}
            onRemove={() => onRemoveChip(chip.id)}
            variant="primary"
          />
        ))}
      </div>
    </div>
  );
};

export default ChipsPopover;
