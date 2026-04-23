---
type: checkpoint
outputFile: squads/noticias-ia-tech-instagram/output/ready-for-posting.md
---

# Step 10: Checkpoint — Pronto para publicação manual

## Context Loading

Load these files before executing:
- `squads/noticias-ia-tech-instagram/output/review-verdict.md` — veredito
- `squads/noticias-ia-tech-instagram/output/carousel-package/ENTREGA.md` — entrega

## Instructions

### Process

1. Se veredito for **APPROVE** ou **CONDITIONAL** (com ressalvas aceites pelo gestor), confirmar que o gestor assume a **publicação manual** no Instagram.
2. Listar os ficheiros finais a carregar (ordem dos slides).
3. Gravar `ready-for-posting.md` com checklist e data.

## Output Format

```markdown
# Ready for posting

**Date:** YYYY-MM-DD
**Status:** CONFIRMED | HOLD

## Checklist
- [ ] Legenda copiada do ENTREGA
- [ ] Slides carregados na ordem slide-01 … slide-NN
- [ ] Verificação PASS revisitada

## Notes
{opcional}
```

## Output Example

```markdown
# Ready for posting

**Date:** 2026-03-30
**Status:** CONFIRMED

## Checklist
- [x] Legenda copiada do ENTREGA
- [x] Slides carregados na ordem slide-01 … slide-05
- [x] Verificação PASS revisitada

## Notes
Publicação agendada para 18h — horário do público.
```

## Veto Conditions

Reject and redo if ANY are true:
1. CONFIRMED sem veredito APPROVE/CONDITIONAL no ficheiro de revisão.
2. Data ausente.

## Quality Criteria

- [ ] Gestor ciente de que a publicação é manual
- [ ] Estado explícito CONFIRMED ou HOLD
