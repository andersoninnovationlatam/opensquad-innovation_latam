---
execution: subagent
agent: strategist
model_tier: powerful
inputFile: squads/noticias-ia-tech-instagram/output/carousel_copy.json
outputFile: squads/noticias-ia-tech-instagram/output/visual_prompts.json
---

# Step 06: Estratégia visual (prompts de fundo)

## Context Loading

Load these files before executing:
- `squads/noticias-ia-tech-instagram/output/carousel_copy.json` — copy aprovado
- `squads/noticias-ia-tech-instagram/output/carousel-copy-approved.md`
- `squads/noticias-ia-tech-instagram/pipeline/data/carousel-visual-language.md`
- `squads/noticias-ia-tech-instagram/pipeline/artifacts/visual_prompts.schema.json`
- `squads/noticias-ia-tech-instagram/agents/strategist/tasks/define-visual-prompts.md`

## Instructions

### Process

1. Carregar **Bruno Visão** com a tarefa `define-visual-prompts.md`.
2. Gerar `visual_prompts.json` com um `image_prompt` por slide (só cenário; sem texto na IA).
3. Preencher `text_overlay` igual ao `slide_text` correspondente.

## Output Format

JSON conforme `pipeline/artifacts/visual_prompts.schema.json`.

## Veto Conditions

Reject and redo if ANY are true:
1. Prompts que peçam texto, URL ou logo na imagem gerada.
2. Número de slides ≠ 5.

## Quality Criteria

- [ ] Espaço negativo descrito para overlay
- [ ] Estilo realista/cinematográfico coerente
