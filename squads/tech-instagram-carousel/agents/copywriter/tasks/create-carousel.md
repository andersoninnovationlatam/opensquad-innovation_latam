---
task: "Create Complete Carousel"
order: 2
input: |
  - selected_angle: Ângulo emocional escolhido pelo usuário
  - selected_news: Notícia original com contexto
  - tone_guidance: Tom de voz selecionado do tone-of-voice.md
output: |
  - complete_carousel: Carrossel completo com 8-10 slides, caption, hashtags
  - slide_specs: Para cada slide (headline, supporting text, background color, keywords destacados)
---

# Create Complete Carousel

Escreve carrossel completo otimizado para Instagram seguindo o ângulo selecionado. Produz 8-10 slides com copy estruturado (headline + supporting text), caption com hook forte, e hashtags estratégicos. Output é formatado e pronto para o designer visual transformar em imagens.

## Process

1. **Load context files:**
   - Leia `selected-angle.md` com o ângulo (seleção automática ou manual em runs antigos)
   - Leia `selected-news.md` para contexto completo da notícia
   - Leia `social-handoff.md` para alinhar tom e prioridades ao brief do Social Media
   - Leia `pipeline/data/tone-of-voice.md` e identifique os 6 tons disponíveis

2. **Selecionar tom automaticamente (sem checkpoint humano):**
   - Analise o ângulo em `selected-angle.md` e **escolha um** dos 6 tons em `tone-of-voice.md` (Educacional Pragmático, Curioso Investigativo, Contrário Provocativo, Inspiracional Motivador, Analítico Estratégico, Urgente Alarmante)
   - **Mapa sugerido:** Medo / risco → Urgente Alarmante ou Curioso Investigativo · Oportunidade / ganho → Analítico Estratégico ou Inspiracional Motivador · Educacional → Educacional Pragmático · Contrário → Contrário Provocativo · Inspiracional → Inspiracional Motivador
   - Documente no topo do `carousel-draft.md`: `**Tom de voz (automático):** [nome] — [1 frase de razão]`
   - Use o vocabulário e características desse tom em todo o conteúdo

3. **Draft 3 hook options:** Crie 3 opções de hook para o slide cover usando diferentes estruturas:
   - Hook 1: Question (pergunta que engaja completion instinct)
   - Hook 2: Statistic (número impressionante da notícia)
   - Hook 3: Contrarian statement (desafia crença comum)
   
   Teste cada hook mentalmente com scroll-stop test: pararia você scrolling em velocidade máxima?

4. **Select strongest hook:** Escolha o hook mais forte dos 3 baseado em: (a) relevância ao ângulo, (b) impacto emocional, (c) scroll-stop power. Justifique brevemente sua escolha.

5. **Choose carousel format:** Selecione um dos 6 formatos baseado no ângulo e conteúdo disponível:
   - **Editorial:** Deep dive em single topic (8-10 slides explorando um conceito)
   - **Listicle:** Numbered items (ex: "5 recursos", "7 erros")
   - **Tutorial:** Step-by-step guide (passo 1, 2, 3...)
   - **Mito vs Realidade:** Myth-busting structure
   - **Storytelling:** Narrative arc (início → desenvolvimento → conclusão)
   - **Problema→Solução:** Transformation (antes → journey → depois)

6. **Design carousel structure (8-10 slides):** Planeje a arc completa:
   - **Slide 1 (Cover):** **Headline** = título forte que prende atenção (hook). **Supporting Text** = obrigatoriamente inclui um **CTA** claro e curto (micro–call to action), por exemplo: orientar a arrastar (“Arrasta para entender →”), salvar, comentar com palavra-chave, ou próximo passo imediato. Não publicar capa só com título sem linha de CTA.
   - **Slide 2 (Context — OBRIGATÓRIO: maior carga de texto do carrossel):** Setup profundo do problema/oportunidade. O **Supporting Text deste slide deve ser estritamente mais longo** que o Supporting Text de **cada** slide 3, 4, 5… (contagem de palavras). Faixa típica: **60-120 palavras** no Supporting Text. Inclua: contexto histórico ou estatístico, por que o tema importa, e o que está em jogo. Se algum slide posterior tiver mais texto que o slide 2, reequilibrar: densidade máxima fica no slide 2.
   - **Slides 3-7 (Content):** Core content (5 passos, 5 mitos, 5 recursos, etc). Cada slide = 1 concept novo. Supporting Text: 30-60 palavras cada.
   - **Slide 8 (Synthesis):** Consolidação dos learnings ou antes/depois
   - **Slide 9 (CTA):** Call-to-action específico e acionável
   - **(Opcional) Slide 10:** Se houver conteúdo suficiente para 10 slides sem dilution

