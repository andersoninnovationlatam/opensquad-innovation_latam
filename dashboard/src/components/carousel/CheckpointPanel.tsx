import { useState } from "react";
import { DriveButton } from "./DriveButton";

interface CheckpointPanelProps {
  type: "artbrief" | "final";
  content: string | null;
  stepLabel: string;
  reviewScore?: string;
  onApprove: (editedContent?: string) => void;
  isSubmitting: boolean;
}

const STEP_LABELS: Record<string, string> = {
  "checkpoint-approve-art-brief": "Aprovar Brief Visual",
  "checkpoint-final-approval": "Aprovação Final",
};

export function CheckpointPanel({
  type,
  content,
  stepLabel,
  reviewScore,
  onApprove,
  isSubmitting,
}: CheckpointPanelProps) {
  const [editedText, setEditedText] = useState(content ?? "");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const isModified = editedText !== (content ?? "");
  const title = STEP_LABELS[stepLabel] ?? stepLabel;

  const btnBase: React.CSSProperties = {
    fontFamily: "inherit",
    fontSize: 12,
    fontWeight: 600,
    padding: "8px 18px",
    borderRadius: 3,
    cursor: isSubmitting ? "not-allowed" : "pointer",
    transition: "all 0.15s",
    border: "1px solid",
  };

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        borderTop: "3px solid var(--accent-amber)",
        borderRadius: 4,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        animation: "checkpoint-pulse 2s ease-in-out infinite",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>⏸</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>
          {title}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--accent-amber)",
            border: "1px solid var(--accent-amber)",
            borderRadius: 3,
            padding: "2px 8px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          Aguardando aprovação
        </span>
      </div>

      {/* Final approval: show review score */}
      {type === "final" && reviewScore && (
        <div
          style={{
            background: "var(--bg-sidebar)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: "12px 16px",
            fontSize: 12,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          <span style={{ color: "var(--accent-green)", fontWeight: 600 }}>Rosa Revisão:</span>{" "}
          {reviewScore}
        </div>
      )}

      {/* Content textarea (artbrief only) */}
      {type === "artbrief" && (
        <div>
          <label
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "var(--text-secondary)",
              marginBottom: 6,
              display: "block",
            }}
          >
            Brief Visual
            {isModified && (
              <span
                style={{
                  marginLeft: 8,
                  color: "var(--accent-amber)",
                  fontSize: 9,
                }}
              >
                ● modificado
              </span>
            )}
          </label>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            disabled={isSubmitting}
            style={{
              width: "100%",
              minHeight: 280,
              background: "var(--bg-sidebar)",
              border: `1px solid ${isModified ? "var(--accent-amber)" : "var(--border)"}`,
              borderRadius: 4,
              color: "var(--text-primary)",
              fontFamily: "inherit",
              fontSize: 12,
              padding: "10px 14px",
              resize: "vertical",
              lineHeight: 1.7,
              outline: "none",
            }}
          />
        </div>
      )}

      {/* Feedback field */}
      {showFeedback && (
        <div>
          <label
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: "var(--text-secondary)",
              marginBottom: 6,
              display: "block",
            }}
          >
            Instruções de Ajuste
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Descreva o que deve ser alterado..."
            style={{
              width: "100%",
              minHeight: 80,
              background: "var(--bg-sidebar)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              color: "var(--text-primary)",
              fontFamily: "inherit",
              fontSize: 12,
              padding: "8px 12px",
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => {
            if (showFeedback && feedbackText.trim()) {
              onApprove(feedbackText.trim());
            } else if (isModified) {
              onApprove(editedText);
            } else {
              onApprove();
            }
          }}
          disabled={isSubmitting}
          style={{
            ...btnBase,
            background: isModified ? "var(--accent-amber)" : "var(--accent-green)",
            borderColor: isModified ? "var(--accent-amber)" : "var(--accent-green)",
            color: "var(--bg-primary)",
          }}
        >
          {isSubmitting
            ? "Enviando..."
            : showFeedback
            ? "Enviar Ajustes"
            : isModified
            ? "Aprovar com Edições"
            : "✓ Aprovar"}
        </button>

        {type !== "final" && !showFeedback && (
          <button
            onClick={() => setShowFeedback(true)}
            disabled={isSubmitting}
            style={{
              ...btnBase,
              background: "transparent",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            Solicitar Ajustes
          </button>
        )}

        {showFeedback && (
          <button
            onClick={() => {
              setShowFeedback(false);
              setFeedbackText("");
            }}
            disabled={isSubmitting}
            style={{
              ...btnBase,
              background: "transparent",
              borderColor: "var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Drive button for final step */}
      {type === "final" && (
        <div style={{ marginTop: 8 }}>
          <DriveButton />
        </div>
      )}
    </div>
  );
}
