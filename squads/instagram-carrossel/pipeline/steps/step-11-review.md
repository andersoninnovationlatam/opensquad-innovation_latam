---
step: 11
name: review
type: agent
agent: vera-veredito
execution: inline
inputFile: squads/instagram-carrossel/output/carousel-content.md
outputFile: squads/instagram-carrossel/output/review.md
on_reject: 6
---

## Contexto

**Agente:** Vera Veredito — Revisora de Conteúdo
**Tarefa:** review
**Execução:** Inline

Os slides foram renderizados. Vera Veredito avalia o carrossel completo contra os 8 critérios de qualidade definidos em quality-criteria.md e emite um veredicto estruturado: APROVAR, APROVAR CONDICIONAL ou REJEITAR.

**Se REJEITAR:** o conteúdo retorna automaticamente ao **Passo 6 (create-carousel)** com o feedback de review.md para Carlos Carrossel aplicar as correções obrigatórias.

---

## Context Loading

Vera Veredito deve ler antes de avaliar:

1. `squads/instagram-carrossel/output/carousel-content.md` — conteúdo completo (slides, legenda, hashtags)
2. `squads/instagram-carrossel/output/slides/` — slides renderizados para avaliar branding visual
3. `squads/instagram-carrossel/pipeline/data/quality-criteria.md` — critérios 1-8, tabela de scores e regras de veredicto
4. `squads/instagram-carrossel/pipeline/data/visual-identity.md` — regras visuais de referência
5. `squads/instagram-carrossel/pipeline/data/tone-of-voice.md` — tom selecionado para avaliar critério 4

---

## Instructions

### Process

1. **Ler carousel-content.md integralmente** (todos os slides, legenda, hashtags) antes de pontuar qualquer critério

2. **Examinar os slides renderizados** em `output/slides/` para avaliar o branding visual (Critério 5)

3. **Avaliar os 8 critérios individualmente** com score 1-10 e justificativa específica:
   - Critério 1: Relevância ao Brief (CRÍTICO — < 4 = rejeição automática)
   - Critério 2: Hook do Slide 1 (CRÍTICO — < 4 = rejeição automática)
   - Critério 3: Texto por slide 40-80 palavras (verificar contagem em cada slide)
   - Critério 4: Tom de voz (avaliar contra o tom selecionado em angle-selection.md)
   - Critério 5: Branding visual (CRÍTICO — < 4 = rejeição automática)
   - Critério 6: CTA do último slide
   - Critério 7: Legenda — hook nos primeiros 125 chars
   - Critério 8: Hashtags — contagem e mix

4. **Identificar pelo menos 1 Força** genuína — mesmo em rejeições

5. **Calcular média** e determinar veredicto:
   - APROVAR: média >= 7,0 AND nenhum critério < 4
   - APROVAR CONDICIONAL: média >= 7,0 AND 1-2 critérios não-críticos entre 4-6
   - REJEITAR: média < 7,0 OR qualquer critério < 4

6. **Se REJEITAR:** listar mudanças obrigatórias com instrução específica de correção + informar retorno ao Passo 6

7. **Gravar em review.md** seguindo o formato estruturado

### Output Format

