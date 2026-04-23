---
task: "Generate Emotional Angles"
order: 1
input: |
  - selected_news: Notícia fornecida por você (`selected-news.md`)
  - social_handoff: Brief do Social Media (`social-handoff.md`)
output: |
  - five_angles: 5 ângulos emocionais distintos, cada um com título, trigger emocional, reação esperada, preview de estrutura
---

# Generate Emotional Angles

Gera 5 ângulos emocionais distintos a partir da notícia selecionada. Cada ângulo usa um gatilho emocional diferente (medo, oportunidade, educacional, contrário, inspiracional) para maximizar engajamento e permitir que o usuário escolha qual ressonância emocional melhor se alinha com objetivos da Innovation Latam.

## Process

1. **Load inputs:** Leia `selected-news.md` (notícia que você forneceu) e `social-handoff.md` (brief do Social Media). Alinhe ângulos ao brief; use a notícia como fonte de fatos.

2. **Identify core insight:** Qual é o insight central dessa notícia? Qual verdade ou padrão não-óbvio ela revela? Exemplo: se notícia é "Claude 4 supera juniores em benchmarks", insight é "IA cruzou threshold de competência humana em tarefas específicas".

3. **Generate 5 angles usando diferentes triggers emocionais:**

   **Ângulo 1 — Medo (Fear):**
   - Trigger: Highlight risco, perda, ou ameaça
   - Pergunta: O que o leitor pode PERDER se não prestar atenção?
   - Estrutura típica: "X está acontecendo e você pode ficar pra trás"
   - Exemplo: "5 sinais de que IA vai substituir seu cargo (e o que fazer agora)"

   **Ângulo 2 — Oportunidade (Opportunity):**
   - Trigger: Show competitive advantage ou ganho potencial
   - Pergunta: O que o leitor pode GANHAR ao agir?
   - Estrutura típica: "Como usar X para conseguir Y antes da maioria"
   - Exemplo: "Como usar IA para programar 3x mais rápido (enquanto seus concorrentes dormem)"

   **Ângulo 3 — Educacional (Educational):**
   - Trigger: Teach actionable knowledge
   - Pergunta: O que o leitor vai APRENDER que pode aplicar imediatamente?
   - Estrutura típica: "Guia completo / Passo a passo / Framework de X"
   - Exemplo: "Framework completo: como integrar IA no seu workflow de dev"

   **Ângulo 4 — Contrário (Contrarian):**
   - Trigger: Challenge conventional wisdom
   - Pergunta: Qual crença comum essa notícia CONTRADIZ?
   - Estrutura típica: "Todo mundo diz X, mas dados mostram Y"
   - Exemplo: "Por que usar MUITA IA pode estar te atrasando (pesquisa Harvard)"

   **Ângulo 5 — Inspiracional (Inspirational):**
   - Trigger: Show transformation ou possibility
   - Pergunta: Que TRANSFORMAÇÃO essa notícia possibilita?
   - Estrutura típica: "Como X transformou Y / Antes e depois de X"
   - Exemplo: "Desenvolvedores que dominaram IA estão economizando 18 horas por semana"

4. **For each angle, create structure preview:** Esboce rapidamente como seria o carrossel (8-10 slides). Exemplo: "Cover → Contexto (estatística) → Passo 1 → Passo 2 → Passo 3 → Erro comum → Synthesis → CTA". Isso ajuda usuário a visualizar execução.

5. **Recommend one angle with justification (obrigatório para o pipeline automático):** Após apresentar os 5, indique explicitamente qual é **a recomendação principal**, em uma linha que comece com **"Recomendo"** ou **"Recomendo o ângulo"**, citando o trigger (Medo, Oportunidade, etc.). O passo seguinte do squad usa essa linha para escolher o ângulo **sem intervenção humana**. Ex.: `Recomendo o ângulo Educacional porque [razão].`

6. **Formato legível:** Apresente os 5 ângulos numerados; a recomendação deve ser localizável por busca no arquivo.

## Output Format

