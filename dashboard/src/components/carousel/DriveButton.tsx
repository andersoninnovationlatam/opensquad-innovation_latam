const DRIVE_URL =
  "https://drive.google.com/drive/folders/1F9_BxLhyhJv7uzJ6RJ5OXFCYS0Lm-8o8?usp=sharing";

export function DriveButton() {
  return (
    <a
      href={DRIVE_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        width: "100%",
        padding: "12px 20px",
        background: "transparent",
        border: "1px solid var(--accent-green)",
        borderRadius: 4,
        color: "var(--accent-green)",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: 0.5,
        textDecoration: "none",
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background =
          "rgba(0,230,118,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
      }}
    >
      <span style={{ fontSize: 16 }}>📁</span>
      Abrir no Google Drive
    </a>
  );
}
