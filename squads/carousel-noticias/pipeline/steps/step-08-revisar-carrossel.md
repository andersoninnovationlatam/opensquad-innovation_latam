---
execution: inline
agent: rosa-revisao
on_reject: 4
---

# Step 08: Revisar Carrossel

## Context Loading

Load these files before executing:
- `squads/carousel-noticias/output/carousel-copy.md` — copy completo dos slides
- `squads/carousel-noticias/output/slides/` — imagens renderizadas de todos os slides
- `pipeline/data/quality-criteria.md` — 9 critérios de avaliação com pesos e regras de aprovação
- `squads/carousel-noticias/output/news-input.md` — notícia original (para verificar alinhamento factual)

## Instructions

### Process
1. Ler `quality-criteria.md` completamente antes de qualquer avaliação. Não avaliar de memória.
2. Ler o copy completo de `carousel-copy.md` do início ao fim como um leitor real faria. Anotar reações antes de pontuar.
3. Visualizar todas as imagens renderizadas em `output/slides/`. Verificar branding, tipografia, contraste, dimensão.
4. Pontuar os 9 critérios individualmente (1-10) com justificativa específica por critério.
5. Calcular média e aplicar regras de veredicto da quality-criteria.md.
6. Compilar Required changes (blocking) e Suggestions non-blocking separadamente.
7. Entregar review formatado. Se REJECT: incluir path to approval numerado.

## Output Format

```
==============================
 REVISÃO: [APPROVE / CONDITIONAL APPROVE / REJECT]
==============================

Carrossel: [tema]
Ângulo: [ângulo]
Slides: [N] slides
Revisão: [N] de 3

------------------------------
 PONTUAÇÃO
------------------------------
| Critério                 | Score  | Resumo                          |
|--------------------------|--------|---------------------------------|
| Gancho do Cover          | X/10   | [justificativa]                 |
| Qualidade dos Slides     | X/10   | [justificativa]                 |
| Caption                  | X/10   | [justificativa]                 |
| CTA                      | X/10   | [justificativa]                 |
| Alinhamento com Notícia  | X/10   | [justificativa]                 |
| Identidade Visual        | X/10   | [justificativa]                 |
| Legibilidade             | X/10   | [justificativa]                 |
| Branding                 | X/10   | [justificativa]                 |
| Consistência Visual      | X/10   | [justificativa]                 |
------------------------------
 MÉDIA: X.X/10
------------------------------

FEEDBACK DETALHADO:

Strength: [...]
Strength: [...]

[Required change:] [...]
[Suggestion (non-blocking):] [...]

PATH TO APPROVAL: (se REJECT)
1. [mudança necessária]
2. [mudança necessária]

VEREDICTO: [APPROVE / CONDITIONAL APPROVE / REJECT] — [justificativa]
```

## Output Example

```
==============================
 REVISÃO: APPROVE
==============================

Carrossel: Open Banking no Brasil — 2º maior ecossistema do mundo
Ângulo: Oportunidade
Slides: 6 slides
Revisão: 1 de 3

------------------------------
 PONTUAÇÃO
------------------------------
| Critério                 | Score  | Resumo                                                          |
|--------------------------|--------|-----------------------------------------------------------------|
| Gancho do Cover          | 9/10   | Headline específica (40M usuários, 2º mundo) com pergunta direta|
| Qualidade dos Slides     | 8/10   | Slides 2-5 fortes; slide 3 poderia ter mais dado específico      |
| Caption                  | 8/10   | Hook 125 chars funciona solo; fechamento com CTA específico      |
| CTA                      | 9/10   | "Comenta FINTECH abaixo" é específico e acionável               |
| Alinhamento com Notícia  | 10/10  | Todos os dados rastreáveis ao relatório Banco Central citado     |
| Identidade Visual        | 9/10   | Montserrat correto, pesos respeitados, cover Bold 700            |
| Legibilidade             | 9/10   | Overlay adequado nos 3 slides com foto; #993CB1 com bom contraste|
| Branding                 | 10/10  | Logo + @innovationlatam em todos os 6 slides, posição correta    |
| Consistência Visual      | 9/10   | Design system consistente em todos os slides                     |
------------------------------
 MÉDIA: 9.0/10
------------------------------

Strength: Cover slide combina dado concreto (40 milhões, 2º mundo) com pergunta direta ao leitor — exatamente o padrão que gera saves e shares na audiência de inovação corporativa.

Strength: Fonte da notícia atribuída explicitamente no último slide com nome do relatório e órgão emissor. Credibilidade máxima.

Suggestion (non-blocking): Slide 3 cita "segundo maior ecossistema" mas poderia incluir o ano específico do crescimento para dar contexto temporal ao dado.

Suggestion (non-blocking): Caption poderia mencionar que é "carrossel de 6 slides" nos primeiros 125 chars para quem prefere saber o formato antes de clicar.

VEREDICTO: APPROVE — Carrossel atende todos os critérios com média 9.0/10. Sugestões são opcionais.
```

## Veto Conditions

Rejeitar e redo se:
1. Qualquer dos 9 critérios pontuado sem justificativa escrita
2. Veredicto APPROVE emitido quando qualquer critério está abaixo de 4/10

## Quality Criteria

- [ ] Todos os 9 critérios pontuados com justificativa
- [ ] Veredicto calculado corretamente
- [ ] Required changes separados de Suggestions
- [ ] Pelo menos 2 Strengths identificados
- [ ] Número de revisão registrado
