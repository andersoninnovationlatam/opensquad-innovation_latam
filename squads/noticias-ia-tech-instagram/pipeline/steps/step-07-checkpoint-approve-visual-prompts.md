---
type: checkpoint
outputFile: squads/noticias-ia-tech-instagram/output/visual-prompts-approved.md
---

# Step 07: Checkpoint — Aprovar prompts visuais (antes de gastar tokens de imagem)

## Context Loading

Load these files before executing:
- `squads/noticias-ia-tech-instagram/output/visual_prompts.json`
- `squads/noticias-ia-tech-instagram/output/carousel_copy.json`

## Instructions

### Process

1. Resumir cada `image_prompt` (1–5) em uma frase para o gestor.
2. Confirmar que **nenhum** prompt pede texto na imagem.
3. Aguardar aprovação antes da geração com `image-ai-generator`.
4. Gravar `visual-prompts-approved.md`.

## Output Format

```markdown
# Visual prompts approval

**Status:** APPROVED | REVISED
**Date:** YYYY-MM-DD
**Notes:** {opcional}
```

## Veto Conditions

Reject and redo if ANY are true:
1. Status ausente.

## Quality Criteria

- [ ] Gestor ciente do custo de 5 imagens IA ao aprovar
