const BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "";

interface SubmitInputBody {
  newsText: string;
  angle: string;
  contentModel: string;
  imageModel: string;
}

interface CheckpointBody {
  response: string;
  editedContent?: string;
}

export const api = {
  submitInput: (body: SubmitInputBody) =>
    fetch(`${BASE}/api/carousel/input`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  getState: () => fetch(`${BASE}/api/carousel/state`),

  getContent: (type: "copy" | "artbrief") =>
    fetch(`${BASE}/api/carousel/content?type=${type}`),

  approveCheckpoint: (step: string, body: CheckpointBody) =>
    fetch(`${BASE}/api/carousel/checkpoint/${step}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  sseUrl: () => `${BASE}/api/carousel/sse`,

  wsUrl: () => {
    const base = (import.meta.env.VITE_WS_BASE_URL as string) ?? "";
    if (base) return `${base}/__carousel_ws`;
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    return `${proto}://${window.location.host}/__carousel_ws`;
  },
};