```markdown
# 5 Ângulos Emocionais: [Título da Notícia]

**Notícia base:** [Título e resumo breve da notícia selecionada]

---

## Ângulo 1: Medo 😨

**Título:** [Título do carrossel usando trigger de medo]

**Trigger Emocional:** Medo de perder, ficar pra trás, ou sofrer consequência negativa

**Reação Esperada:** Ansiedade → Ação (salvar, compartilhar para alertar outros)

**Preview de Estrutura (8-10 slides):**
- Cover: [Título provocativo]
- Slide 2: [Contexto da ameaça]
- Slides 3-7: [5 sinais/sintomas/consequências]
- Slide 8: [O que fazer agora]
- Slide 9: [CTA específico]

**Por que funciona:** [1-2 frases explicando psychological appeal]

---

## Ângulo 2: Oportunidade 🚀

**Título:** [Título focado em ganho/vantagem]

[... mesmo formato ...]

---

## Ângulo 3: Educacional 📚

[... mesmo formato ...]

---

## Ângulo 4: Contrário ⚡

[... mesmo formato ...]

---

## Ângulo 5: Inspiracional ✨

[... mesmo formato ...]

---

## Recomendação

**Ângulo recomendado:** [Número e nome]

**Justificativa:** [2-3 frases explicando por que este ângulo é mais forte para essa notícia específica, considerando público Innovation Latam e potencial de engajamento]

**Alternativa:** Se preferir [objetivo diferente, ex: gerar polêmica], escolha ângulo [X] porque [razão].

---

**Próximo passo:** Escolha um ângulo (1-5) para desenvolvermos o carrossel completo.
```

## Output Example

> Use as quality reference, not as rigid template.

```markdown
# 5 Ângulos Emocionais: Claude 4 supera desenvolvedores juniores

**Notícia base:** Nova versão da Anthropic supera benchmarks anteriores em 40% em testes de código, igualando performance de desenvolvedores com 1-2 anos de experiência em debugging e refactoring.

---

## Ângulo 1: Medo 😨

**Título:** 5 sinais de que IA vai substituir seu cargo de dev (e o que fazer agora)

**Trigger Emocional:** Medo de obsolescência profissional, perda de empregabilidade

**Reação Esperada:** Ansiedade → urgência de upskill → save para revisar depois

**Preview de Estrutura (9 slides):**
- Cover: "5 sinais de que IA vai substituir seu cargo"
- Slide 2: Contexto: Claude 4 já iguala juniores em benchmarks
- Slides 3-7: 5 sinais (tarefas que você faz que IA já domina)
- Slide 8: O que devs que vão sobreviver têm em comum
- Slide 9: CTA: "Comenta GUIA que eu mando checklist de skills à prova de IA"

**Por que funciona:** Fear of replacement é emoção dominante em discussões sobre IA em 2026. Cria urgência imediata mas oferece solução (não é apenas doomposting).

---

## Ângulo 2: Oportunidade 🚀

**Título:** Como usar IA para programar 3x mais rápido (guia prático testado por 3 meses)

**Trigger Emocional:** Possibilidade de vantagem competitiva, produtividade exponencial

**Reação Esperada:** Excitação → curiosidade sobre método → save para aplicar

**Preview de Estrutura (10 slides):**
- Cover: "Como usar IA para programar 3x mais rápido"
- Slide 2: Dados: devs que usam IA economizam 18 horas/semana
- Slides 3-7: 5 passos do framework (escolher ferramenta certa, tarefas certas, prompts eficazes, review, medição)
- Slide 8: Resultado real: antes vs depois (4h → 45min)
- Slide 9: Erro #1 que impede resultados
- Slide 10: CTA: "Qual assistente você usa? Comenta abaixo"

**Por que funciona:** Promessa quantificada (3x) com prova social (testado 3 meses). Apela para ambição de produtividade que tech workers brasileiros têm.

---

## Ângulo 3: Educacional 📚

**Título:** Framework completo: como integrar IA no seu workflow de dev sem virar dependente

**Trigger Emocional:** Desejo de aprender método correto, evitar erros comuns

**Reação Esperada:** Interesse em conhecimento estruturado → save como referência → aplicação gradual

**Preview de Estrutura (10 slides):**
- Cover: "Framework completo de IA para devs"
- Slide 2: Por que 90% dos devs usa IA errado
- Slide 3: Princípio 1 - Ferramenta certa para tarefa certa
- Slide 4: Princípio 2 - Comece com tarefas repetitivas
- Slide 5: Princípio 3 - Prompts = specs (seja específico)
- Slide 6: Princípio 4 - Revise linha por linha (34% tem bugs)
- Slide 7: Princípio 5 - Mede impacto real
- Slide 8: Red flags: quando NÃO usar IA
- Slide 9: Checklist de implementação
- Slide 10: CTA: "Salva e testa o framework esta semana"

**Por que funciona:** Estrutura clara, acionável, baseada em best practices. High save rate (conteúdo de referência). Posiciona Innovation Latam como fonte educacional autoritativa.

---

## Ângulo 4: Contrário ⚡

**Título:** Por que usar MUITA IA pode estar te atrasando (pesquisa Harvard 2026)

**Trigger Emocional:** Desafio ao consenso atual, revelação de verdade escondida

**Reação Esperada:** Surpresa → curiosidade → sharing para provocar debate

**Preview de Estrutura (8 slides):**
- Cover: "5 mitos sobre IA que estão te atrasando"
- Slide 2: MITO 1 - Quanto mais IA, melhor | REALIDADE - Brain fry após 3 ferramentas
- Slide 3: MITO 2 - IA é sempre mais rápida | REALIDADE - Brainstorming assistido gera 40% menos inovação
- Slide 4: MITO 3 - Use IA em tudo | REALIDADE - 68% têm automation fatigue
- Slide 5: MITO 4 - IA substitui necessidade de aprender | REALIDADE - Devs sem fundamentos cometem 3x mais erros
- Slide 6: MITO 5 - Todo mundo usa com sucesso | REALIDADE - 71% frustrados com outputs genéricos
- Slide 7: O que funciona de verdade (síntese dos dados)
- Slide 8: CTA: "Qual mito te surpreendeu? Comenta o número"

**Por que funciona:** Contrarian take com backing de pesquisa Harvard = alto potencial viral. Gera debate nos comentários (engajamento). Diferencia Innovation Latam de hype acrítico.

---

## Ângulo 5: Inspiracional ✨

**Título:** Desenvolvedores que dominaram IA estão economizando 18 horas por semana — veja como

**Trigger Emocional:** Aspiração, possibilidade de transformação, FOMO positivo

**Reação Esperada:** Inspiração → curiosidade sobre o "como" → motivação para tentar

**Preview de Estrutura (9 slides):**
- Cover: "18 horas por semana economizadas"
- Slide 2: Case real: João (dev brasileiro) antes e depois de dominar IA
- Slide 3: O que mudou: tarefas que levavam horas agora levam minutos
- Slides 4-7: 4 mudanças de mindset que fizeram diferença (não é sobre ferramenta, é sobre método)
- Slide 8: Resultado tangível: mais tempo para arquitetura, menos tempo em boilerplate
- Slide 9: CTA: "Comenta qual tarefa você quer automatizar primeiro"

**Por que funciona:** Transformation story é emocionalmente ressonante. 18 horas/semana é número concreto que pessoas conseguem visualizar. Case brasileiro aumenta relatabilidade.

---

## Recomendação

**Ângulo recomendado:** Ângulo 3 - Educacional 📚

**Justificativa:** Framework educacional tem maior potencial de save rate (conteúdo de referência que pessoas voltam), alinha com posicionamento Innovation Latam como fonte de conhecimento profissional, e é evergreen (não depende de polêmica do momento). Adicionalmente, estrutura clara com 5 princípios funciona perfeitamente para formato carrossel de 10 slides.

**Alternativa:** Se preferir gerar buzz imediato e comentários, escolha ângulo 4 (Contrário) porque research contraditória da Harvard vai provocar debate intenso e compartilhamentos.

---

**Próximo passo:** Escolha um ângulo (1-5) para desenvolvermos o carrossel completo.
```

