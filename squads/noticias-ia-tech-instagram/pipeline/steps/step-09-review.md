---
execution: inline
agent: reviewer
inputFile: squads/noticias-ia-tech-instagram/output/carousel-package/ENTREGA.md
outputFile: squads/noticias-ia-tech-instagram/output/review-verdict.md
on_reject: 8
---

# Step 09: Revisão final

## Context Loading

Load these files before executing:
- `squads/noticias-ia-tech-instagram/output/carousel-package/ENTREGA.md` — entrega do designer
- `squads/noticias-ia-tech-instagram/output/verification-news.md` — resultado PASS/FAIL
- `squads/noticias-ia-tech-instagram/output/carousel_copy.json` — copy de referência
- `squads/noticias-ia-tech-instagram/pipeline/data/quality-criteria.md`
- `squads/noticias-ia-tech-instagram/agents/reviewer/tasks/review.md`

## Instructions

### Process

1. Adoptar **Vera Veredito** e executar a tarefa `review.md`.
2. Se `verification-news.md` ≠ PASS e existirem imagens, **REJECT** automático com explicação.
3. **Validação técnica (recomendado):** para cada `slide-NN.png` listado no ENTREGA, executar no terminal `file` ou `identify -format '%wx%h'` (ImageMagick) e confirmar **1080×1350** (ou proporção 4:5). Se a resolução falhar, **REJECT** ou CONDITIONAL com instrução para refazer no passo 8.
4. Pontuar critérios, calcular média, decidir APPROVE / CONDITIONAL / REJECT.
5. Em REJECT com falha visual/técnica, o runner pode reencaminhar ao passo **8** (`on_reject: 8`). Falhas de copy podem exigir edição de `carousel_copy.json` e reentrada no passo **4** ou **6** conforme feedback (indicar no veredito).

## Output Format

```markdown
# Veredito

**Resultado:** APPROVE | CONDITIONAL | REJECT

## Pontuação
| Critério | Nota | Notas |
|----------|------|-------|
| Factualidade | /10 | |
| Tom institucional | /10 | |
| Formato Instagram | /10 | |
| Visual / legibilidade | /10 | |

## Bloqueantes
...

## Sugestões (não bloqueantes)
...

## Pontos fortes
...
```

## Output Example

Ver `agents/reviewer/tasks/review.md` — exemplo APPROVE com tabela preenchida.

## Veto Conditions

Reject and redo if ANY are true:
1. Veredito sem tabela de critérios.
2. APPROVE com verificação FAIL e assets presentes.

## Quality Criteria

- [ ] Média e veredito coerentes
- [ ] Feedback localizado (slides ou secções)
