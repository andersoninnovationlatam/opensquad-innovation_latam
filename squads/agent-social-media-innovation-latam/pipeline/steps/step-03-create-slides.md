---
execution: inline
agent: carlos-conteudo
format: instagram-feed
inputFile: squads/agent-social-media-innovation-latam/output/angles.yaml
outputFile: squads/agent-social-media-innovation-latam/output/carousel-draft.md
---

## Context Loading

Antes de executar, carregar:
- `squads/agent-social-media-innovation-latam/output/angles.yaml` — ângulo selecionado (= escolha do usuário) e hook preview
- `squads/agent-social-media-innovation-latam/input/content.md` — confirmação de `angulo_escolhido` no frontmatter
- `squads/agent-social-media-innovation-latam/output/research.md` — todos os dados enriquecidos disponíveis
- `squads/agent-social-media-innovation-latam/pipeline/data/tone-of-voice.md` — regras de tom e vocabulário
- `squads/agent-social-media-innovation-latam/pipeline/data/anti-patterns.md` — o que nunca fazer
- `squads/agent-social-media-innovation-latam/pipeline/data/output-examples.md` — referência de qualidade
- `squads/agent-social-media-innovation-latam/pipeline/data/layout-variations.md` — visual cues para Dária
- `squads/agent-social-media-innovation-latam/agents/carlos-conteudo/tasks/create-slides.md` — task file

## Instructions

### Process

**Texto curto (Instagram):** **frases curtas**; meta **≤3 linhas** no corpo de cada slide; slide 2 com **2–3 frases curtas** (~25–45 palavras). Detalhe na **caption**.

1. **Identificar o ângulo selecionado.** Abrir `output/angles.yaml`, confirmar `angulo_escolhido_pelo_usuario` e localizar `selected: true` (é o ângulo definido pelo usuário em `input/content.md`). Usar o `hook_preview` como ponto de partida para o slide 1. Não alterar de ângulo neste step.

2. **Determinar a estrutura do carrossel (7-9 slides).** Mapear os papéis: Slide 1 (hook) → Slide 2 (contexto com imagem) → Slides 3-N-2 (desenvolvimento, 1 ideia/slide) → Slide N-1 (reflexão) → Slide N (CTA).

3. **Escrever o Slide 1 (hook âncora).** Começar DIRETAMENTE com o dado-âncora. Máximo 2 linhas visíveis. Nunca apresentação, marca ou "Hoje vamos falar". Incluir visual cue para Dária (Cover Layout, imagem de fundo sugerida, cor de destaque dos números).

4. **Escrever o Slide 2 (contexto).** **2 ou 3 frases curtas** respondendo "O que esse dado significa? Por que importa?" Sem parágrafo longo. Incluir visual cue (Image Context Layout, imagem full-bleed sugerida).

5. **Escrever os slides de desenvolvimento.** 1 ideia por slide, **no máximo 2 frases curtas** no body (**preferir ≤3 linhas visíveis**). Cada slide avança a narrativa — deve ser consequência do anterior. Nenhuma informação repetida. Incluir visual cue (Standard ou Split Content Layout).

6. **Escrever o slide de reflexão (penúltimo).** Síntese emocional do que foi apresentado. Pergunta ou afirmação que toca na realidade do profissional de inovação. NÃO um dado novo. Incluir visual cue (Reflection Layout).

7. **Escrever o slide de CTA (último).** Duas ações específicas ao tema: salvar + comentar. Ambas conectadas diretamente ao conteúdo. Incluir visual cue (CTA Layout, botão teal).

8. **Escrever a caption Instagram.** Hook nas primeiras 125 chars para o preview do feed + body de 3-5 parágrafos + pergunta final + 8-12 hashtags ao final. Verificar que não ultrapassa 2.200 chars.

9. **Revisão pré-entrega.** Verificar: (a) slide 1 não começa com marca, (b) **nenhum slide com mais de 4 linhas** no corpo (meta ≤3), **frases curtas**, (c) nenhuma informação repetida, (d) penúltimo slide é de reflexão sem dado novo, (e) CTA tem 2 ações específicas.

## Output Format

