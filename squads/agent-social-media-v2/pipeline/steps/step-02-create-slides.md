---
execution: inline
agent: carlos-conteudo
format: instagram-feed
inputFile: squads/agent-social-media-v2/output/angles.yaml
outputFile: squads/agent-social-media-v2/output/carousel-draft.md
---

## Context Loading

Antes de executar, carregar:
- `squads/agent-social-media-v2/output/angles.yaml` — ângulo selecionado e hook preview
- `squads/agent-social-media-v2/input/content.md` — texto-base / notícia + `angulo_escolhido` no frontmatter (o ângulo já está espelhado em `angles.yaml`)
- `squads/agent-social-media-v2/pipeline/data/tone-of-voice.md` — regras de tom e vocabulário
- `squads/agent-social-media-v2/pipeline/data/anti-patterns.md` — o que nunca fazer
- `squads/agent-social-media-v2/pipeline/data/output-examples.md` — referência de qualidade
- `squads/agent-social-media-v2/pipeline/data/real-imagery-and-safe-zones.md` — **norma** para imagens temáticas, Visual cues, data-URI e safe zones (obrigatório)
- `squads/agent-social-media-v2/pipeline/data/layout-variations.md` — visual cues para Dária (estruturas v3, 1080×1350)
- `squads/agent-social-media-v2/agents/carlos-conteudo/tasks/create-slides.md` — task file

## Instructions

### Norma de design v3 (Carlos → Dária)

Seguir integralmente `real-imagery-and-safe-zones.md` e `layout-variations.md` (1080×1350, 4:5):

- **Visual cue** em cada slide: **cena/metáfora/tema** da imagem (slides 1–2 full-bleed), **compliance** se marca de terceiros.
- **Slide 1:** **Cover Layout**, fundo full-bleed temático, **headline só na banda 60%–80%** (**à esquerda** no bloco), destaque numérico **gold `#e8c85c`**.
- **Slide 2:** **Image Context Layout**, imagem full-bleed + overlay `rgba(21,10,28,0.85)`; texto **à esquerda** na área útil.
- **Slides 3+ (Standard/Split):** **texto à esquerda** + **padding 100px** + rodapé @ + ARRASTE -> + safe zone **y ≥ 1150px**.
- Opcional: após o título do carrossel, incluir um bloco **`## Brief de layout (esta run)`** (modelo no ficheiro acima) para repetir safe zone e tema em um só lugar.

### Process

**Língua (Carlos):** todo o copy em **português brasileiro** com **gramática e ortografia** corretas. **Maiúscula** no início de cada headline/body/caption/ação e no início de cada frase após ponto final. Ver `agents/carlos-conteudo.agent.md` e `tasks/create-slides.md`.

**Texto curto (Instagram):** slides com **frases curtas** e **poucas linhas** (meta **≤3 linhas** no corpo; slide 2 com **2–3 frases curtas**, ~25–45 palavras). Detalhe e parágrafos ficam na **caption**.

1. **Identificar o ângulo selecionado.** Abrir `output/angles.yaml`, confirmar `angulo_escolhido_pelo_usuario` e localizar `selected: true` (é sempre o ângulo que o usuário definiu em `input/content.md`). Usar o `hook_preview` como ponto de partida para o slide 1. Não alterar de ângulo neste step.

2. **Estrutura fixa: exatamente 6 slides.** Slide 1 (hook) → Slide 2 (contexto com imagem) → Slides 3 e 4 (desenvolvimento, 1 ideia/slide) → Slide 5 (reflexão) → Slide 6 (CTA).

3. **Escrever o Slide 1 (hook âncora).** Começar DIRETAMENTE com o dado-âncora. Máximo 2 linhas visíveis. Nunca apresentação, marca ou "Hoje vamos falar". Incluir **Visual cue** completo (Cover: cena no fundo, banda 60–80% **à esquerda**, gold nos números, compliance se aplicável).

4. **Escrever o Slide 2 (contexto).** **2 ou 3 frases curtas** que respondem "Por que importa?" Sem parágrafos longos. Sem travessão (—). Incluir **Visual cue** (Image Context: cenário ilustrativo full-bleed, overlay).

5. **Escrever os slides de desenvolvimento.** 1 ideia por slide, **no máximo 2 frases curtas** no body (**preferir ≤3 linhas visíveis**). Sem travessão (—): usar ponto final ou vírgula. Cada slide avança a narrativa. Nenhuma informação repetida. Incluir **Visual cue** (Standard ou Split **v3** — **texto à esquerda**, rodapé, padding **100px**).

6. **Escrever o slide de reflexão (slide 5).** Síntese emocional do que foi apresentado. Pergunta ou afirmação que toca na realidade do profissional de inovação. NÃO um dado novo. Incluir visual cue (Reflection Layout + conteúdo acima da faixa inferior reservada).

7. **Escrever o slide de CTA (slide 6).** Duas ações específicas ao tema: salvar + comentar. Ambas conectadas diretamente ao conteúdo. Incluir visual cue (CTA Layout + bloco acima de y=**1150px**).

8. **Escrever a caption Instagram.** Hook nas primeiras 125 chars para o preview do feed + body de 3-5 parágrafos + pergunta final + 8-12 hashtags ao final. Verificar que não ultrapassa 2.200 chars.