7. **Write each slide with two-layer hierarchy:**
   - **Headline:** 3-12 palavras, bold, principal mensagem do slide (no Slide 1: foco total em atenção + promessa)
   - **Supporting text:** 30-70 palavras nos slides 3+ ; **Slide 1:** incluir **CTA** na supporting (pode ser 1-3 linhas curtas); **Slide 2:** 60-120 palavras, sempre o bloco mais longo do carrossel
   - Total por slide: 40-80 palavras em média nos slides de miolo (Slide 1 pode ser mais curto se capa + CTA; Slide 2: 70-130 palavras headline+supporting)
   - Identifique 1-3 keywords para highlight em gold no design

8. **Assign background colors:** Alterne cores para criar ritmo visual:
   - Dark (`#0a0a0a`) para maioria dos slides
   - Light card (`#1a1a1a`) para contrastar em 2-3 slides
   - Accent (`#FFD70033`) para 1-2 slides de destaque (synthesis ou CTA)
   - Padrão sugerido: Dark → Dark → Light → Dark → Accent → Dark → Dark → Accent

9. **Write caption:** Estruture em 4 partes:
   - **Hook (primeiros 125 chars):** Deve funcionar standalone, pois é o que aparece no feed antes de "...mais"
   - **Body (2-4 parágrafos curtos):** Desenvolve o hook, adiciona contexto, usa quebras de linha agressivamente
   - **Transition to carousel:** Linha isolada direcionando para swipe ("Swipe pra ver X →")
   - **Closing question:** Pergunta provocativa para dirigir comentários
   - **Disclaimer:** Se conteúdo foi criado com IA, adicione no final: "[Disclaimer: Conteúdo criado com assistência de IA]"

10. **Select 5-10 hashtags:** Mix estratégico:
    - 2-3 niche (ex: `#devbrasil`, `#programacaobrasil`)
    - 3-4 mid-range (ex: `#programacao`, `#desenvolvedor`)
    - 2-3 broad (ex: `#tech`, `#inovacao`)
    - Todos em português, relevantes ao conteúdo, sem hashtag spam

11. **Run anti-commodity check:** Pergunta final: "Um concorrente poderia copiar esse carrossel inalterado e parecer autêntico?" Se sim, adicione: experiência pessoal ("testei durante 3 meses"), dados específicos, ou perspectiva única Innovation Latam.

12. **Format final output:** Estruture o carrossel em formato markdown claro com todas as specs para o designer seguir.

## Output Format

```markdown
# Carrossel: [Título]

**Formato:** [Editorial/Listicle/Tutorial/Mito vs Realidade/Storytelling/Problema→Solução]
**Ângulo:** [Ângulo emocional selecionado]
**Tom de voz:** [Tom selecionado e confirmado]
**Total de slides:** [8-10]

---

## Slide 1: Cover

**Background:** Dark (#0a0a0a)

**Headline:**
[Título principal — hook que prende atenção no feed]

**Supporting Text:**
[Obrigatório: incluir **CTA** explícito — ex. “Arrasta pra ver por quê →”, “Salva pra aplicar hoje”, “Comenta [PALAVRA] que eu te conto o próximo passo”]

**CTA (confirmar):**
[Repetir a frase de CTA em uma linha para o designer não perder]

**Accent Keywords:** [palavras para highlight em gold, se aplicável]

---

## Slide 2: Context

**Background:** Dark (#0a0a0a)

**Headline:**
[Título do slide 2 — geralmente uma stat ou setup do problema]

**Supporting Text:**
[60-120 palavras — **maior bloco de texto do carrossel**; contexto, dados, setup; mais longo que qualquer slide 3+]

**Accent Keywords:** [ex: "67%", "18 horas"]

---

## Slide 3: [Nome do Conceito]

**Background:** Light card (#1a1a1a)

**Headline:**
[Título do slide 3]

**Supporting Text:**
[Conteúdo do slide 3]

**Accent Keywords:** [keywords para destacar]

---

[... Continue para todos os 8-10 slides com mesmo formato ...]

---

## Slide 9: CTA

**Background:** Accent (#FFD70033)

**Headline:**
[Título do CTA]

**Supporting Text:**
[Texto de apoio]

**CTA Text:**
[Call-to-action específico, ex: "Comenta 'GUIA' que eu mando o checklist completo"]

**Accent Keywords:** [palavras finais para destacar]

---

## Caption

```
[Primeiros 125 caracteres — HOOK FORTE que funciona standalone]