```markdown
# Carrossel: [TÍTULO DESCRITIVO]
**Ângulo:** [ângulo selecionado — label]
**Dado-âncora:** [dado âncora e fonte]
**Total de slides:** [N]

---

## Slide 1 — HOOK (Cover Layout)
**Headline:** [texto — máx 2 linhas]
**Visual cue:** [instrução para Dária: Cover Layout, imagem sugerida, cores de destaque]

---

## Slide 2 — CONTEXTO (Image Context Layout)
**Headline:** [texto]
**Body:** [texto — mínimo 60 palavras]
**Visual cue:** [Image Context Layout, imagem full-bleed sugerida, overlay]

---

## Slide [N] — [PAPEL] ([Variação de Layout])
**Headline:** [texto]
**Body:** [texto — máx 4-5 linhas]
**Visual cue:** [Standard ou Split Content Layout]

---

## Slide [N-1] — REFLEXÃO (Reflection Layout)
**Headline:** [pergunta ou afirmação reflexiva]
**Body:** [complemento opcional]
**Visual cue:** Reflection Layout — texto centralizado, espaçamento generoso, sem rodapé ARRASTE

---

## Slide [N] — CTA (CTA Layout)
**Headline:** [headline do CTA]
**Body:** [contexto]
**Ação 1 (Salvar):** [instrução de save específica ao tema]
**Ação 2 (Comentar):** [pergunta específica ao tema]
**Visual cue:** CTA Layout — botão teal #50beba, sem rodapé ARRASTE

---

## Caption Instagram

[Hook — primeiras 125 chars incluem o gancho principal]

[Body — 3-5 parágrafos concisos]

[Pergunta final de engajamento]

📌 [CTA de salvar na caption]

#[8-12 hashtags relevantes]
```

## Output Example

