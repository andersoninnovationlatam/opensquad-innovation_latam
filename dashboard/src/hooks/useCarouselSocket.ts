import { useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useCarouselStore } from "@/store/useCarouselStore";
import type { SquadState } from "@/types/state";

const MAX_WS_FAILURES = 3;

async function fetchAndSetCheckpointContent(
  stepLabel: string,
  setCheckpoint: (type: "copy" | "artbrief" | "final", content: string) => void
) {
  if (stepLabel === "checkpoint-approve-art-brief") {
    try {
      const res = await api.getContent("artbrief");
      if (res.ok) {
        const { content } = await res.json();
        setCheckpoint("artbrief", content ?? "");
      }
    } catch {
      setCheckpoint("artbrief", "");
    }
  } else if (stepLabel === "checkpoint-final-approval") {
    setCheckpoint("final", "");
  }
  // step 5 (checkpoint-approve-content) is auto-approved — no panel shown
}

async function autoApproveStep5(setSubmitting: (v: boolean) => void) {
  setSubmitting(true);
  try {
    await api.approveCheckpoint("approve-content", { response: "ok" });
  } catch {
    // best-effort
  } finally {
    setSubmitting(false);
  }
}

export function useCarouselSocket() {
  const {
    phase,
    setSquadState,
    setPhase,
    setCheckpoint,
    setSubmitting,
    setError,
  } = useCarouselStore();

  const wsFailures = useRef(0);
  const wsRef = useRef<WebSocket | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  function handleStateUpdate(state: SquadState) {
    setSquadState(state);

    if (
      (phaseRef.current === "awaiting-trigger" || phaseRef.current === "starting") &&
      state.status !== "idle"
    ) {
      setPhase("running");
    }

    if (state.status === "completed") {
      setPhase("completed");
      return;
    }

    if (state.status === "checkpoint") {
      const label = state.step?.label ?? "";

      if (label === "checkpoint-approve-content") {
        // Auto-approve step 5 without showing UI
        autoApproveStep5(setSubmitting);
        return;
      }

      fetchAndSetCheckpointContent(label, setCheckpoint);
      return;
    }

    if (
      state.status === "running" &&
      phaseRef.current !== "awaiting-trigger" &&
      phaseRef.current !== "starting" &&
      phaseRef.current !== "idle"
    ) {
      setPhase("running");
    }
  }

  function startPolling() {
    if (pollRef.current) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.getState();
        if (!res.ok) return;
        const state: SquadState = await res.json();
        handleStateUpdate(state);
      } catch {
        // ignore poll errors
      }
    }, 3000);
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  function connectWs() {
    // Use SSE if on Cloudflare (no WebSocket server available)
    const isCloudflare =
      typeof import.meta.env.VITE_CF_PAGES !== "undefined" ||
      window.location.hostname.endsWith(".pages.dev");

    if (isCloudflare) {
      const source = new EventSource(api.sseUrl());
      source.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === "CAROUSEL_UPDATE") handleStateUpdate(msg.state);
        } catch {
          // ignore malformed messages
        }
      };
      source.onerror = () => startPolling();
      return () => source.close();
    }

    // Local dev: use WebSocket
    const ws = new WebSocket(api.wsUrl());
    wsRef.current = ws;

    ws.onopen = () => {
      wsFailures.current = 0;
      stopPolling();
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data as string);
        if (msg.type === "CAROUSEL_UPDATE") handleStateUpdate(msg.state);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => {
      wsFailures.current += 1;
      if (wsFailures.current >= MAX_WS_FAILURES) {
        setError("WebSocket indisponível — usando polling");
        startPolling();
      }
    };

    ws.onclose = () => {
      if (wsFailures.current >= MAX_WS_FAILURES) startPolling();
    };

    return () => {
      // Don't close a CONNECTING socket — triggers browser warning in React StrictMode.
      // onopen checks wsFailures to handle disposal.
      if (ws.readyState !== WebSocket.CONNECTING) ws.close();
    };
  }

  useEffect(() => {
    const cleanup = connectWs();
    return () => {
      cleanup?.();
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
