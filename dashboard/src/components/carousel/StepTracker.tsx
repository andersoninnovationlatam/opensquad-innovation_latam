import { PIPELINE_STEPS } from "@/types/carousel";
import type { SquadState } from "@/types/state";

interface StepTrackerProps {
  currentStep: number;
  squadState: SquadState | null;
  autoApprovedStep?: number | null;
}

function getStepStatus(
  stepNumber: number,
  currentStep: number,
  squadStatus: string | undefined,
  autoApprovedStep: number | null | undefined
) {
  if (stepNumber < currentStep) return "done";
  if (stepNumber === currentStep) {
    if (autoApprovedStep === stepNumber) return "auto-approved";
    if (squadStatus === "checkpoint") return "checkpoint-waiting";
    return "active";
  }
  return "pending";
}

function StepNode({
  step,
  status,
  agentName,
}: {
  step: (typeof PIPELINE_STEPS)[number];
  status: string;
  agentName?: string;
}) {
  const circleColor = {
    done: "var(--accent-cyan)",
    active: "var(--accent-green)",
    "checkpoint-waiting": "var(--accent-amber)",
    "auto-approved": "var(--accent-cyan)",
    pending: "transparent",
  }[status] ?? "transparent";

  const circleBorder = {
    done: "var(--accent-cyan)",
    active: "var(--accent-green)",
    "checkpoint-waiting": "var(--accent-amber)",
    "auto-approved": "var(--accent-cyan)",
    pending: "var(--border)",
  }[status] ?? "var(--border)";

  const innerContent = () => {
    if (status === "done" || status === "auto-approved") return "✓";
    if (status === "auto-approved") return "⚡";
    if (status === "checkpoint-waiting" && step.isCheckpoint) return "⏳";
    if (status === "active" && step.agentIcon) return step.agentIcon;
    if (status === "pending" && step.isCheckpoint) return "🔒";
    return String(step.number);
  };

  const isAutoApproved = status === "auto-approved";
  const isPulsing =
    status === "checkpoint-waiting" || status === "active";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        minWidth: 64,
        maxWidth: 80,
        opacity: status === "pending" ? 0.35 : 1,
        transition: "opacity 0.4s ease",
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: status === "pending" ? "transparent" : circleColor,
          border: `2px solid ${circleBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: status === "active" && step.agentIcon ? 16 : 11,
          color:
            status === "pending"
              ? "var(--text-secondary)"
              : status === "done" || status === "auto-approved"
              ? "var(--bg-primary)"
              : "var(--bg-primary)",
          fontWeight: 700,
          transition: "all 0.3s ease",
          boxShadow:
            status === "checkpoint-waiting"
              ? "0 0 8px var(--accent-amber)"
              : status === "active"
              ? "0 0 8px var(--accent-green)"
              : "none",
          animation: isPulsing ? "pulse 1.5s ease-in-out infinite" : "none",
          flexShrink: 0,
        }}
      >
        {innerContent()}
      </div>

      <span
        style={{
          fontSize: 9,
          color:
            status === "pending"
              ? "var(--text-secondary)"
              : "var(--text-primary)",
          textAlign: "center",
          lineHeight: 1.3,
          maxWidth: 72,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {isAutoApproved ? "⚡ " : ""}{step.label}
      </span>

      {agentName && (status === "active" || status === "done") && (
        <span
          style={{
            fontSize: 9,
            color: "var(--text-secondary)",
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          {agentName}
        </span>
      )}
    </div>
  );
}

export function StepTracker({
  currentStep,
  squadState,
  autoApprovedStep,
}: StepTrackerProps) {
  const agentMap: Record<string, string> = {};
  for (const agent of squadState?.agents ?? []) {
    agentMap[agent.id] = `${agent.icon ?? ""} ${agent.name}`.trim();
  }

  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-sidebar)",
        padding: "16px 20px",
        overflowX: "auto",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 0,
          minWidth: "max-content",
        }}
      >
        {PIPELINE_STEPS.map((step, idx) => {
          const status = getStepStatus(
            step.number,
            currentStep,
            squadState?.status,
            autoApprovedStep
          );
          const agentName = step.agentId ? agentMap[step.agentId] : undefined;

          return (
            <div
              key={step.number}
              style={{ display: "flex", alignItems: "center" }}
            >
              <StepNode step={step} status={status} agentName={agentName} />
              {idx < PIPELINE_STEPS.length - 1 && (
                <div
                  style={{
                    width: 24,
                    height: 1,
                    background:
                      step.number < currentStep
                        ? "var(--accent-cyan)"
                        : "var(--border)",
                    flexShrink: 0,
                    marginBottom: 28,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