```markdown
# Carrossel: Open Innovation — A Janela que Está Aberta
**Ângulo:** Oportunidade / FOMO
**Dado-âncora:** ROI de 3.2× por real investido em programas acima de 12 meses (Abstartups, 2025)
**Total de slides:** 8

---

## Slide 1 — HOOK (Cover Layout)
**Headline:** Para cada R$1 investido em open innovation por mais de 12 meses: R$3,20 de retorno.
A janela ainda está aberta.
**Visual cue:** Cover Layout. Fundo escuro com imagem de pitch event ou sala de inovação. "R$3,20" em gold #e8c85c. Hero text 82px, terço inferior.

---

## Slide 2 — CONTEXTO (Image Context Layout)
**Headline:** O que é ROI de 3.2× na prática?
**Body:** Significa que para cada R$1 investido em um programa de open innovation por mais de 12 meses, as empresas recuperam R$3,20 em resultado mensurável — redução de custos, novos produtos, eficiência operacional ou receita nova.
Não é projeção. É média calculada sobre 847 programas brasileiros ativos.
O problema? 71% dos programas são encerrados antes de completar 6 meses.
Exatamente antes do ROI aparecer.
*(Abstartups, 2025)*
**Visual cue:** Image Context Layout. Imagem full-bleed de reunião entre executivos e founders de startup. Overlay rgba(21,10,28,0.85). Headline 46px 700, body 36px 500, "71%" em teal #c0fefd.

---

## Slide 3 — POR QUE 71% DESISTEM (Standard Content Layout)
**Headline:** Por que 71% dos programas são encerrados cedo demais?
**Body:** Porque a curva de aprendizado com startups é íngreme no início e exponencial no meio.
As empresas que chegam ao mês 12 capturam 90% do valor total do programa.
As que saem antes? Pagaram o custo de aprendizado sem colher o retorno.
*(Distrito, 2024)*
**Visual cue:** Standard Content Layout. Destaque teal em "90%".

---

## Slide 4 — OS 3 ELEMENTOS QUE FAZEM FUNCIONAR (Split Content Layout)
**Headline:** O que separa os programas que chegam ao mês 12
**Body:** 3 elementos presentes nos hubs com maior ROI:
**Callout box:** → Patrocinador C-level com autoridade real de decisão
→ Budget pré-aprovado para pilotar sem burocracia
→ Critério de sucesso definido ANTES de selecionar startups
**Complemento:** Sem esses 3, o programa vira vitrine — não transformação. *(Gartner, 2025)*
**Visual cue:** Split Content Layout. Callout box com borda teal, background rgba(153,60,177,0.30). Lista com bullets em teal.

---

## Slide 5 — O CRESCIMENTO QUE ACONTECEU (Standard Content Layout)
**Headline:** O crescimento que aconteceu enquanto muitos esperavam
**Body:** Em 2024, programas de open innovation corporativo no Brasil cresceram 43%.
As grandes empresas estão ocupando as startups mais promissoras com acordos de acesso preferencial.
O pool disponível para novos parceiros está encolhendo.
*(Abstartups, 2025)*
**Visual cue:** Standard Content Layout. Destaque gold em "43%".

---

## Slide 6 — QUEM ESTÁ NA FRENTE (Split Content Layout)
**Headline:** Quem está na frente — e por quê
**Body:** 67% das Fortune 500 que avançaram competitivamente em 2024 atribuem parte do ganho a parcerias com startups.
**Callout box:** Velocidade de startup + escala corporativa = vantagem que o concorrente sem programa não consegue replicar rapidamente.
*(World Economic Forum, 2024)*
**Visual cue:** Split Content Layout. "67%" em destaque teal no callout.

---

## Slide 7 — REFLEXÃO (Reflection Layout)
**Headline:** A janela está aberta. Por quanto tempo mais?
**Body:** Ainda há startups de alto potencial sem parceiro corporativo — especialmente em IA, sustentabilidade e healthtech.
Mas cada trimestre que passa, mais empresas chegam a essa conclusão.
A pergunta não é "devemos fazer open innovation". É "quanto custa não fazer?".
**Visual cue:** Reflection Layout. Texto centralizado, padding 80px, gradiente sutil #1a0d24→#2a1538→#150a1c. Sem rodapé ARRASTE.

---

## Slide 8 — CTA (CTA Layout)
**Headline:** Salva esse carrossel.
**Body:** Pra quando o CFO perguntar o ROI de um programa de inovação — você vai ter os números certos na mão.
**Ação 1 (Salvar):** Salva para a próxima reunião de estratégia de inovação.
**Ação 2 (Comentar):** Comenta: sua empresa já tem open innovation? O que está funcionando (ou travando)?
**Visual cue:** CTA Layout. Botão teal sólido #50beba com texto "Salva" em roxo escuro #0d0718. Ação de comentar em gold #e8c85c. Sem rodapé ARRASTE.

---

## Caption Instagram

Para cada R$1 investido em open innovation por mais de 12 meses: R$3,20 de retorno. 📈

Não é projeção. É a média de 847 programas brasileiros ativos em 2025, segundo a Abstartups.

O problema é que 71% dos programas são encerrados antes de 6 meses — exatamente antes do ROI aparecer. A curva de aprendizado é íngreme no início e exponencial no meio.

O pool de startups de alto potencial sem parceiro corporativo ainda existe — especialmente em IA, sustentabilidade e healthtech. Mas cada trimestre de crescimento de 43% significa menos startups disponíveis para quem chega depois.

A janela ainda está aberta. Por quanto tempo mais?

📌 Salva esse carrossel para a próxima reunião de estratégia de inovação da sua empresa.

#openinnovation #inovacaoaberta #startups #inovacaocorporativa #innovationlatam #hubdeinovacao #transformacaodigital #empreendedorismo #ROI #corporateinnovation #inovacao #gestaoinovacao
```

## Veto Conditions

1. Slide 1 começa com nome da marca, "Hoje vamos falar" ou qualquer apresentação — falha de scroll-stop que garante REJECT na revisão
2. Slide de reflexão (penúltimo) contém dado novo — violação do papel do slide de reflexão que prejudica o impacto emocional

## Quality Criteria

- Slide 1 com dado-âncora direto, máx 2 linhas, passa o scroll-stop test
- 7-9 slides totais com papéis claramente definidos para cada posição
- Penúltimo slide de reflexão emocional sem dados novos
- CTA com 2 ações específicas ao tema do carrossel
- Caption com hook nos 125 chars iniciais + 8-12 hashtags no final
