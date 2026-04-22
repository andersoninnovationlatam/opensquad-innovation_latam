"use client";

import { useState } from "react";
import { SlideCard } from "./SlideCard";

interface Slide {
  titulo: string;
  conteudo: string;
}

interface CarouselPreviewProps {
  slides: Slide[];
}

export function CarouselPreview({ slides }: CarouselPreviewProps) {
  const [copied, setCopied] = useState(false);

  function copyAll() {
    const text = slides
      .map((s, i) => `Slide ${i + 1} — ${s.titulo}\n\n${s.conteudo}`)
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            Carrossel pronto
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {slides.length} slides gerados
          </p>
        </div>
        <button
          onClick={copyAll}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-violet-400"
        >
          {copied ? "✓ Tudo copiado!" : "📋 Copiar tudo"}
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {slides.map((slide, i) => (
          <SlideCard
            key={i}
            index={i + 1}
            titulo={slide.titulo}
            conteudo={slide.conteudo}
          />
        ))}
      </div>
    </div>
  );
}
