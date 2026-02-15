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
        left: 0,
        right: 0,
        bottom: "100%",
        marginBottom: "4px",
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        maxHeight: "200px",
        overflowY: "auto",
        zIndex: 20,
        padding: "8px 12px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        {chips.map((chip) => (
          <div key={chip.id} style={{ display: "flex", alignItems: "center" }}>
            <EmailChip
              email={chip.email}
              onRemove={() => onRemoveChip(chip.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChipsPopover;
