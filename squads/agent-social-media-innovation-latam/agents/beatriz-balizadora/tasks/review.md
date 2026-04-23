---
task: review
agent: beatriz-balizadora
order: 1
input:
  - squads/agent-social-media-innovation-latam/output/carousel-draft.md
  - squads/agent-social-media-innovation-latam/output/slides/rendered/
output:
  - squads/agent-social-media-innovation-latam/output/review.md
---

## Process

1. **Ler o carousel-draft.md completo.** Absorver o copy de todos os slides, a caption e os hashtags.

2. **Verificar veto conditions explicitamente.** Ir pela lista das 9 veto conditions e marcar ATIVADA ou não ativada para cada uma. Se qualquer veto está ativada: REJECT imediato — documentar qual veto e por quê.

3. **Avaliar critérios de copy (C1-C6)** lendo o carousel-draft.md:
   - C1: O slide 1 para o scroll de qualquer pessoa? (peso 1.5×)
   - C2: Todas as afirmações factuais têm dado/fonte?
   - C3: Os slides contam uma história coerente?
   - C4: O penúltimo slide entrega reflexão memorável (sem dado novo)?
   - C5: O CTA é específico e tem 2 ações conectadas ao tema?
   - C6: O tom é didático-revelador, alinhado com a Innovation Latam?

4. **Avaliar critérios visuais (V1-V3)** olhando os PNGs renderizados:
   - V1: Todos os slides usam o sistema post-05 (Montserrat, paleta, logo)?
   - V2: Texto ≥36px body, WCAG AA em todos os slides?
   - V3: O visual é impactante e fiel à identidade roxa/teal da Innovation Latam?

5. **Calcular a média ponderada:**
   - Peso copy: C1×1.5 + C2 + C3 + C4 + C5 + C6 = soma / 7.5
   - Peso visual: (V1 + V2 + V3) / 3
   - Média final: (soma_copy_ponderada + média_visual) / 2

6. **Emitir o veredicto:**
   - APPROVE: média ≥ 7.0 e nenhum critério abaixo de 4/10
   - CONDITIONAL APPROVE: média ≥ 7.0 com itens não-bloqueantes
   - REJECT: média < 7.0 OU qualquer critério abaixo de 4/10 OU veto ativado

7. **Listar Required changes e Suggestions.** Required change com localização exata. Suggestion com contextualização de melhoria.

## Output Format

