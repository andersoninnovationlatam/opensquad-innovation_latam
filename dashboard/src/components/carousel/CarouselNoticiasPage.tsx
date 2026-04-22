import { useRef } from "react";
import type { SquadState } from "@/types/state";
import { useCarouselSocket } from "@/hooks/useCarouselSocket";
import { useCarouselStore } from "@/store/useCarouselStore";
import { api } from "@/lib/api";
import { NewsForm } from "./NewsForm";
import { StepTracker } from "./StepTracker";
import { CheckpointPanel } from "./CheckpointPanel";
import { TriggerPrompt } from "./TriggerPrompt";
import { DriveButton } from "./DriveButton";

function AgentStatusPanel({ squadState }: { squadState: SquadState | null }) {
  if (!squadState) return null;
  const active = squadState.agents?.find((a) => a.status === "working");
  const label = squadState.step?.label ?? "";

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: 4,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {active ? (
        <>
          <span style={{ fontSize: 20 }}>{active.icon ?? "🤖"}</span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>
              {active.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
              {label.replace(/-/g, " ")}
            </div>
          </div>
          <span
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "var(--accent-green)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent-green)",
                animation: "pulse 1s ease-in-out infinite",
              }}
            />
            executando
          </span>
        </>
      ) : (
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          Processando etapa {squadState.step?.current ?? "—"} de{" "}
          {squadState.step?.total ?? 10}…
        </span>
      )}
    </div>
  );
}

export function CarouselNoticiasPage() {
  useCarouselSocket();

  const {
    phase,
    currentStep,
    squadState,
    checkpointType,
    checkpointContent,
    isSubmitting,
    error,
    setSubmitting,
    setError,
    setPhase,
    reset,
  } = useCarouselStore();

  const autoApprovedStepRef = useRef<number | null>(null);

  async function handleSubmit(
    newsText: string,
    angle: string,
    contentModel: string,
    imageModel: string
  ) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await api.submitInput({ newsText, angle, contentModel, imageModel });
      if (!res.ok) throw new Error("Falha ao salvar inputs");
      setPhase("starting");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCheckpointApprove(step: string, editedContent?: string) {
    setSubmitting(true);
    try {
      const body = editedContent
        ? { response: "edited", editedContent }
        : { response: "ok" };
      await api.approveCheckpoint(step, body);
      setPhase("running");
    } catch {
      setError("Erro ao enviar resposta do checkpoint");
    } finally {
      setSubmitting(false);
    }
  }

  const reviewScore = squadState?.handoff?.message ?? "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Step tracker — shown from the moment user submits */}
      {phase !== "idle" && (
        <StepTracker
          currentStep={currentStep}
          squadState={squadState}
          autoApprovedStep={autoApprovedStepRef.current}
        />
      )}

      {/* Scrollable main content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Page title */}
        {phase === "idle" && (
          <div style={{ marginBottom: 4 }}>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
                marginBottom: 4,
              }}
            >
              Carrossel de Notícias
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
              Insira a notícia e o ângulo narrativo para gerar um carrossel visual.
            </p>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div
            style={{
              background: "rgba(255,82,82,0.1)",
              border: "1px solid var(--accent-red)",
              borderRadius: 4,
              padding: "10px 14px",
              fontSize: 12,
              color: "var(--accent-red)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {error}
            <button
              onClick={() => setError(null)}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-red)",
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Phase: idle → NewsForm */}
        {phase === "idle" && (
          <NewsForm onSubmit={handleSubmit} isDisabled={isSubmitting} />
        )}

        {/* Phase: starting → spinner */}
        {phase === "starting" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                border: "3px solid var(--border)",
                borderTopColor: "var(--accent-blue, #4f8ef7)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                Iniciando squad...
              </div>
              <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                A execução foi iniciada automaticamente.
              </div>
            </div>
          </div>
        )}

        {/* Phase: awaiting-trigger → TriggerPrompt (fallback legado) */}
        {phase === "awaiting-trigger" && <TriggerPrompt />}

        {/* Phase: running → AgentStatus */}
        {(phase === "running" || phase === "checkpoint") && (
          <AgentStatusPanel squadState={squadState} />
        )}

        {/* Phase: checkpoint → CheckpointPanel */}
        {phase === "checkpoint" && checkpointType && checkpointType !== "copy" && (
          <CheckpointPanel
            type={checkpointType}
            content={checkpointContent}
            stepLabel={squadState?.step?.label ?? ""}
            reviewScore={reviewScore}
            onApprove={(editedContent) => {
              const stepMap: Record<string, string> = {
                artbrief: "approve-art-brief",
                final: "final-approval",
              };
              const step = stepMap[checkpointType];
              if (step) handleCheckpointApprove(step, editedContent);
            }}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Phase: completed */}
        {phase === "completed" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--accent-green)",
                borderRadius: 4,
                padding: "20px 24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent-green)", marginBottom: 6 }}>
                Carrossel Concluído!
              </div>
              {reviewScore && (
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {reviewScore}
                </div>
              )}
            </div>

            <DriveButton />

            <button
              onClick={reset}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                borderRadius: 4,
                color: "var(--text-secondary)",
                fontFamily: "inherit",
                fontSize: 12,
                padding: "10px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              ↺ Novo Carrossel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
