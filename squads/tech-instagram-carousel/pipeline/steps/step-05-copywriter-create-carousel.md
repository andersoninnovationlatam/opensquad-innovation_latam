---
execution: subagent
agent: copywriter
format: instagram-feed
inputFile: squads/tech-instagram-carousel/output/selected-angle.md
outputFile: squads/tech-instagram-carousel/output/carousel-draft.md
model_tier: fast
---

# Step 05: Copywriter — Carrossel completo

## Context Loading

- `squads/tech-instagram-carousel/output/selected-angle.md`
- `squads/tech-instagram-carousel/output/selected-news.md`
- `squads/tech-instagram-carousel/output/social-handoff.md`
- `pipeline/data/tone-of-voice.md`
- `pipeline/data/research-brief.md`
- `pipeline/data/domain-framework.md`
- `pipeline/data/anti-patterns.md`
- Instagram feed best practices (via `format`)

## Instructions

Atue como **Copywriter**. Siga `agents/copywriter/tasks/create-carousel.md` e o fluxo detalhado do squad (hooks, tom, 8–10 slides, legenda, hashtags).

## Output

`carousel-draft.md` no formato acordado (YAML ou markdown conforme a task).

## Veto Conditions

Como antes: scroll-stop no hook, 40–80 palavras por slide, legenda com primeiros 125 caracteres fortes, etc.
