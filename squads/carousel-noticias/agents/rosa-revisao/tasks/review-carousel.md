---
task: "Revisar Carrossel"
order: 1
input: |
  - carousel_copy: Copy completo dos slides (de carousel-copy.md)
  - slide_images: PNGs renderizados (de output/slides/)
  - quality_criteria: Critérios de avaliação (de pipeline/data/quality-criteria.md)
output: |
  - review: Veredicto estruturado com pontuações, feedback e required changes (inline na conversa)
---

# Revisar Carrossel

Avalia a qualidade do carrossel em sua totalidade — copy e visual — emitindo um veredicto claro e feedback acionável. Cobre 9 critérios distribuídos entre copy e visual, com pontuações individuais e veredicto final.

## Process

1. **Carregar critérios**: ler `pipeline/data/quality-criteria.md` antes de qualquer avaliação. Este documento define os 9 critérios, pesos e regras de aprovação. É a fonte de verdade — não avaliar com base em preferências pessoais.

2. **Ler o copy completo**: ler `carousel-copy.md` do início ao fim, como um leitor real do Instagram faria. Anotar reações de primeira leitura antes de pontuar. Verificar: gancho do cover, fluxo slide a slide, caption, CTA, hashtags, alinhamento com dados da notícia.

3. **Inspecionar os slides visuais**: visualizar cada imagem renderizada em `output/slides/`. Verificar: presença e posição do branding, tipografia Montserrat, overlay em slides com foto, fundo #993CB1 nos pares, dimensão, legibilidade.

4. **Pontuar os 9 critérios individualmente**: para cada critério da quality-criteria.md:
   - Dar score de 1-10
   - Escrever justificativa de pelo menos 1 frase específica
   - Identificar o elemento concreto que causou o score (slide número, trecho de texto, elemento visual)

5. **Calcular veredicto**:
   - APPROVE: média >= 7.0 E nenhum critério < 4 E nenhuma veto condition
   - CONDITIONAL APPROVE: média >= 7.0 E um ou mais critérios não-críticos entre 4-6
   - REJECT: média < 7.0 OU qualquer critério < 4 OU qualquer veto condition

6. **Compilar feedback**: listar Required changes (blocking) e Suggestions non-blocking separadamente. Todo Required change inclui: slide número, o problema, a instrução de correção específica.

7. **Entregar review formatado** com: veredicto em destaque, tabela de pontuação, feedback detalhado, required changes, sugestões não-bloqueantes, path to approval se REJECT.

## Output Format

```
==============================
 REVISÃO: [APPROVE / CONDITIONAL APPROVE / REJECT]
==============================

Carrossel: [tema da notícia]
Ângulo: [ângulo utilizado]
Slides: [N slides]
Revisão: [N] de 3

------------------------------
 PONTUAÇÃO
------------------------------
| Critério                 | Score  | Resumo                               |
|--------------------------|--------|--------------------------------------|
| Gancho do Cover          | X/10   | [justificativa em 1 frase]           |
| Qualidade dos Slides     | X/10   | [justificativa em 1 frase]           |
| Caption                  | X/10   | [justificativa em 1 frase]           |
| CTA                      | X/10   | [justificativa em 1 frase]           |
| Alinhamento com Notícia  | X/10   | [justificativa em 1 frase]           |
| Identidade Visual        | X/10   | [justificativa em 1 frase]           |
| Legibilidade             | X/10   | [justificativa em 1 frase]           |
| Branding                 | X/10   | [justificativa em 1 frase]           |
| Consistência Visual      | X/10   | [justificativa em 1 frase]           |
------------------------------
 MÉDIA: X.X/10
------------------------------

FEEDBACK DETALHADO:

Strength: [o que funcionou bem — específico e concreto]
Strength: [segundo ponto forte]

[Required change:] [localização exata + problema + instrução de correção]
[Required change:] [...]

[Suggestion (non-blocking):] [melhoria opcional]

PATH TO APPROVAL:
[lista numerada de mudanças necessárias, se REJECT]

VEREDICTO: [APPROVE / CONDITIONAL APPROVE / REJECT] — [justificativa em 1 frase]
```

## Output Example

> Use como referência de qualidade, não como template rígido.

```
==============================
 REVISÃO: APPROVE
==============================

Carrossel: McKinsey — IA reduziu custos em 34% em 18 meses
Ângulo: Oportunidade
Slides: 7 slides
Revisão: 1 de 3

------------------------------
 PONTUAÇÃO
------------------------------
| Critério                 | Score  | Resumo                                                          |
|--------------------------|--------|-----------------------------------------------------------------|
| Gancho do Cover          | 9/10   | Headline com número específico (34%) e pergunta direta ao leitor |
| Qualidade dos Slides     | 8/10   | Slides 3-5 fortes; slide 2 poderia ter dado mais específico      |
| Caption                  | 8/10   | Hook dos 125 chars funciona sozinho; corpo bem estruturado       |
| CTA                      | 9/10   | "Comenta IA abaixo" é específico e acionável                     |
| Alinhamento com Notícia  | 10/10  | Todos os dados rastreáveis ao relatório McKinsey citado          |
| Identidade Visual        | 9/10   | Montserrat correto em todos os slides; pesos respeitados         |
| Legibilidade             | 9/10   | Overlay adequado nos 4 slides com foto; contraste verificado     |
| Branding                 | 10/10  | Logo + @innovationlatam em todos os 7 slides, posição correta    |
| Consistência Visual      | 8/10   | Sistema visual consistente; slide 6 com margem levemente maior   |
------------------------------
 MÉDIA: 8.9/10
------------------------------

FEEDBACK DETALHADO:

Strength: A headline do cover — "34% em 18 meses" com pergunta direta — é altamente específica e passa o scroll-stop test. Mistura dado concreto com interpelação direta ao leitor, que é o padrão de cover mais eficaz para a audiência de inovação.

Strength: O último slide tem atribuição de fonte explícita (McKinsey Global Institute) e CTA específico em vez de genérico. Isso é exatamente o padrão correto: credibilidade + instrução de ação clara.

Suggestion (non-blocking): O slide 2 cita "mais de 1.500 empresas" mas poderia especificar o ano do relatório e o país de origem das empresas para aumentar credibilidade. Não é blocking porque a informação está correta — é melhoria de precisão.

Suggestion (non-blocking): A caption poderia incluir o nome específico do relatório ("The State of AI 2024") no corpo para quem quiser verificar a fonte antes de compartilhar.

VEREDICTO: APPROVE — Carrossel atende todos os critérios de qualidade com média 8.9/10. Sugestões de melhoria são opcionais antes de publicar.
```

## Quality Criteria

- [ ] Todos os 9 critérios avaliados com score e justificativa
- [ ] Nenhum score sem frase de justificativa
- [ ] Veredicto calculado corretamente contra as regras da quality-criteria.md
- [ ] Required changes incluem: slide número + problema + instrução específica de correção
- [ ] Pelo menos 2 Strengths identificados
- [ ] Non-blocking suggestions claramente separados de Required changes
- [ ] Número de revisão registrado (X de 3)

## Veto Conditions

Rejeitar e refazer se:
1. Qualquer critério pontuado sem justificativa de pelo menos uma frase
2. Veredicto APPROVE emitido quando qualquer critério está abaixo de 4/10
