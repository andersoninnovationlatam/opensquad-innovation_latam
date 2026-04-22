"use client";

import { useEffect, useRef, useState } from "react";
import { InputNoticia } from "@/components/InputNoticia";
import { SelectAngulo } from "@/components/SelectAngulo";
import { GenerateButton } from "@/components/GenerateButton";
import { CarouselPreview } from "@/components/CarouselPreview";

type Status = "idle" | "loading" | "success" | "error";

interface Slide {
  titulo: string;
  conteudo: string;
}

export default function Home() {
  const [noticia, setNoticia] = useState("");
  const [angulo, setAngulo] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [dark, setDark] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    if (status === "success" && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!noticia.trim() || !angulo.trim() || status === "loading") return;

    setStatus("loading");
    setSlides([]);
    setErrorMsg("");

    try {
      const res = await fetch("/api/run-squad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticia: noticia.trim(), angulo }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Erro desconhecido");
      }

      const data = await res.json() as { slides: Slide[] };
      setSlides(data.slides);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Erro ao gerar conteúdo.");
      setStatus("error");
    }
  }

  function resetForm() {
    setStatus("idle");
    setSlides([]);
    setErrorMsg("");
    setNoticia("");
    setAngulo("");
  }

  const canSubmit = noticia.trim().length > 0 && angulo.length > 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 pb-20 pt-10 dark:bg-[#0a0e14]">
      {/* Header */}
      <header className="mx-auto mb-10 flex max-w-2xl items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            AI Content Squad
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Transforme notícias em carrosséis virais
          </p>
        </div>
        <button
          onClick={() => setDark((d) => !d)}
          className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
        >
          {dark ? "☀ Claro" : "🌙 Escuro"}
        </button>
      </header>

      {/* Form card */}
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-900">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <InputNoticia
              value={noticia}
              onChange={setNoticia}
              disabled={status === "loading"}
            />
            <SelectAngulo
              value={angulo}
              onChange={setAngulo}
              disabled={status === "loading"}
            />
            <GenerateButton loading={status === "loading"} disabled={!canSubmit} />
          </form>
        </div>

        {/* Loading skeleton */}
        {status === "loading" && (
          <div className="mt-8 flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="mt-8 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-900 dark:bg-red-950/40">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Erro ao gerar conteúdo
              </p>
              {errorMsg && (
                <p className="mt-0.5 text-xs text-red-500 dark:text-red-500">
                  {errorMsg}
                </p>
              )}
            </div>
            <button
              onClick={resetForm}
              className="rounded-xl bg-red-100 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Success */}
        {status === "success" && slides.length > 0 && (
          <div ref={resultRef} className="mt-8 flex flex-col gap-6">
            <CarouselPreview slides={slides} />
            <button
              onClick={resetForm}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-500 shadow-sm transition hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-violet-400"
            >
              ↺ Gerar novo carrossel
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