```
==============================
 VEREDICTO: [APROVAR / APROVAR CONDICIONAL / REJEITAR]
==============================
Carrossel: "[título]"
Revisão: [N] de 3 | Data: [YYYY-MM-DD]

TABELA DE SCORES
| Critério                | Score | Resumo da justificativa                    |
|-------------------------|-------|--------------------------------------------|
| Relevância ao brief     |  X/10 | [justificativa específica ao conteúdo]     |
| Hook do slide 1         |  X/10 | [justificativa específica]                 |
| Texto por slide         |  X/10 | [com contagens se fora do intervalo]       |
| Tom de voz              |  X/10 | [alinhamento ao tom selecionado]           |
| Branding visual         |  X/10 | [presença em todos os slides?]             |
| CTA do último slide     |  X/10 | [específico e conectado ao tema?]          |
| Legenda                 |  X/10 | [hook nos 125 chars?]                      |
| Hashtags                |  X/10 | [contagem e mix niche/mid/broad]           |
MÉDIA GERAL: X.X/10

---

Força: [elemento específico que funcionou — citar slide, dado ou escolha]

[Se score < 7 em qualquer critério não-crítico:]
Sugestão não-bloqueante: [melhoria opcional] OU
Mudança recomendada: [se CONDICIONAL]

[Se REJEITAR:]
Mudanças obrigatórias (retorno ao Passo 6):
1. [Critério N] — [problema específico]: [instrução de correção]
2. [...]

---

VEREDICTO: [decisão final]
[Se REJEITAR:] Retornar ao Passo 6 — create-carousel com as correções acima.
```

### Output Example

```
==============================
 VEREDICTO: APROVAR
==============================
Carrossel: "7 mitos sobre IA que estão travando sua empresa"
Revisão: 1 de 3 | Data: 2026-04-05

TABELA DE SCORES
| Critério                | Score | Resumo da justificativa                                         |
|-------------------------|-------|-----------------------------------------------------------------|
| Relevância ao brief     |  9/10 | Alinhado ao dado Gartner pesquisado; cita empresa brasileira    |
| Hook do slide 1         |  8/10 | "7 mitos" é fórmula comprovada; poderia ter dado mais específico|
| Texto por slide         |  8/10 | 6/7 slides dentro de 40-80 palavras; slide 4 com 78 palavras   |
| Tom de voz              |  9/10 | Educativo e acessível consistente do slide 1 ao CTA             |
| Branding visual         | 10/10 | Logo + handle em 7/7 slides, canto inferior direito, legível   |
| CTA do último slide     |  8/10 | Pergunta específica e conectada ao tema de IA e inovação        |
| Legenda                 |  8/10 | Hook nos 123 chars verificado; corpo aprofunda sem repetir      |
| Hashtags                |  9/10 | 12 hashtags: 4 niche + 5 mid + 3 broad; todas relevantes       |
MÉDIA GERAL: 8.6/10

---

Força: O slide 4 usa dado específico (POC em 6-12 semanas / R$ 50-150k) que desmistifica o custo de IA de forma prática. É o slide com maior probabilidade de save para executivos em avaliação.

Sugestão não-bloqueante: O hook do slide 1 poderia incluir número específico de empresa brasileira para criar identificação imediata com o público local.

---

VEREDICTO: APROVAR
Próximo passo: checkpoint final-approval (Passo 12) para decisão de publicação.
```

### on_reject: 6
Se o veredicto for REJEITAR, retornar ao **Passo 6 (create-carousel)**. Carlos Carrossel deve ler review.md e aplicar TODAS as mudanças obrigatórias listadas antes de reescrever o conteúdo.

### Veto Conditions

- **NUNCA aprovar com média < 7,0** — regras de veredicto são inegociáveis
- **NUNCA aprovar com qualquer critério < 4** — mesmo que a média seja >= 7
- **NUNCA dar score sem justificativa** — sempre justificativa na mesma frase
- **NUNCA rejeitar sem instrução de correção** — especificar o quê + como corrigir
- **NUNCA omitir a identificação de Força** — obrigatório mesmo em rejeições
- **Máximo de 3 rodadas de revisão** — após 3 rejeições consecutivas, escalar ao usuário

### Quality Criteria

- Todos os 8 critérios avaliados com score e justificativa
- Critérios críticos (1, 2, 5) verificados contra limite de 4 para rejeição automática
- Média geral calculada corretamente
- Veredicto aplicado pela regra correta sem exceção
- Pelo menos 1 Força identificada
- Mudanças obrigatórias com instruções específicas (quê + como) em caso de rejeição
- Rodada de revisão indicada
- review.md gravado antes de avançar ao Passo 12
