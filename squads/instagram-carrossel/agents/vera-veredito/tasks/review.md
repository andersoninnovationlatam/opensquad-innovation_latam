---
task: review
order: 1
agent: vera-veredito
input:
  - squads/instagram-carrossel/output/carousel-content.md
  - squads/instagram-carrossel/output/slides/
  - squads/instagram-carrossel/pipeline/data/quality-criteria.md
  - squads/instagram-carrossel/pipeline/data/visual-identity.md
output: squads/instagram-carrossel/output/review.md
on_reject: 6
---

## Process

### Passo 1 — Ler todos os arquivos de entrada
Ler `squads/instagram-carrossel/output/carousel-content.md` integralmente:
- Todos os slides (headline + texto de suporte + background)
- Legenda completa (incluindo os primeiros 125 caracteres)
- Hashtags selecionadas

Examinar `squads/instagram-carrossel/output/slides/` (screenshots ou listagem de arquivos):
- Presença de branding (logo + handle) em cada slide
- Posicionamento do branding (canto inferior direito)
- Legibilidade e contraste visual

Ler `squads/instagram-carrossel/pipeline/data/quality-criteria.md` para:
- Descrição detalhada de cada critério
- Tabela de scores (1-10) por critério
- Regras de veredicto (APROVAR / APROVAR CONDICIONAL / REJEITAR)
- Lista de critérios críticos (rejeição automática se < 4)

Ler `squads/instagram-carrossel/pipeline/data/visual-identity.md` para referência de:
- Regras de branding (posição, elementos, contraste)
- Swipe hint e CTA do último slide

### Passo 2 — Avaliar os 8 critérios individualmente
Para cada critério, atribuir score de 1 a 10 com justificativa específica na mesma frase:

| # | Critério | Critério Crítico? |
|---|----------|-------------------|
| 1 | Relevância ao Brief | SIM — score < 4 = rejeição automática |
| 2 | Hook do Slide 1 | SIM — score < 4 = rejeição automática |
| 3 | Texto por slide (40-80 palavras) | NÃO |
| 4 | Tom de voz | NÃO |
| 5 | Branding visual (logo + handle todos os slides) | SIM — score < 4 = rejeição automática |
| 6 | CTA do último slide | NÃO |
| 7 | Legenda (hook nos primeiros 125 chars) | NÃO |
| 8 | Hashtags (8-12, mix niche/mid/broad) | NÃO |

**Para cada critério:**
1. Verificar contra o quality-criteria.md (tabela de scores por critério)
2. Atribuir score de 1 a 10
3. Escrever justificativa de 1-2 linhas específica ao conteúdo avaliado
4. Se score < 7 em critério não-crítico: indicar como corrigir
5. Se score < 4 em critério crítico: marcar como REJEIÇÃO AUTOMÁTICA

**Critério 3 — Verificar contagem de palavras:**
Contar as palavras de headline + texto de suporte de CADA slide:
- 40-80 palavras = dentro do intervalo
- < 40 palavras = raso (indicar o slide e a contagem)
- > 80 palavras = muito longo (indicar o slide, a contagem e sugestão de corte)

**Critério 7 — Verificar os primeiros 125 caracteres da legenda:**
Contar exatamente os primeiros 125 caracteres da legenda:
- Se funciona como hook standalone: positivo
- Se começa com contexto ou apresentação: negativo com indicação específica

**Critério 8 — Verificar hashtags:**
Contar o total de hashtags e classificar por tipo:
- Niche (< 500k posts), Mid-range (500k-5M), Broad (> 5M)
- Verificar equilíbrio do mix

### Passo 3 — Identificar forças e problemas
**Forças (pelo menos 1 obrigatória):**
- Identificar o(s) elemento(s) que funcionaram excepcionalmente bem
- Ser específico: citar o slide, dado, frase ou escolha de design que se destaca

**Mudanças obrigatórias (se houver):**
- Listar cada mudança que impede aprovação/publicação
- Formato: "Critério [N] — [descrição específica do problema]: [instrução de correção]"

**Sugestões não-bloqueantes (se houver):**
- Melhorias que enriqueceriam o conteúdo mas não bloqueiam publicação
- Formato: "Sugestão: [descrição] — [por que melhoraria]"

