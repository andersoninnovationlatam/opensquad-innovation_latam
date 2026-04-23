# Squad Memory: Social Media Innovation Latam v2

## Estilo de Escrita

## Design Visual

## Estrutura de Conteúdo

## Proibições Explícitas

## Técnico (específico do squad)

- Run `2026-04-08-184226`: Gemma 4 (educacional); fundos via `bg-prompts.json` + `generate-bg-image.mjs` / `inject-bg-and-render.mjs`.
- Node.js 18 (undici) falha com `ConnectTimeoutError` ao conectar em openrouter.ai via IPv6. Solução: prefixar todos os scripts Node com `NODE_OPTIONS=--dns-result-order=ipv4first`. Afeta `generate-bg-image.mjs`, `run-squad-design.mjs` e `upload-to-drive.mjs`. Curl funciona normalmente (usa IPv4 por padrão).
- Modelos gratuitos do OpenRouter ficam frequentemente em rate limit. Usar `openai/gpt-4o-mini` para conteúdo (OPENROUTER_MODELS_CONTENT) como fallback confiável.
- `run-squad-design.mjs` chama `gen-slides-for-run.mjs` (step 1/3) que sobrescreve os HTMLs. O HTML real é gerado por `gen-slides-for-run.mjs`, não por `generate-html.mjs`.
- `gen-slides-for-run.mjs` BUG CORRIGIDO (2026-04-13): `getSlide()` usava delimitador `## Slide N —` mas `carousel-draft.md` usa `**Slide N: ` (bold com espaço após colon). Fixado para detectar ambos os formatos. `slide04()` tinha conteúdo hardcoded de outra run ("Risco"/"Tempo de reação") — removido e substituído por extração dinâmica.
- `generate-html.mjs` BUG CORRIGIDO (2026-04-13): `extractSlideBlock()` com mesmo problema de delimitador. Também: logo base64 (26.5KB ≈ 7500 tokens) estourava `max_tokens:8000` causando HTML truncado. Fix: usar placeholder `__LOGO_BASE64__` no prompt e substituir localmente após receber o HTML.
- `upload-to-drive.mjs` requer `export $(grep -v '^#' .env | xargs)` antes de rodar (não suporta `--env-file` no Node 18).
