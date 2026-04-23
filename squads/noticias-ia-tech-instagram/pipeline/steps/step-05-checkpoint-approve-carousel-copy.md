---
type: checkpoint
outputFile: squads/noticias-ia-tech-instagram/output/carousel-copy-approved.md
---

# Step 05: Checkpoint — Aprovar copy (JSON)

## Context Loading

Load these files before executing:
- `squads/noticias-ia-tech-instagram/output/carousel_copy.json`

## Instructions

### Process

1. Mostrar ao gestor o resumo dos 5 slides (`slide_text`) e a legenda completa (`meta.caption_full`).
2. Perguntar se pode avançar para o estrategista visual ou se deseja ajustes (pode editar o JSON manualmente antes de aprovar).
3. Gravar `carousel-copy-approved.md` com decisão.

## Output Format

```markdown
# Carousel copy approval

**Status:** APPROVED | REVISED
**Date:** YYYY-MM-DD
**Notes:** {opcional}
```

## Veto Conditions

Reject and redo if ANY are true:
1. Aprovação sem `Status` explícito.

## Quality Criteria

- [ ] Gestor confirmou leitura da legenda e dos overlays
