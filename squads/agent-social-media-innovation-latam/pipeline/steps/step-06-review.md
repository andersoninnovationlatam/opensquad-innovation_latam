---
execution: inline
agent: beatriz-balizadora
inputFile: squads/agent-social-media-innovation-latam/output/carousel-draft.md
outputFile: squads/agent-social-media-innovation-latam/output/review.md
on_reject: 3
---

## Context Loading

Antes de executar, carregar:
- `squads/agent-social-media-innovation-latam/output/carousel-draft.md` — copy completo para avaliação editorial
- `squads/agent-social-media-innovation-latam/output/slides/rendered/` — PNGs para avaliação visual
- `squads/agent-social-media-innovation-latam/pipeline/data/quality-criteria.md` — critérios C1-C6, V1-V3 e veto conditions
- `squads/agent-social-media-innovation-latam/pipeline/data/tone-of-voice.md` — referência de tom para C6
- `squads/agent-social-media-innovation-latam/agents/beatriz-balizadora/tasks/review.md` — task file detalhado

## Instructions

### Process

1. **Ler o carousel-draft.md completo.** Absorver o copy de todos os slides, a caption e os hashtags.

2. **Verificar as 9 veto conditions explicitamente.** Marcar cada uma como "não ativada" ou "ATIVADA". Se qualquer veto estiver ativada: REJECT imediato com documentação clara.

3. **Avaliar C1-C6 (copy).** Dar score 1-10 com justificativa de 1-3 linhas específicas para cada critério. C1 tem peso 1.5× no cálculo.

4. **Avaliar V1-V3 (visual).** Olhar os PNGs renderizados e dar score 1-10 com justificativa específica. V1 verifica sistema post-05, V2 verifica legibilidade e WCAG, V3 verifica impacto visual.

5. **Calcular a média ponderada:**
   - Componente copy: (C1×1.5 + C2 + C3 + C4 + C5 + C6) / 7.5
   - Componente visual: (V1 + V2 + V3) / 3
   - Média final: (copy + visual) / 2

6. **Emitir veredicto:**
   - APPROVE: média ≥ 7.0, nenhum critério abaixo de 4/10, nenhum veto ativado
   - CONDITIONAL APPROVE: média ≥ 7.0 com itens não-bloqueantes identificados
   - REJECT: média < 7.0 OU critério abaixo de 4/10 OU veto ativado

7. **Listar Required changes** com localização exata (Slide N, elemento) e instrução de correção.

8. **Listar Suggestions** (non-blocking) com contexto de melhoria.

9. **Em caso de REJECT:** O pipeline retorna ao step-03 (Carlos Conteúdo). Carlos recebe este review.md como input adicional para reescrita.

## Output Format

