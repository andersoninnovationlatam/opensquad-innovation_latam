"use client";

const ANGULOS = ["Educativo", "Medo", "Profissional", "Curiosidade", "Polêmico"] as const;
export type Angulo = (typeof ANGULOS)[number];

interface SelectAnguloProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function SelectAngulo({ value, onChange, disabled }: SelectAnguloProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        Ângulo do conteúdo
      </label>
      <div className="flex flex-wrap gap-2">
        {ANGULOS.map((a) => {
          const active = value === a;
          return (
            <button
              key={a}
              type="button"
              disabled={disabled}
              onClick={() => onChange(a)}
              className={[
                "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                "disabled:cursor-not-allowed disabled:opacity-50",
                active
                  ? "border-violet-500 bg-violet-500 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-violet-500",
              ].join(" ")}
            >
              {a}
            </button>
          );
        })}
      </div>
    </div>
  );
}
