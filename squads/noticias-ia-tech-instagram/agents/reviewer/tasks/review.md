---
task: "Review final package"
order: 1
input: |
  - verification_news: Resultado da verificação do designer
  - entrega: ENTREGA.md e assets em carousel-package
  - quality_criteria: pipeline/data/quality-criteria.md
output: |
  - verdict: APPROVE | REJECT | CONDITIONAL com tabela de critérios
---

# Review final package

Consolida a revisão editorial e visual do pacote pronto para o gestor.

## Process

1. Ler `verification-news.md` — se carrossel existir e não for PASS, veredito **REJECT** automático até correção.
2. Ler `ENTREGA.md` e validar legenda, hashtags e lista de assets; cruzar com `carousel_copy.json` (`meta.caption_full` e overlays).
3. Opcional mas recomendado: validar no terminal que cada PNG listado existe e mede **1080×1350** (`identify` ou `file`).
4. Pontuar cada critério em `quality-criteria.md` (adaptar nomes aos blocos: pesquisa já passou; focar copy, visual, conformidade).
5. Calcular média; aplicar regras de veredito.
6. Produzir `review-verdict.md` com resumo, pontos fortes, bloqueios e sugestões.

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
- ...

## Sugestões (não bloqueantes)
- ...

## Pontos fortes
- ...
```

## Output Example

```markdown
# Veredito

**Resultado:** APPROVE

## Pontuação
| Critério | Nota | Notas |
|----------|------|-------|
| Factualidade | 8 | Números alinhados à fonte; fonte citada no último slide. |
| Tom institucional | 8 | Consistente; CTA adequado. |
| Formato Instagram | 9 | Estrutura de carrossel clara. |
| Visual / legibilidade | 8 | Hierarquia boa; slide 3 poderia aumentar contraste (sugestão). |

Média: 8,25

## Bloqueantes
Nenhum.

## Sugestões (não bloqueantes)
- Slide 3: aumentar contraste do texto secundário.

## Pontos fortes
- Capa forte; créditos explícitos.
```

## Quality Criteria

- [ ] Veredito explícito no topo.
- [ ] Cada nota tem justificação de uma linha.
- [ ] Distinção bloqueante / sugestão.

## Veto Conditions

Reject and redo if ANY are true:
1. Veredito APPROVE com `verification-news` ≠ PASS quando há imagens.
2. Tabela de critérios incompleta.
