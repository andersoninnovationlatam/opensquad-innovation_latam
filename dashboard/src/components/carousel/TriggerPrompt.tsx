const COMMAND = "/opensquad run carousel-noticias";

export function TriggerPrompt() {
  function copyCommand() {
    navigator.clipboard.writeText(COMMAND).catch(() => {});
  }

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderTop: "3px solid var(--accent-cyan)",
        borderRadius: 4,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>⚡</span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          Inputs salvos — inicie o workflow
        </span>
      </div>

      <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>
        Execute o comando abaixo no Claude Code para iniciar o squad:
      </p>

      <div
        style={{
          background: "var(--bg-sidebar)",
          border: "1px solid var(--accent-cyan)",
          borderRadius: 4,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <code
          style={{
            fontSize: 13,
            color: "var(--accent-cyan)",
            letterSpacing: 0.3,
          }}
        >
          {COMMAND}
        </code>
        <button
          onClick={copyCommand}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: 3,
            color: "var(--text-secondary)",
            fontFamily: "inherit",
            fontSize: 11,
            padding: "4px 10px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Copiar
        </button>
      </div>

      <p
        style={{
          fontSize: 11,
          color: "var(--text-secondary)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--accent-amber)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
        O dashboard detectará automaticamente quando o workflow iniciar.
      </p>
    </div>
  );
}