9. **Revisão pré-entrega.** Confirmar **6 slides** no draft. Verificar: (a) slide 1 não começa com marca, (b) **nenhum slide com mais de 4 linhas** no corpo (meta ≤3), **frases curtas**, (c) nenhuma informação repetida, (d) slide 5 é reflexão sem dado novo, (e) slide 6 tem CTA com 2 ações específicas, (f) **Visual cues** alinhados a `real-imagery-and-safe-zones.md`.

## Output Format

```markdown
# Carrossel: [TÍTULO DESCRITIVO]
**Ângulo:** [ângulo selecionado — label]
**Dado-âncora:** [dado âncora e fonte]
**Total de slides:** 6

---

## Brief de layout (esta run)
_Opcional mas recomendado — copiar/adaptar o modelo em `real-imagery-and-safe-zones.md` §3._
- **Imagens temáticas:** [tema/marca]; [metáfora / estética / logo só se compliance].
- **Safe zone:** nenhum texto editorial em y ≥ **1150px** (canvas 1080×1350); rodapé acima da faixa.
- **Slide 1:** headline só entre 60%–80% altura, alinhada à esquerda no bloco; padding **100px** lateral.
- **Todos os slides:** texto editorial **alinhado à esquerda** (logo canto superior esquerdo); padding **100px** esquerda/direita.

---

## Slide 1 — HOOK (Cover Layout)
**Headline:** [texto — máx 2 linhas]
**Visual cue:** Cover Layout. Fundo full-bleed: [cena/metáfora — sem texto na imagem]. Headline na banda 60%–80%, alinhada à esquerda no bloco; padding **100px**. Destaque numérico gold #e8c85c. [Nota compliance se marca de terceiros.]

---

## Slide 2 — CONTEXTO (Image Context Layout)
**Headline:** [texto — 1 linha]
**Body:** [2 ou 3 frases curtas — ~25–45 palavras no total]
**Visual cue:** Image Context Layout. Full-bleed: [cenário concreto]. Overlay rgba(21,10,28,0.85). (Dária: imagem final = data-URI no HTML.)

---

## Slide 3 — [NOME] (Standard ou Split Content Layout)
**Headline:** [texto]
**Body:** [texto — frases curtas]
**Visual cue:** [Standard ou Split **v3** — texto alinhado à esquerda; padding **100px**; safe zone y ≥ 1150px]

---

## Slide 4 — [NOME] (Standard ou Split Content Layout)
**Headline:** [texto]
**Body:** [texto — frases curtas]
**Visual cue:** [Standard ou Split **v3** — texto alinhado à esquerda; padding **100px**]

---

## Slide 5 — REFLEXÃO (Reflection Layout)
**Headline:** [pergunta ou afirmação reflexiva]
**Body:** [complemento opcional]
**Visual cue:** Reflection Layout — texto alinhado à esquerda, espaçamento generoso, padding **100px**, rodapé @ + ARRASTE ->

---

## Slide 6 — CTA (CTA Layout)
**Headline:** [headline do CTA]
**Body:** [contexto]
**Ação 1 (Salvar):** [instrução de save específica ao tema]
**Ação 2 (Comentar):** [pergunta específica ao tema]
**Visual cue:** CTA Layout — botão teal #50beba, rodapé @ + ARRASTE ->

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
**Total de slides:** 6

---

## Slide 1 — HOOK (Cover Layout)
**Headline:** Para cada R$1 investido em open innovation por mais de 12 meses: R$3,20 de retorno.
A janela ainda está aberta.
**Visual cue:** Cover Layout. Fundo full-bleed pitch/sala inovação. "R$3,20" em gold #e8c85c. Headline na banda 60%–80%, alinhada à esquerda no bloco; padding **100px**.

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

## Slide 5 — REFLEXÃO (Reflection Layout)
**Headline:** A janela está aberta. Por quanto tempo mais?
**Body:** Ainda há startups de alto potencial sem parceiro corporativo — especialmente em IA, sustentabilidade e healthtech.
Mas cada trimestre que passa, mais empresas chegam a essa conclusão.
A pergunta não é "devemos fazer open innovation". É "quanto custa não fazer?".
**Visual cue:** Reflection Layout. Texto alinhado à esquerda, padding lateral **100px**, gradiente sutil #1a0d24→#2a1538→#150a1c. Rodapé @ + ARRASTE ->.

---

## Slide 6 — CTA (CTA Layout)
**Headline:** Salva esse carrossel.
**Body:** Pra quando o CFO perguntar o ROI de um programa de inovação — você vai ter os números certos na mão.
**Ação 1 (Salvar):** Salva para a próxima reunião de estratégia de inovação.
**Ação 2 (Comentar):** Comenta: sua empresa já tem open innovation? O que está funcionando (ou travando)?
**Visual cue:** CTA Layout. Botão teal sólido #50beba com texto "Salva" em roxo escuro #0d0718. Ação de comentar em gold #e8c85c. Rodapé @ + ARRASTE ->.

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

1. **Total de slides ≠ 6** — estrutura fixa do squad
2. Slide 1 começa com nome da marca, "Hoje vamos falar" ou qualquer apresentação — falha de scroll-stop que garante REJECT na revisão
3. Slide de reflexão (slide 5) contém dado novo — violação do papel do slide de reflexão que prejudica o impacto emocional

## Quality Criteria

- Slide 1 com dado-âncora direto, máx 2 linhas, passa o scroll-stop test
- **Exatamente 6 slides** (estrutura fixa)
- Slide 5 de reflexão emocional sem dados novos
- CTA com 2 ações específicas ao tema do carrossel
- Caption com hook nos 125 chars iniciais + 8-12 hashtags no final