### Passo 4 — Calcular média e determinar veredicto
Calcular a média de todos os 8 scores.

**Regras de veredicto:**
- **APROVAR:** média >= 7,0 AND nenhum critério < 4
- **APROVAR CONDICIONAL:** média >= 7,0 AND 1-2 critérios não-críticos entre 4-6 (os críticos devem ser >= 7)
- **REJEITAR:** média < 7,0 OR qualquer critério < 4

**Em caso de REJEITAR:**
- Informar que o conteúdo retorna ao Passo 6 (create-carousel)
- Incluir feedback completo para Carlos Carrossel

### Passo 5 — Gravar o review em review.md
Gravar o review estruturado em `squads/instagram-carrossel/output/review.md` seguindo o formato definido abaixo.

---

## Output Format

```
==============================
 VEREDICTO: [APROVAR / APROVAR CONDICIONAL / REJEITAR]
==============================
Carrossel: "[título do carrossel]"
Revisão: [N] de 3 | Data: [YYYY-MM-DD]

TABELA DE SCORES
| Critério                | Score | Resumo da justificativa                    |
|-------------------------|-------|--------------------------------------------|
| Relevância ao brief     |  X/10 | [justificativa específica ao conteúdo]     |
| Hook do slide 1         |  X/10 | [justificativa específica]                 |
| Texto por slide         |  X/10 | [justificativa — mencionar slides se fora] |
| Tom de voz              |  X/10 | [justificativa específica]                 |
| Branding visual         |  X/10 | [justificativa — todos os slides?]         |
| CTA do último slide     |  X/10 | [justificativa específica]                 |
| Legenda                 |  X/10 | [justificativa — mencionar 125 chars]      |
| Hashtags                |  X/10 | [justificativa — contagem e mix]           |
MÉDIA GERAL: X.X/10

---

Força: [elemento específico que funcionou excepcionalmente — citar slide, dado ou escolha]

[Se APROVAR ou APROVAR CONDICIONAL:]
Sugestão não-bloqueante: [melhoria que enriqueceria mas não bloqueia]

[Se APROVAR CONDICIONAL:]
Mudança recomendada antes da publicação: [critério + problema + instrução]

[Se REJEITAR:]
Mudanças obrigatórias (retorno ao Passo 6):
1. [Critério N] — [problema específico]: [instrução de correção]
2. [Critério N] — [problema específico]: [instrução de correção]
[...]

---

VEREDICTO: [APROVAR / APROVAR CONDICIONAL / REJEITAR]
[Se REJEITAR:] Retornar ao Passo 6 — create-carousel com as correções acima.
```

---

## Output Example

```
==============================
 VEREDICTO: APROVAR
==============================
Carrossel: "7 mitos sobre IA que estão travando sua empresa"
Revisão: 1 de 3 | Data: 2026-04-05

TABELA DE SCORES
| Critério                | Score | Resumo da justificativa                                         |
|-------------------------|-------|-----------------------------------------------------------------|
| Relevância ao brief     |  9/10 | Alinhado ao dado Gartner pesquisado; contexto Latam presente    |
| Hook do slide 1         |  8/10 | "7 mitos" para o scroll; poderia ter dado mais específico       |
| Texto por slide         |  8/10 | 6/7 slides dentro de 40-80 palavras; slide 4 com 78 palavras    |
| Tom de voz              |  9/10 | Educativo e acessível consistente do slide 1 ao CTA             |
| Branding visual         | 10/10 | Logo + handle presentes e legíveis em todos os 7 slides         |
| CTA do último slide     |  8/10 | Pergunta específica conectada ao tema de IA e inovação          |
| Legenda                 |  8/10 | Hook nos 123 chars; corpo aprofunda sem repetir os slides       |
| Hashtags                |  9/10 | 12 hashtags, mix equilibrado: 4 niche + 5 mid + 3 broad         |
MÉDIA GERAL: 8.6/10

---

Força: O slide 4 usa dado específico (POC em 6-12 semanas / R$ 50-150k) que desmistifica o custo de IA de forma prática e acionável. É o slide com maior probabilidade de save — o executivo em avaliação vai querer mostrar esse número para o CFO.

Sugestão não-bloqueante: O hook do slide 1 poderia ganhar força com um número específico de empresa brasileira além do dado Gartner global — por exemplo, citar o Bradesco ou Itaú logo no headline criaria identificação imediata com o público local.

---

VEREDICTO: APROVAR
Próximo passo: checkpoint final-approval para decisão de publicação.
```

