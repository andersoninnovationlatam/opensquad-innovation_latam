"use client";

import { useState } from "react";

interface SlideCardProps {
  index: number;
  titulo: string;
  conteudo: string;
}

export function SlideCard({ index, titulo, conteudo }: SlideCardProps) {
  const [copied, setCopied] = useState(false);

  function copySlide() {
    navigator.clipboard.writeText(`${titulo}\n\n${conteudo}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="animate-fade-in-up group relative flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
            {index}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {titulo}
          </span>
        </div>
        <button
          onClick={copySlide}
          className="rounded-lg px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        >
          {copied ? "✓ Copiado" : "Copiar"}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {conteudo}
      </p>
    </div>
  );
}
