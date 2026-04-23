---
step: 7
name: content-approval
type: checkpoint
inputFile: squads/instagram-carrossel/output/carousel-content.md
outputFile: squads/instagram-carrossel/output/content-approval.md
---

## Contexto

Carlos Carrossel concluiu o conteúdo do carrossel. Antes de passar para a direção de arte e renderização, você precisa aprovar o copy, a legenda e as hashtags.

**Por que este checkpoint é importante:** Uma vez aprovado, o conteúdo vai para Beatriz Briefing criar o briefing visual. Alterações de copy depois do design são custosas — é mais eficiente ajustar agora.

---

## Context Loading

Ler e apresentar `squads/instagram-carrossel/output/carousel-content.md` integralmente ao usuário.

---

## Instructions

### Process

1. **Apresentar o conteúdo completo** do carousel-content.md:
   - Ângulo e formato selecionados
   - Todos os slides com headline, texto de suporte e background
   - Legenda completa (indicar os primeiros 125 chars como hook)
   - Hashtags selecionadas

2. **Solicitar decisão** do usuário:
   - **APROVAR** — prosseguir para direção de arte (Beatriz Briefing)
   - **REJEITAR com feedback** — retornar ao Passo 6 com correções solicitadas
   - **Ajuste específico** — alterar um slide/trecho específico antes de aprovar

3. **Se APROVADO:** gravar content-approval.md e avançar para Passo 8 (design-slides)
4. **Se REJEITADO:** registrar feedback e retornar ao Passo 6 (create-carousel)

### Output Format

Apresentar ao usuário:
```
## Conteúdo do Carrossel — Revisão

**Ângulo:** [nome] | **Tom:** [tom] | **Formato:** [formato] ([N] slides)

---

[Slide 1 — Cover]
**Headline:** [texto]
**Texto:** [texto]
*Background: [descrição]*

[Slide 2 — nome]
**Headline:** [texto]
**Texto:** [texto]

[... todos os slides ...]

---

**LEGENDA**
*(Hook — primeiros 125 chars):*
[hook separado]

*(Corpo completo):*
[legenda completa]

---

**HASHTAGS**
[hashtags]

---

**APROVAR** (avançar para direção de arte) ou **REJEITAR** com feedback:
```

Após decisão, gravar em `squads/instagram-carrossel/output/content-approval.md`:
```
DECISÃO: [APROVADO / REJEITADO]
Data: [YYYY-MM-DD]
Feedback do usuário: [feedback se houver]
Próxima ação: [design-slides se APROVADO / create-carousel se REJEITADO]
```

### Output Example

```
## Conteúdo do Carrossel — Revisão

**Ângulo:** IA Não É Ficção Científica | **Tom:** Tom 2 — Educativo e Acessível | **Formato:** Mito vs Realidade (7 slides)

---

**Slide 1 — Cover (ímpar)**
**Headline:** 7 mitos sobre IA que estão travando sua empresa
**Texto:** O Gartner confirmou: 70% das Fortune 500 já usam IA generativa. Se a sua não usa, o problema provavelmente não é a tecnologia.
*Background: Executivo em sala de reunião olhando para dashboard, fundo escuro*

[... slides 2-7 ...]

---

**LEGENDA**
*(Hook — 123 chars):*
7 em cada 10 gestores ainda acham que IA é coisa de empresa de tecnologia. O Gartner discorda.

*(Corpo completo):*
[legenda inteira]

---

**HASHTAGS**
#inovacaocorporativa #inteligenciaartificial #openinnovation #innovationlatam #transformacaodigital #inovacao #startups #futurodotrabalho #gestaoempresarial #lideranca #ia #tecnologiaempresarial

---

APROVAR (avançar para direção de arte) ou REJEITAR com feedback:
```

### Veto Conditions

- **NÃO avançar** para o Passo 8 sem APROVAÇÃO explícita do usuário
- **NUNCA assumir** que ausência de resposta negativa é aprovação
- **Se REJEITADO:** registrar o feedback completo em content-approval.md antes de retornar ao Passo 6

### Quality Criteria

- Conteúdo completo apresentado (não resumido ou truncado)
- Primeiros 125 chars da legenda destacados como hook para revisão fácil
- content-approval.md gravado com decisão clara antes de avançar
- Retorno ao Passo 6 se rejeitado, com feedback registrado
