export type WorkflowPhase =
  | "idle"
  | "starting"
  | "awaiting-trigger"
  | "running"
  | "checkpoint"
  | "completed";

export type CheckpointType = "copy" | "artbrief" | "final";

export type PipelineStepStatus =
  | "pending"
  | "active"
  | "checkpoint-waiting"
  | "auto-approved"
  | "done";

export interface PipelineStep {
  number: number;
  name: string;
  label: string;
  agentId: string | null;
  agentIcon: string | null;
  isCheckpoint: boolean;
  isAutoApproved?: boolean;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  { number: 1, name: "checkpoint-news-input", label: "Notícia", agentId: null, agentIcon: null, isCheckpoint: true },
  { number: 2, name: "gerar-angulos", label: "Ângulos", agentId: "caio-carrossel", agentIcon: "✍️", isCheckpoint: false },
  { number: 3, name: "checkpoint-angle-selection", label: "Ângulo", agentId: null, agentIcon: null, isCheckpoint: true },
  { number: 4, name: "criar-copy-carrossel", label: "Copy", agentId: "caio-carrossel", agentIcon: "✍️", isCheckpoint: false },
  { number: 5, name: "checkpoint-approve-content", label: "Aprovar Copy", agentId: null, agentIcon: null, isCheckpoint: true, isAutoApproved: true },
  { number: 6, name: "criar-briefing-visual", label: "Brief Visual", agentId: "diana-design", agentIcon: "🎨", isCheckpoint: false },
  { number: 7, name: "checkpoint-approve-art-brief", label: "Aprovar Brief", agentId: null, agentIcon: null, isCheckpoint: true },
  { number: 8, name: "gerar-e-renderizar-slides", label: "Slides", agentId: "diana-design", agentIcon: "🎨", isCheckpoint: false },
  { number: 9, name: "revisar-carrossel", label: "Revisão", agentId: "rosa-revisao", agentIcon: "🔍", isCheckpoint: false },
  { number: 10, name: "checkpoint-final-approval", label: "Aprovação Final", agentId: null, agentIcon: null, isCheckpoint: true },
];