[Parágrafo 2: desenvolvimento do hook com quebra de linha]

[Parágrafo 3: adiciona contexto ou stat relevante]

Swipe pra ver [o que tem no carrossel] →

[Linha isolada com transition]

[Pergunta final para dirigir comentários]

[Disclaimer: Conteúdo criado com assistência de IA]
```

---

## Hashtags

`#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5 #hashtag6 #hashtag7 #hashtag8`

(5-10 hashtags: mix niche/mid-range/broad, todos em português)

---

## Design Notes

- Alterna backgrounds: Dark → Dark → Light → Dark → Accent
- Fonte: Montserrat (capa 82px/700, slide 2 headline 46px/700, body 40px/500)
- Gold accent (#FFD700) para keywords destacados e números grandes
- Viewport: 1080x1440px
- Seguir visual-identity.md (Template C: Number Focus)
```

## Output Example

> Use as quality reference, not as rigid template.

```markdown
# Carrossel: Como usar IA para programar 3x mais rápido

**Formato:** Tutorial
**Ângulo:** Oportunidade (competitive advantage)
**Tom de voz:** Educacional Pragmático
**Total de slides:** 9

---

## Slide 1: Cover

**Background:** Dark (#0a0a0a)

**Headline:**
Como usar IA para programar 3x mais rápido

**Supporting Text:**
guia prático testado por 3 meses — arrasta pra ver o passo a passo completo →

**CTA (confirmar):**
arrasta pra ver o passo a passo completo →

**Accent Keywords:** "3x mais rápido"

---

## Slide 2: Context

**Background:** Dark (#0a0a0a)

**Headline:**
Desenvolvedores que usam IA economizam 18 horas por semana

**Supporting Text:**
pesquisa da GitHub (2026) com 10 mil devs mostra que assistentes de IA reduziram tempo em tarefas repetitivas em 67%. mas poucos sabem usar direito. o segredo não é qual ferramenta você usa. é como você integra ela no seu workflow.

**Accent Keywords:** "18 horas", "67%"

---

## Slide 3: Passo 1

**Background:** Light card (#1a1a1a)

**Headline:**
1. Escolha a ferramenta certa para cada tipo de tarefa

**Supporting Text:**
GitHub Copilot para autocompletar código. Claude/ChatGPT para arquitetura e debugging. Cursor para refactoring completo. não existe "melhor ferramenta" — existe ferramenta certa para o momento.

**Accent Keywords:** "ferramenta certa"

---

## Slide 4: Passo 2

**Background:** Dark (#0a0a0a)

**Headline:**
2. Comece com tarefas repetitivas antes de arquitetura

**Supporting Text:**
IA economiza 80% do tempo em boilerplate, testes unitários, documentação. arquitetura complexa ainda precisa de humano. delega o que consome tempo mas não exige decisão crítica.

**Accent Keywords:** "80%"

---

## Slide 5: Passo 3

**Background:** Dark (#0a0a0a)

**Headline:**
3. Aprenda a escrever prompts como você escreve specs

**Supporting Text:**
"crie uma função" é vago. "crie função validateEmail que aceita string, retorna boolean, valida formato RFC 5322" gera código pronto. quanto mais específico o prompt, menos revisão depois.

**Accent Keywords:** "específico"

---

## Slide 6: Passo 4

**Background:** Light card (#1a1a1a)

**Headline:**
4. Revise linha por linha — IA erra em edge cases

**Supporting Text:**
34% do código gerado por IA tem bugs sutis (pesquisa MIT 2026). sempre teste com inputs extremos: strings vazias, números negativos, arrays gigantes. IA é assistente, não substituto.

**Accent Keywords:** "34%", "bugs sutis"

---

## Slide 7: Passo 5

**Background:** Dark (#0a0a0a)

**Headline:**
5. Mede o impacto real no seu workflow

**Supporting Text:**
track quanto tempo você leva em cada tarefa por 1 semana. identifica onde IA economiza mais tempo. ajusta o uso baseado em dados reais, não hype.

**Accent Keywords:** "dados reais"

---

## Slide 8: Resultado Real

**Background:** Accent (#FFD70033)

**Headline:**
O resultado depois de 3 meses

**Supporting Text:**
refactoring que levava 4 horas agora leva 45 minutos. documentação que levava 2 horas leva 20 minutos. não é mágica. é método aplicado consistentemente.

**Accent Keywords:** "4h → 45min"

---

## Slide 9: CTA

**Background:** Dark (#0a0a0a)

**Headline:**
Comece com uma ferramenta hoje

**Supporting Text:**
teste o GitHub Copilot ou Cursor esta semana. mede quanto tempo você economiza. ajusta conforme seu workflow.

**CTA Text:**
Comenta 'GUIA' que eu mando o checklist completo de IA para devs

**Accent Keywords:** "GUIA"

---

## Caption

```
A maioria dos desenvolvedores está usando IA errado.

Eu passei 3 meses testando todos os assistentes de código. Descobri que não é sobre qual ferramenta você usa. É sobre COMO você usa.

Swipe pra ver o framework completo →

O que mudou pra mim: antes eu levava 4 horas pra refatorar um módulo. Hoje levo 45 minutos. Não é mágica. É método.

Qual assistente de IA você usa? Comenta abaixo.

[Disclaimer: Conteúdo criado com assistência de IA]
```

---

## Hashtags

`#programacao #desenvolvedor #inteligenciaartificial #tech #inovacao #python #javascript #devbrasil`

---

## Design Notes

- Alterna backgrounds: Dark → Dark → Light → Dark → Dark → Light → Dark → Accent → Dark
- Big number "67%" no slide 2 (hero font 180px)
- Before/after stat no slide 8 ("4h → 45min") também em hero size
- Gold accent para todos os keywords destacados
- Header tags: "PASSO 1", "PASSO 2", etc nos slides 3-7
- Footer em todos os slides: "Innovation Latam" (esquerda) + "ARRASTE →" (direita)
```

## Quality Criteria

- [ ] Tom de voz selecionado do tone-of-voice.md e confirmado com usuário
- [ ] Vocabulário e características do tom escolhido aplicados consistentemente
- [ ] 8-10 slides total (não menos, não mais)
- [ ] Slide 1: título de atenção + **CTA explícito** na supporting text
- [ ] Slide 2: Supporting Text com **mais palavras** que qualquer slide 3+ (60-120 palavras típico)
- [ ] Slides 3+: 40-80 palavras (headline + supporting) salvo exceção pontual
- [ ] Hierarquia de duas camadas presente em todos os slides (headline bold + supporting text)
- [ ] Background colors alternam para criar ritmo visual
- [ ] Hook testado com scroll-stop test e escolhido de 3 opções
- [ ] Formato de carrossel explicitamente escolhido e seguido
- [ ] Caption: primeiros 125 caracteres funcionam standalone como hook
- [ ] CTA é específico e acionável (não "curta e compartilhe")
- [ ] 5-10 hashtags em português com mix estratégico (niche/mid/broad)
- [ ] Anti-commodity check passou (conteúdo não é genérico copiável)
- [ ] Cada slide avança narrativa com informação nova (sem filler)
- [ ] Keywords para highlight identificados em cada slide

## Veto Conditions

Reject and redo if ANY are true:

1. **Tom não documentado:** Se o `carousel-draft.md` não declara explicitamente qual dos 6 tons foi aplicado (e por quê), processo não foi seguido.

2. **Menos de 8 slides ou mais de 10:** Range ideal é 8-10. Menos que 8 é conteúdo insuficiente. Mais que 10 causa fadiga de carrossel.

3. **Slide 1 sem CTA:** Se a Supporting Text do slide 1 não contém um call-to-action explícito (ação pedida ao leitor), refazer.

4. **Slide 2 não é o mais denso:** Se o Supporting Text de qualquer slide 3+ tiver contagem de palavras **igual ou maior** que o Supporting Text do slide 2, refazer (slide 2 deve ser o maior).

5. **Slides de miolo com density errada:** Se 3+ slides (excluindo capa e slide 2) estão fora do range 40-80 palavras (headline + supporting), density está incorreta.

6. **Hook genérico ou sem teste:** Se hook é clichê ("Você sabia que...") OU não há evidência de que 3 opções foram consideradas, hook provavelmente é fraco.

7. **Caption sem hook forte nos primeiros 125 chars:** Se primeiros 125 caracteres não funcionam standalone (testado cortando após "..."), caption falhará no feed.

8. **CTA genérico (legenda ou slide final):** Se o CTA principal do carrossel é "curta e compartilhe", "segue para mais", ou similar, não é específico suficiente.

9. **Conteúdo commodity:** Se anti-commodity check falhou (concorrente pode copiar inalterado), conteúdo não tem diferenciação suficiente.