**Exemplo de veredicto REJEITAR:**
```
==============================
 VEREDICTO: REJEITAR
==============================
Carrossel: "Como a IA está transformando a inovação"
Revisão: 1 de 3 | Data: 2026-04-05

TABELA DE SCORES
| Critério                | Score | Resumo da justificativa                                            |
|-------------------------|-------|--------------------------------------------------------------------|
| Relevância ao brief     |  7/10 | Relacionado ao tema, mas ângulo muito genérico para público B2B    |
| Hook do slide 1         |  3/10 | "A IA está mudando tudo" — afirmação genérica, não para o scroll   |
| Texto por slide         |  5/10 | Slides 2, 4 e 6 com mais de 80 palavras (92, 87 e 98 palavras)     |
| Tom de voz              |  6/10 | Oscilação entre educativo e inspirador; inconsistência nos slides 3-5 |
| Branding visual         |  8/10 | Logo presente em todos os slides, bom contraste                    |
| CTA do último slide     |  5/10 | "Curta e siga" — não é CTA específico; sem pergunta conectada       |
| Legenda                 |  4/10 | Abre com "Neste post..." — desperdiça 125 chars com apresentação   |
| Hashtags                |  7/10 | 10 hashtags, mix razoável; 2 hashtags genéricas demais             |
MÉDIA GERAL: 5.6/10

---

Força: O branding visual está impecável — logo e handle em todos os slides com contraste correto e posicionamento consistente.

Mudanças obrigatórias (retorno ao Passo 6):

1. [Critério 2 — Hook do slide 1, CRÍTICO] "A IA está mudando tudo" não para o scroll: reescrever com dado específico ou afirmação provocativa baseada no dado Gartner da pauta selecionada.

2. [Critério 3 — Texto por slide] Slides 2, 4 e 6 excedem 80 palavras (92, 87 e 98 palavras respectivamente): cortar cada um até máximo 80 palavras, priorizando a frase mais fraca de cada slide.

3. [Critério 6 — CTA do último slide] "Curta e siga" não é CTA acionável: substituir por pergunta específica conectada ao tema de IA (ex: "Comenta: qual o maior obstáculo de IA na sua empresa?").

4. [Critério 7 — Legenda] Abertura "Neste post..." desperdiça os 125 chars de hook: reescrever para começar com a afirmação ou dado mais impactante do carrossel.

---

VEREDICTO: REJEITAR
Retornar ao Passo 6 — create-carousel com as 4 correções obrigatórias acima.
```

---

## Quality Criteria

1. Todos os 8 critérios avaliados com score de 1-10 e justificativa específica ao conteúdo
2. Tabela de scores completa antes do veredicto
3. Média geral calculada corretamente (soma dos 8 scores / 8)
4. Veredicto aplicado pela regra correta: APROVAR, APROVAR CONDICIONAL ou REJEITAR
5. Pelo menos 1 Força identificada e nomeada com especificidade (citar slide ou elemento)
6. Mudanças obrigatórias listadas separadamente de sugestões, com instrução de correção
7. Rodada de revisão indicada ("Revisão N de 3")
8. Em caso de REJEITAR: informar retorno ao Passo 6 com feedback completo

---

## Veto Conditions

- **NUNCA aprovar carrossel com média < 7,0** — as regras de veredicto são inegociáveis
- **NUNCA aprovar carrossel com qualquer critério < 4** — mesmo que a média seja >= 7
- **NUNCA emitir score sem justificativa** — "8/10" sozinho é proibido; justificativa é parte do score
- **NUNCA rejeitar sem indicar correção específica** — feedback impede iteração eficiente
- **NUNCA omitir a identificação de Força** — mesmo em rejeição, reconhecer o que funcionou
- **PARAR se** carousel-content.md não existir — solicitar que o pipeline seja executado corretamente
