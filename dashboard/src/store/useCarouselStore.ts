import { create } from "zustand";
import type { WorkflowPhase, CheckpointType } from "@/types/carousel";
import type { SquadState } from "@/types/state";

interface CarouselStore {
  phase: WorkflowPhase;
  currentStep: number;
  squadState: SquadState | null;
  checkpointType: CheckpointType | null;
  checkpointContent: string | null;
  isSubmitting: boolean;
  error: string | null;

  setSquadState: (state: SquadState | null) => void;
  setPhase: (phase: WorkflowPhase) => void;
  setCheckpoint: (type: CheckpointType, content: string) => void;
  clearCheckpoint: () => void;
  setSubmitting: (v: boolean) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}

const initialState = {
  phase: "idle" as WorkflowPhase,
  currentStep: 0,
  squadState: null,
  checkpointType: null,
  checkpointContent: null,
  isSubmitting: false,
  error: null,
};

export const useCarouselStore = create<CarouselStore>((set) => ({
  ...initialState,

  setSquadState: (squadState) =>
    set({ squadState, currentStep: squadState?.step?.current ?? 0 }),

  setPhase: (phase) => set({ phase }),

  setCheckpoint: (checkpointType, checkpointContent) =>
    set({ checkpointType, checkpointContent, phase: "checkpoint" }),

  clearCheckpoint: () =>
    set({ checkpointType: null, checkpointContent: null }),

  setSubmitting: (isSubmitting) => set({ isSubmitting }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