```markdown
# Review — [TÍTULO DO CARROSSEL]
**Revisado por:** Beatriz Balizadora
**Data:** [YYYY-MM-DD]
**Veredicto:** [APPROVE / CONDITIONAL APPROVE / REJECT]

---

## Verificação de Veto Conditions

| # | Veto Condition | Status |
|---|----------------|--------|
| 1 | Slide 1 começa com marca ou "Hoje vamos falar" | [✓ não ativada / ⚠️ ATIVADA] |
| 2 | Afirmação factual central sem dado ou fonte | [✓ / ⚠️] |
| 3 | Menos de 7 ou mais de 9 slides | [✓ / ⚠️] |
| 4 | Caption com mais de 2.200 caracteres | [✓ / ⚠️] |
| 5 | HTML não renderizável ou texto cortado | [✓ / ⚠️] |
| 6 | Todos os slides com mesmo layout | [✓ / ⚠️] |
| 7 | Fonte diferente de Montserrat em qualquer slide | [✓ / ⚠️] |
| 8 | Logo ausente em qualquer slide | [✓ / ⚠️] |
| 9 | Contraste abaixo de 4.5:1 sem overlay adequado | [✓ / ⚠️] |

---

## Avaliação de Copy (C1-C6)

### C1: Scroll-Stop Test ⭐ (PESO 1.5×)
**Score:** [N]/10
**Justificativa:** [análise específica do slide 1]

### C2: Data Integrity
**Score:** [N]/10
**Justificativa:** [afirmações com ou sem fonte — localização exata]

### C3: Story Coherence
**Score:** [N]/10
**Justificativa:** [progressão narrativa — algum slide isolado?]

### C4: Reflexão Final
**Score:** [N]/10
**Justificativa:** [slide de reflexão — síntese emocional ou dado novo?]

### C5: CTA Specificity
**Score:** [N]/10
**Justificativa:** [as 2 ações são específicas e conectadas ao tema?]

### C6: Brand Voice Alignment
**Score:** [N]/10
**Justificativa:** [tom didático-revelador no padrão Innovation Latam?]

---

## Avaliação Visual (V1-V3)

### V1: Design System Consistency
**Score:** [N]/10
**Justificativa:** [Montserrat, paleta, logo, rodapé — sistema post-05 intacto?]

### V2: Readability
**Score:** [N]/10
**Justificativa:** [tamanhos de fonte, contraste — slide específico com problema?]

### V3: Visual Impact
**Score:** [N]/10
**Justificativa:** [impacto visual fiel à identidade Innovation Latam?]

---

## Cálculo da Média

| Componente | Cálculo | Resultado |
|------------|---------|-----------|
| Copy ponderado | (C1×1.5 + C2 + C3 + C4 + C5 + C6) / 7.5 | [X.X] |
| Visual | (V1 + V2 + V3) / 3 | [X.X] |
| **Média final** | (copy + visual) / 2 | **[X.X]** |

---

## Veredicto: [APPROVE / CONDITIONAL APPROVE / REJECT]

[1-2 linhas fundamentando o veredicto com base nos scores e no cálculo]

---

## Required Changes (bloqueantes)

[Se APPROVE: "Nenhuma mudança obrigatória."]

[Se REJECT ou CONDITIONAL APPROVE:]
1. **[Slide N, elemento]:** [problema] → [instrução de correção]

---

## Suggestions (non-blocking)

1. **[Localização]:** [sugestão de melhoria não-bloqueante]
```

## Output Example

