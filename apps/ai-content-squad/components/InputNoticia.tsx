"use client";

interface InputNoticiaProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function InputNoticia({ value, onChange, disabled }: InputNoticiaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        Notícia
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Cole a notícia ou URL aqui..."
        rows={6}
        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-violet-500 dark:focus:ring-violet-900/30"
      />
    </div>
  );
}
