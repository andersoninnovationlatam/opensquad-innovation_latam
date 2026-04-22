import { useState } from "react";

const ANGLE_PRESETS = [
  "Emocional",
  "Informativo",
  "Provocativo",
  "Educativo",
  "Inspiracional",
];

const CONTENT_MODEL_PRESETS = [
  { label: "GPT-5.2", value: "openai/gpt-4.5" },
  { label: "OpenAI o3", value: "openai/o3" },
  { label: "GPT-4o", value: "openai/gpt-4o" },
];

const IMAGE_MODEL_PRESETS = [
  { label: "Gemini 2.5 Flash", value: "google/gemini-2.5-flash-image" },
  { label: "Gemini 3.1 Flash", value: "google/gemini-3.1-flash-image-preview" },
  { label: "Riverflow Fast", value: "sourceful/riverflow-v2-fast" },
];

interface NewsFormProps {
  onSubmit: (
    newsText: string,
    angle: string,
    contentModel: string,
    imageModel: string
  ) => void;
  isDisabled: boolean;
}

export function NewsForm({ onSubmit, isDisabled }: NewsFormProps) {
  const [newsText, setNewsText] = useState("");
  const [angle, setAngle] = useState("");
  const [contentModel, setContentModel] = useState("openai/gpt-4.5");
  const [imageModel, setImageModel] = useState("google/gemini-2.5-flash-image");
  const [showModels, setShowModels] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newsText.trim() || !angle.trim() || isDisabled) return;
    onSubmit(newsText.trim(), angle.trim(), contentModel, imageModel);
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "var(--text-secondary)",
    marginBottom: 6,
    display: "block",
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "var(--bg-sidebar)",
    border: "1px solid var(--border)",
    borderRadius: 4,
    color: "var(--text-primary)",
    fontFamily: "inherit",
    fontSize: 13,
    padding: "8px 12px",
    outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Notícia */}
      <div>
        <label style={labelStyle}>Notícia</label>
        <textarea
          value={newsText}
          onChange={(e) => setNewsText(e.target.value)}
          disabled={isDisabled}
          placeholder="Cole aqui o texto da notícia..."
          style={{
            ...inputBase,
            minHeight: 160,
            resize: "vertical",
            lineHeight: 1.6,
          }}
        />
      </div>

      {/* Ângulo */}
      <div>
        <label style={labelStyle}>Ângulo Narrativo</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {ANGLE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAngle(preset)}
              disabled={isDisabled}
              style={{
                background: "transparent",
                border: `1px solid ${angle === preset ? "var(--accent-cyan)" : "var(--border)"}`,
                borderRadius: 3,
                color: angle === preset ? "var(--accent-cyan)" : "var(--text-secondary)",
                fontFamily: "inherit",
                fontSize: 11,
                padding: "5px 12px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {preset}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          disabled={isDisabled}
          placeholder="Ou escreva um ângulo personalizado..."
          style={inputBase}
        />
      </div>

      {/* Modelos (colapsável) */}
      <div>
        <button
          type="button"
          onClick={() => setShowModels((v) => !v)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            fontFamily: "inherit",
            fontSize: 11,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: 0,
          }}
        >
          <span>{showModels ? "▾" : "▸"}</span>
          ⚙ Modelos OpenRouter
        </button>

        {showModels && (
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              background: "var(--bg-sidebar)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              padding: 16,
            }}
          >
            {/* Modelo de Conteúdo */}
            <div>
              <label style={labelStyle}>Modelo de Conteúdo</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                {CONTENT_MODEL_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setContentModel(p.value)}
                    style={{
                      background: "transparent",
                      border: `1px solid ${contentModel === p.value ? "var(--accent-cyan)" : "var(--border)"}`,
                      borderRadius: 3,
                      color: contentModel === p.value ? "var(--accent-cyan)" : "var(--text-secondary)",
                      fontFamily: "inherit",
                      fontSize: 10,
                      padding: "3px 8px",
                      cursor: "pointer",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={contentModel}
                onChange={(e) => setContentModel(e.target.value)}
                style={{ ...inputBase, fontSize: 11 }}
              />
            </div>

            {/* Modelo de Imagem */}
            <div>
              <label style={labelStyle}>Modelo de Imagem</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                {IMAGE_MODEL_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setImageModel(p.value)}
                    style={{
                      background: "transparent",
                      border: `1px solid ${imageModel === p.value ? "var(--accent-cyan)" : "var(--border)"}`,
                      borderRadius: 3,
                      color: imageModel === p.value ? "var(--accent-cyan)" : "var(--text-secondary)",
                      fontFamily: "inherit",
                      fontSize: 10,
                      padding: "3px 8px",
                      cursor: "pointer",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={imageModel}
                onChange={(e) => setImageModel(e.target.value)}
                style={{ ...inputBase, fontSize: 11 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isDisabled || !newsText.trim() || !angle.trim()}
        style={{
          width: "100%",
          height: 44,
          background:
            isDisabled || !newsText.trim() || !angle.trim()
              ? "transparent"
              : "var(--accent-cyan)",
          border: "1px solid var(--accent-cyan)",
          borderRadius: 4,
          color:
            isDisabled || !newsText.trim() || !angle.trim()
              ? "var(--accent-cyan)"
              : "var(--bg-primary)",
          fontFamily: "inherit",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.5,
          cursor:
            isDisabled || !newsText.trim() || !angle.trim()
              ? "not-allowed"
              : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "all 0.15s",
        }}
      >
        {isDisabled ? (
          <>
            <span
              style={{
                display: "inline-block",
                animation: "pulse 0.8s ease-in-out infinite",
              }}
            >
              ◌
            </span>
            Salvando...
          </>
        ) : (
          "Iniciar Workflow"
        )}
      </button>
    </form>
  );
}