```markdown
# Review — Open Innovation: A Janela que Está Aberta
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
| 4 | Caption com mais de 2.200 caracteres | ✓ não ativada (712 chars) |
| 5 | HTML não renderizável ou texto cortado | ✓ não ativada |
| 6 | Todos os slides com mesmo layout | ✓ não ativada (4 variações distintas) |
| 7 | Fonte diferente de Montserrat em qualquer slide | ✓ não ativada |
| 8 | Logo ausente em qualquer slide | ✓ não ativada (logo em 8/8) |
| 9 | Contraste abaixo de 4.5:1 sem overlay adequado | ✓ não ativada |

---

## Avaliação de Copy (C1-C6)

### C1: Scroll-Stop Test ⭐ (PESO 1.5×)
**Score:** 9/10
**Justificativa:** "Para cada R$1 investido em open innovation por mais de 12 meses: R$3,20 de retorno." — imediato, específico e surpreendente. Qualquer CFO para no feed. O número de retorno ROI funciona como gancho de alta intensidade para a audiência corporativa da Innovation Latam. Perde 1 ponto por não ter o dado de contraste (71%) já no slide 1.

### C2: Data Integrity
**Score:** 9/10
**Justificativa:** Todos os dados têm fonte identificada: Abstartups 2025 (2×), Distrito 2024, Gartner 2025, WEF 2024. Um único ponto no slide 6 usa "(WEF)" sem especificar o relatório exato — não bloqueante.

### C3: Story Coherence
**Score:** 9/10
**Justificativa:** Progressão narrativa excelente: ROI existe (S1) → O que é ROI na prática (S2) → Por que 71% não chegam lá (S3) → O que faz chegar (S4) → O crescimento do mercado (S5) → Quem está na frente (S6) → Reflexão (S7) → CTA (S8). Cada slide é consequência do anterior.

### C4: Reflexão Final
**Score:** 8/10
**Justificativa:** Slide 7 entrega reflexão genuína: "A pergunta não é 'devemos fazer open innovation'. É 'quanto custa não fazer?'" — inverte a pergunta do leitor de forma construtiva. Poderia ser levemente mais emocional para tocar ainda mais fundo, mas cumpre o papel.

### C5: CTA Specificity
**Score:** 9/10
**Justificativa:** Ação 1: "Salva para a próxima reunião de estratégia de inovação" — específica ao contexto do leitor. Ação 2: "Comenta: sua empresa já tem open innovation? O que está funcionando ou travando?" — engaja e cria comunidade. Ambas diretamente conectadas ao conteúdo.

### C6: Brand Voice Alignment
**Score:** 9/10
**Justificativa:** Tom didático-revelador consistente em todos os slides. Linguagem de pares inteligentes, não de marca corporativa. Zero jargão de marketing. Alinha perfeitamente ao perfil Innovation Latam.

---

## Avaliação Visual (V1-V3)

### V1: Design System Consistency
**Score:** 9/10
**Justificativa:** Montserrat confirmado em 8/8 slides. Paleta post-05 intacta (roxo bg, teal, gold). Logo branco presente e posicionado corretamente. Rodapé @innovationlatam | ARRASTE → nos slides 1-6, ausente nos slides 7-8 conforme especificação.

### V2: Readability
**Score:** 8/10
**Justificativa:** Body em 40px nos slides 3-6 (padrão post-05). Slide 2 usa 36px para acomodar maior volume de texto — aceitável. WCAG AA confirmado em todos os slides. Fonte de citação em 28px no limite inferior — não bloqueante.

### V3: Visual Impact
**Score:** 8/10
**Justificativa:** Cover com imagem de pitch event impacta. Split Layout com callout box teal cria hierarquia visual forte. CTA com botão teal sólido é visualmente distinto. Reflection Layout com texto centralizado cria pausa eficaz. Perde 1 ponto pois o slide 5 (Standard) é visualmente mais neutro — poderia usar uma variação Split para mais ritmo.

---

## Cálculo da Média

| Componente | Cálculo | Resultado |
|------------|---------|-----------|
| Copy ponderado | (9×1.5 + 9 + 9 + 8 + 9 + 9) / 7.5 | 8.87 |
| Visual | (9 + 8 + 8) / 3 | 8.33 |
| **Média final** | (8.87 + 8.33) / 2 | **8.60** |

---

## Veredicto: APPROVE

Carrossel com qualidade editorial e visual sólida — média 8.60, nenhum veto ativado, nenhum critério abaixo de 4/10. Aprovado para publicação.

---

## Required Changes (bloqueantes)

Nenhuma mudança obrigatória.

---

## Suggestions (non-blocking)

1. **Slide 5 (Standard Layout):** Considerar converter para Split Content Layout com callout box destacando o dado "43%" — criaria mais ritmo visual na sequência de slides 3-6.
2. **Slide 6, citação WEF:** Especificar o ano exato: "(World Economic Forum, 2024)" em vez de apenas "(WEF)".
3. **Slide 7 (Reflection Layout):** Um sutil radial gradient ou glow roxo no centro do slide enriqueceria o impacto visual do momento reflexivo sem sair dos tokens do sistema.
```

## Veto Conditions

1. Review emitido sem verificar explicitamente todas as 9 veto conditions — revisão incompleta que não serve de gate de qualidade
2. Score emitido sem justificativa específica — feedback não-acionável que invalida o propósito da revisão de qualidade

## Quality Criteria

- Todos os 9 critérios (C1-C6, V1-V3) com score e justificativa específica de 1-3 linhas
- Todas as 9 veto conditions verificadas com status explícito
- Média ponderada calculada e documentada em tabela
- Veredicto claro com fundamentação no cálculo
- Pelo menos uma sugestão não-bloqueante mesmo em APPROVE
