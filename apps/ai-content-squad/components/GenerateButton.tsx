"use client";

interface GenerateButtonProps {
  loading: boolean;
  disabled: boolean;
}

export function GenerateButton({ loading, disabled }: GenerateButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={[
        "flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition",
        disabled || loading
          ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
          : "bg-violet-600 text-white shadow-md hover:bg-violet-700 active:scale-[0.98]",
      ].join(" ")}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          Seu squad está trabalhando…
        </>
      ) : (
        <>
          <span>🚀</span>
          Iniciar geração
        </>
      )}
    </button>
  );
}