## Quality Criteria

- [ ] Exatamente 5 ângulos gerados (não mais, não menos)
- [ ] Cada ângulo usa trigger emocional distinto (não repete psychological appeal)
- [ ] Cada ângulo tem título específico e provocativo (não genérico)
- [ ] Preview de estrutura mostra 8-10 slides com conteúdo de cada slide esboçado
- [ ] Recomendação presente com justificativa de 2-3 frases (não apenas "escolha qualquer um")
- [ ] Ângulos são substancialmente diferentes entre si (não variações cosméticas do mesmo angle)
- [ ] Todos os ângulos são viáveis para execução (não angles impossíveis de desenvolver com a notícia disponível)
- [ ] Formatação clara para facilitar escolha do usuário (numeração, seções visíveis)

## Veto Conditions

Reject and redo if ANY are true:

1. **Menos de 5 ângulos ou ângulos duplicados:** Se há apenas 3-4 ângulos distintos ou dois ângulos usam essencialmente o mesmo trigger emocional, variedade é insuficiente.

2. **Ângulos genéricos demais:** Se 3+ ângulos poderiam ser aplicados a qualquer notícia tech (não específicos à notícia selecionada), customização falhou.

3. **Missing preview de estrutura:** Se qualquer ângulo não tem esboço de 8-10 slides, usuário não consegue visualizar execução.

4. **Sem recomendação fundamentada:** Se não há ângulo recomendado OU recomendação não tem justificativa clara, guidance ao usuário é incompleta.
