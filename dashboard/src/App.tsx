import { useState } from "react";
import { useSquadSocket } from "@/hooks/useSquadSocket";
import { SquadSelector } from "@/components/SquadSelector";
import { PhaserGame } from "@/office/PhaserGame";
import { StatusBar } from "@/components/StatusBar";
import { CarouselNoticiasPage } from "@/components/carousel/CarouselNoticiasPage";

type Tab = "office" | "carousel";

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 40,
        padding: "0 14px",
        background: "transparent",
        border: "none",
        borderBottom: active ? "2px solid var(--accent-cyan)" : "2px solid transparent",
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        fontFamily: "inherit",
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        letterSpacing: 0.4,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

export function App() {
  useSquadSocket();
  const [activeTab, setActiveTab] = useState<Tab>("office");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          height: 40,
          minHeight: 40,
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-sidebar)",
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 0.5,
            color: "var(--text-primary)",
            marginRight: 12,
          }}
        >
          opensquad
        </span>
        <TabButton
          label="Virtual Office"
          active={activeTab === "office"}
          onClick={() => setActiveTab("office")}
        />
        <TabButton
          label="Carrossel de Notícias"
          active={activeTab === "carousel"}
          onClick={() => setActiveTab("carousel")}
        />
      </header>

      {/* Main content */}
      {activeTab === "office" ? (
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <SquadSelector />
          <PhaserGame />
        </div>
      ) : (
        <div style={{ flex: 1, overflow: "hidden" }}>
          <CarouselNoticiasPage />
        </div>
      )}

      {/* Footer */}
      <StatusBar />
    </div>
  );
}