```markdown
# Review — [TÍTULO DO CARROSSEL]
**Revisado por:** Beatriz Balizadora
**Data:** [YYYY-MM-DD]
**Veredicto:** APPROVE / CONDITIONAL APPROVE / REJECT

---

## Verificação de Veto Conditions

| # | Veto Condition | Status |
|---|----------------|--------|
| 1 | Slide 1 começa com marca ou "Hoje vamos falar" | ✓ não ativada / ⚠️ ATIVADA |
| 2 | Afirmação factual central sem dado ou fonte | ✓ não ativada / ⚠️ ATIVADA |
| 3 | Menos de 7 ou mais de 9 slides | ✓ não ativada / ⚠️ ATIVADA |
| 4 | Caption com mais de 2.200 caracteres | ✓ não ativada / ⚠️ ATIVADA |
| 5 | HTML não renderizável ou texto cortado | ✓ não ativada / ⚠️ ATIVADA |
| 6 | Todos os slides com mesmo layout | ✓ não ativada / ⚠️ ATIVADA |
| 7 | Fonte diferente de Montserrat em qualquer slide | ✓ não ativada / ⚠️ ATIVADA |
| 8 | Logo ausente em qualquer slide | ✓ não ativada / ⚠️ ATIVADA |
| 9 | Contraste abaixo de 4.5:1 sem overlay adequado | ✓ não ativada / ⚠️ ATIVADA |

---

## Avaliação de Copy (C1-C6)

### C1: Scroll-Stop Test ⭐ (PESO 1.5×)
**Score:** [N]/10
**Justificativa:** [1-3 linhas específicas sobre o slide 1 — o que funciona ou não funciona]

### C2: Data Integrity
**Score:** [N]/10
**Justificativa:** [quais afirmações têm ou não têm fonte — localização exata]

### C3: Story Coherence
**Score:** [N]/10
**Justificativa:** [análise da progressão narrativa — algum slide isolado?]

### C4: Reflexão Final
**Score:** [N]/10
**Justificativa:** [avaliação do slide de reflexão — é síntese emocional ou tem dado novo?]

### C5: CTA Specificity
**Score:** [N]/10
**Justificativa:** [as duas ações são específicas e conectadas ao tema?]

### C6: Brand Voice Alignment
**Score:** [N]/10
**Justificativa:** [o tom é didático-revelador no padrão Innovation Latam?]

---

## Avaliação Visual (V1-V3)

### V1: Design System Consistency
**Score:** [N]/10
**Justificativa:** [Montserrat presente, paleta correta, logo em todos os slides?]

### V2: Readability
**Score:** [N]/10
**Justificativa:** [tamanhos de fonte, contraste — slide específico com problema se houver]

### V3: Visual Impact
**Score:** [N]/10
**Justificativa:** [o visual impacta e representa a identidade Innovation Latam?]

---

## Cálculo da Média

| Componente | Cálculo | Resultado |
|------------|---------|-----------|
| Copy ponderado | (C1×1.5 + C2 + C3 + C4 + C5 + C6) / 7.5 | [X.X] |
| Visual | (V1 + V2 + V3) / 3 | [X.X] |
| **Média final** | (copy + visual) / 2 | **[X.X]** |

---

## Veredicto: [APPROVE / CONDITIONAL APPROVE / REJECT]

[1-2 linhas explicando o veredicto]

---

## Required Changes (bloqueantes)

[Se APPROVE: "Nenhuma mudança obrigatória."]

[Se CONDITIONAL APPROVE ou REJECT:]
1. **[Localização exata]:** [descrição do problema] → [instrução de correção específica]
2. [...]

---

## Suggestions (non-blocking)

1. **[Localização]:** [sugestão de melhoria não-bloqueante]
2. [...]
```

## Output Example

