---
execution: subagent
agent: copywriter
model_tier: powerful
inputFile: squads/noticias-ia-tech-instagram/output/selected-story.md
outputFile: squads/noticias-ia-tech-instagram/output/carousel_copy.json
---

# Step 04: Roteiro de carrossel (JSON)

## Context Loading

Load these files before executing:
- `squads/noticias-ia-tech-instagram/output/selected-story.md` — notícia escolhida
- `squads/noticias-ia-tech-instagram/output/news_raw.json` — dados estruturados do Researcher (mesmo run)
- `squads/noticias-ia-tech-instagram/pipeline/data/tone-of-voice.md`
- `squads/noticias-ia-tech-instagram/pipeline/artifacts/carousel_copy.schema.json`
- `squads/noticias-ia-tech-instagram/agents/copywriter/tasks/write-carousel-copy.md`
- `_opensquad/_memory/company.md` — opcional

## Instructions

### Process

1. Carregar **Carla Roteiro** com a tarefa `write-carousel-copy.md`.
2. Produzir `carousel_copy.json` válido face ao schema (5 slides; slide 5 = CTA institucional).
3. Garantir `meta.caption_full` com legenda única do post e hashtags.

## Output Format

Ficheiro JSON conforme `pipeline/artifacts/carousel_copy.schema.json` (objeto com `meta` + `slides`).

## Veto Conditions

Reject and redo if ANY are true:
1. JSON inválido ou que não valida o schema.
2. Menos de 5 slides ou slide 5 com facto de notícia novo.

## Quality Criteria

- [ ] Overlay curto (~10 palavras) por slide
- [ ] Menção de fonte adequada na legenda
- [ ] Tom alinhado a `tone-of-voice.md`