```markdown
# Review — IA Corporativa: O Gap que Ninguém Fala
**Revisado por:** Beatriz Balizadora
**Data:** 2026-04-01
**Veredicto:** APPROVE

---

## Verificação de Veto Conditions

| # | Veto Condition | Status |
|---|----------------|--------|
| 1 | Slide 1 começa com marca ou "Hoje vamos falar" | ✓ não ativada |
| 2 | Afirmação factual central sem dado ou fonte | ✓ não ativada |
| 3 | Menos de 7 ou mais de 9 slides | ✓ não ativada (8 slides) |
| 4 | Caption com mais de 2.200 caracteres | ✓ não ativada (784 chars) |
| 5 | HTML não renderizável ou texto cortado | ✓ não ativada |
| 6 | Todos os slides com mesmo layout | ✓ não ativada (4 variações distintas) |
| 7 | Fonte diferente de Montserrat em qualquer slide | ✓ não ativada |
| 8 | Logo ausente em qualquer slide | ✓ não ativada (logo em 8/8 slides) |
| 9 | Contraste abaixo de 4.5:1 sem overlay adequado | ✓ não ativada |

---

## Avaliação de Copy (C1-C6)

### C1: Scroll-Stop Test ⭐ (PESO 1.5×)
**Score:** 9/10
**Justificativa:** "78% das empresas dizem que IA é prioridade. Só 12% têm um programa real." — altamente eficaz. O gap contraintuitivo para qualquer executivo que acompanha o mercado. Formato de 2 linhas curtas é perfeito para o scroll. Perde 1 ponto por não ter um elemento visual descrito de forma mais específica no draft.

### C2: Data Integrity
**Score:** 9/10
**Justificativa:** Todos os dados têm fonte identificada: McKinsey (2025), Harvard Business Review (2024), Gartner (2025), WEF (2024). Um dado no slide 5 menciona WEF mas não especifica o ano do relatório exato — não é bloqueante mas seria ideal completar.

### C3: Story Coherence
**Score:** 9/10
**Justificativa:** Progressão clara: gap (S1) → O que explica (S2) → Por que TI não funciona (S3) → Erro de abordagem (S4) → Solução startup (S5) → Custo de esperar (S6) → Reflexão (S7) → CTA (S8). Cada slide é consequência do anterior. Coerência narrativa excelente.

### C4: Reflexão Final
**Score:** 8/10
**Justificativa:** Slide 7 entrega reflexão real: "Você está nos 12% que fazem ou nos 66% que falam?" — toca diretamente na realidade do leitor profissional de inovação. Poderia ser ligeiramente mais poético na segunda linha, mas cumpre o papel com honestidade.

### C5: CTA Specificity
**Score:** 9/10
**Justificativa:** Duas ações específicas: (1) Salva para a próxima reunião de estratégia, (2) Comenta em qual grupo sua empresa está. Ambas conectadas diretamente ao conteúdo do carrossel. Excelente.

### C6: Brand Voice Alignment
**Score:** 9/10
**Justificativa:** Tom didático-revelador consistente — dado → contexto → implicação → reflexão. Linguagem profissional com energia empreendedora. Zero jargão de marketing. Alinhado ao padrão Innovation Latam.

---

## Avaliação Visual (V1-V3)

### V1: Design System Consistency
**Score:** 9/10
**Justificativa:** Montserrat em todos os slides confirmado. Paleta roxo/teal/gold respeitada. Logo branco presente e posicionado corretamente em 8/8 slides. Rodapé @innovationlatam | ARRASTE → nos slides 1-6, ausente nos slides 7-8 (correto).

### V2: Readability
**Score:** 8/10
**Justificativa:** Body text em 40px na maioria dos slides (conforme padrão post-05). Slide 2 usa 36px para body mais longo — aceitável. Contraste calculado acima de 4.5:1 em todos os slides. Perde 1 ponto pois a fonte da citação nos slides de desenvolvimento (32px) está no limite inferior.

### V3: Visual Impact
**Score:** 8/10
**Justificativa:** Cover Layout com AI brain glow impacta bem. Slides roxos com variação entre Standard e Split criam ritmo visual. CTA Layout com botão teal é visualmente distinto. Perde 1 ponto pois o Reflection Layout poderia ter um detalhe visual adicional (linha decorativa, subtle glow) para maximizar o impacto do momento reflexivo.

---

## Cálculo da Média

| Componente | Cálculo | Resultado |
|------------|---------|-----------|
| Copy ponderado | (9×1.5 + 9 + 9 + 8 + 9 + 9) / 7.5 | 8.87 |
| Visual | (9 + 8 + 8) / 3 | 8.33 |
| **Média final** | (8.87 + 8.33) / 2 | **8.60** |

---

## Veredicto: APPROVE

Carrossel com qualidade editorial e visual acima do mínimo em todos os critérios. Nenhum veto ativado. Média final 8.60 — aprovado para publicação.

---

## Required Changes (bloqueantes)

Nenhuma mudança obrigatória.

---

## Suggestions (non-blocking)

1. **Slide 5, fonte da citação:** Especificar o ano exato do relatório WEF mencionado — "World Economic Forum, 2024" em vez de apenas "(WEF)".
2. **Slide 7 (Reflection Layout):** Considerar adicionar um sutil glow roxo ou linha decorativa para enriquecer o impacto visual do momento de reflexão sem sair dos tokens do sistema.
3. **Caption:** A pergunta final "Em qual lado dessa divisão a sua empresa está?" poderia ser ligeiramente mais específica para profissionais C-level — ex: "Qual decisão de Q2 vai fazer a diferença para o seu programa de IA?"
```

## Quality Criteria

- Todos os 9 critérios (C1-C6, V1-V3) avaliados com score numérico E justificativa de 1-3 linhas
- Todas as 9 veto conditions verificadas explicitamente com status ATIVADA ou não ativada
- Média ponderada calculada e documentada com C1 a 1.5× explícito
- Veredicto claro e fundamentado com base no cálculo
- Pelo menos uma sugestão não-bloqueante mesmo em APPROVE

## Veto Conditions

1. Review emitido sem verificar explicitamente todas as 9 veto conditions do quality-criteria.md — revisão incompleta
2. Score emitido sem justificativa específica — feedback não-acionável que invalida o propósito da revisão
