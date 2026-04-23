---
task: create-slides
agent: carlos-conteudo
order: 2
input:
  - squads/agent-social-media-v2/output/angles.yaml
  - squads/agent-social-media-v2/input/content.md
  - squads/agent-social-media-v2/pipeline/data/real-imagery-and-safe-zones.md
  - squads/agent-social-media-v2/pipeline/data/layout-variations.md
output:
  - squads/agent-social-media-v2/output/carousel-draft.md
---

## Regra obrigatória — português BR e maiúsculas

- **Idioma:** escrever sempre em **português brasileiro** com **gramática e ortografia** corretas (acentuação, hífen, crase, concordância, pontuação). Revisar o draft antes de entregar.
- **Maiúscula inicial:** todo **Headline**, **Body**, parágrafos da **Caption**, **Ação 1 / Ação 2**, e textos em **Visual cue** que forem frases completas começam com **letra maiúscula**. Cada nova frase após **.** também começa com maiúscula. Não iniciar linha de slide com minúscula (exceto nomes próprios no meio da frase, siglas ou dados já formatados).

---

## Regra obrigatória — texto curto (Instagram / feed mobile)

O carrossel é lido **em tela pequena e em scan**. Menos texto no slide; a **caption** pode carregar nuance e contexto.

- **Frases curtas:** preferir **≤12 palavras** por frase quando couber; evitar períodos com duas ou mais orações em uma linha só.
- **Slide 2 (contexto):** **2 ou 3 frases curtas** (nunca parágrafo longo). Total do body na faixa **~25–45 palavras** como referência (não precisa contar no arquivo; use como teto mental).
- **Slides 3 e 4 (desenvolvimento):** **headline** em uma linha; **body** com **no máximo 2 frases curtas**; **preferir ≤3 linhas visíveis** no slide (**nunca** 5 linhas como alvo).
- **Slide 5 (reflexão) e slide 6 (CTA):** headline + **no máximo 1–2 frases curtas** no body.

---

## Process

0. **Aplicar** a secção **«português BR e maiúsculas»** acima em todo o ficheiro de saída.

1. **Ler `real-imagery-and-safe-zones.md` e `layout-variations.md`** antes de escrever. Os **Visual cues** são o contrato com a Dária (fundos fotográficos por slide, safe zone, texto editorial **à esquerda** em todos os slides; **rodapé** `@innovationlatam` + `ARRASTE ->`; **padding lateral 100px**; viewport **1080×1350**).

2. **Ler o ângulo selecionado (já escolhido pelo usuário no input).** Abrir `output/angles.yaml`, confirmar `angulo_escolhido_pelo_usuario` e localizar o ângulo com `selected: true` e o `hook_preview`. O usuário definiu `angulo_escolhido` em `input/content.md`; Carlos **não** troca de ângulo neste passo — só desenvolve o carrossel nessa lente. O `hook_preview` é o ponto de partida para o slide 1.

3. **Definir a estrutura do carrossel — exatamente 6 slides (fixo).** Papéis obrigatórios: Slide 1 (hook) → Slide 2 (contexto/imagem) → **Slides 3 e 4** (desenvolvimento, 1 ideia por slide) → Slide 5 (reflexão) → Slide 6 (CTA). Não gerar 5, 7 ou 8 slides.

4. **Escrever o Slide 1 (hook).** Começar com o dado-âncora — a afirmação mais surpreendente, direta ao ponto. Máximo 2 linhas visíveis. Deve passar o scroll-stop test. **Visual cue** = Cover Layout (cena full-bleed, banda 60–80%, headline alinhada à esquerda no bloco, gold, compliance se marcas terceiras).

5. **Escrever o Slide 2 (contexto).** Responde "Por que esse dado importa?" com **2 ou 3 frases curtas** (ver regra acima). Sem parágrafos nem blocos de artigo. **Visual cue** = Image Context com cenário concreto full-bleed.

6. **Escrever os slides de desenvolvimento (slides 3 e 4 apenas).** Uma ideia por slide. **No máximo 2 frases curtas** no body; **preferir ≤3 linhas visíveis**. Não usar travessão (—): substituir por ponto final ou vírgula. Cada slide avança a narrativa. Verificar: nenhuma informação repetida. **Visual cue** = Standard ou Split (texto **à esquerda**, padding 100px).

7. **Escrever o slide de reflexão (slide 5).** Síntese emocional. Uma pergunta ou afirmação que toca na realidade do leitor profissional de inovação. NÃO um dado novo.

8. **Escrever o slide de CTA (slide 6).** Duas ações específicas ao tema: salvar + comentar. O CTA deve conectar o conteúdo do carrossel a um próximo passo específico do leitor.

9. **Escrever a caption Instagram.** Hook nas primeiras 125 chars (para o preview de feed) + body + pergunta final + 8-12 hashtags no final. Máximo 2.200 chars total.

10. **Revisar o draft completo.** Confirmar **exatamente 6 slides**. Verificar: slide 1 não começa com marca, **nenhum slide com mais de 4 linhas** no corpo (meta: ≤3), frases curtas, nenhuma informação repetida, slide 5 = reflexão e slide 6 = CTA, **Visual cues** conforme norma v3. **Revisão de língua:** PT-BR correto; maiúsculas nos inícios de texto/frase conforme regra acima.

11. **Opcional:** Incluir no topo do draft o bloco **Brief de layout (esta run)** (modelo em `real-imagery-and-safe-zones.md` §3).

## Output Format

```markdown
# Carrossel: [TÍTULO DESCRITIVO]
**Ângulo:** [ângulo selecionado]
**Dado-âncora:** [dado âncora e fonte]
**Total de slides:** 6

---

## Brief de layout (esta run)
_Opcional — ver `real-imagery-and-safe-zones.md` §3._

---

## Slide 1 — HOOK (Cover Layout)
**Headline:** [texto da headline — máx 2 linhas]
**Visual cue:** Cover Layout — fundo full-bleed [cena]; headline banda 60–80% **à esquerda** no bloco; padding **100px**; gold #e8c85c; [compliance]

---

## Slide 2 — CONTEXTO (Image Context Layout)
**Headline:** [texto — 1 linha]
**Body:** [2 ou 3 frases curtas; ~25–45 palavras no total; fonte em linha final se couber]
**Visual cue:** Image Context — full-bleed [cenário]; overlay; data-URI na implementação

---

## Slide 3 — [NOME DO PONTO] (Standard/Split Content Layout)
**Headline:** [texto — 1 linha]
**Body:** [no máximo 2 frases curtas — preferir ≤3 linhas visíveis]
**Visual cue:** Standard ou Split **v3** — texto **à esquerda**; padding **100px**; rodapé @ + ARRASTE ->; safe zone y ≥ **1150px**; viewport **1080×1350**

---

[slides adicionais com mesma estrutura]

---

## Slide N-1 — REFLEXÃO (Reflection Layout)
**Headline:** [pergunta ou afirmação de reflexão]
**Body:** [complemento opcional]
**Visual cue:** Reflection layout — texto **à esquerda**, padding **100px**, rodapé, espaçamento generoso

---

## Slide N — CTA (CTA Layout)
**Headline:** [headline do CTA]
**Body:** [contexto da ação]
**Ação 1 (Salvar):** [instrução de save específica ao tema]
**Ação 2 (Comentar):** [pergunta de comentário específica ao tema]
**Visual cue:** CTA layout — botão teal, alto contraste

---

## Caption Instagram

[Hook nos primeiros 125 chars]

[Body da caption — 3-5 parágrafos]

[Pergunta final para engajamento]

📌 [CTA de salvar na caption]

#hashtag1 #hashtag2 #hashtag3 [...] #hashtag12
```

## Output Example

```markdown
# Carrossel: IA Corporativa — O Gap que Ninguém Fala
**Ângulo:** Contrário / Revelador
**Dado-âncora:** 78% declaram IA como prioridade, apenas 12% têm programa real (McKinsey, 2025)
**Total de slides:** 6

---

## Slide 1 — HOOK (Cover Layout)
**Headline:** 78% das empresas dizem que IA é prioridade.
Só 12% têm um programa real.
**Visual cue:** Cover Layout. Fundo full-bleed (ex. AI brain glow). Headline banda 60%–80%, alinhada à esquerda no bloco; padding 100px. "78%" e "12%" em gold #e8c85c.

---

## Slide 2 — CONTEXTO (Image Context Layout)
**Headline:** O que separa os 12% dos 78%?
**Body:** Não é orçamento. É estrutura.
Quem entrega tem caso de uso claro, time dedicado e pilotos rápidos.
O resto trava no slide de estratégia.
*(McKinsey Global Institute, 2025)*
**Visual cue:** Imagem full-bleed sala de reunião tech + overlay rgba(21,10,28,0.85). Headline 46px, body 36px, destaques em teal #c0fefd.

---

## Slide 3 — POR QUE AS INTENÇÕES NÃO VIRAM PROJETOS (Standard Content Layout)
**Headline:** Por que as intenções não viram projetos?
**Body:** Porque "programa de IA" foi delegado ao TI.
Mas 73% dos casos de uso mais rentáveis de IA surgem do negócio: vendas, operações, RH — não do departamento de tecnologia.
*(Harvard Business Review, 2024)*
**Visual cue:** Standard Content Layout. Destaque teal em "73%".

---

## Slide 4 — O ERRO MAIS COMUM (Split Content Layout)
**Headline:** O erro mais comum das empresas
**Body:** Buscar a transformação perfeita em vez do experimento imperfeito.
**Callout box:** Um piloto bem desenhado leva 6-8 semanas. As empresas que mais avançam fazem 4-6 pilotos por ano.
**Complemento:** As que ficam para trás esperaram o projeto "ideal" por 18 meses. *(Gartner, 2025)*
**Visual cue:** Split Content Layout. Callout box com borda teal e background rgba(153,60,177,0.30).

---

## Slide 5 — REFLEXÃO (Reflection Layout)
**Headline:** A pergunta que sua empresa precisa responder hoje:
**Body:** Você está nos 12% que fazem — ou nos 66% que falam?
Não existe posição neutra nessa corrida. Cada trimestre de espera é vantagem que vai para o competidor que começou antes.
**Visual cue:** Reflection Layout — texto **à esquerda**, padding 100px, gradiente sutil, rodapé @ + ARRASTE ->.

---

## Slide 6 — CTA (CTA Layout)
**Headline:** Salva esse carrossel.
**Body:** Da próxima vez que o board perguntar "mas como começamos com IA", você vai ter a estrutura certa.
**Ação 1 (Salvar):** Salva esse carrossel para a próxima reunião de estratégia.
**Ação 2 (Comentar):** Comenta: sua empresa está nos 12% ou nos 66%?
**Visual cue:** CTA Layout — botão teal sólido #50beba, "Salva" em texto escuro #0d0718, ação de comentar em gold.

---

## Caption Instagram

78% das empresas dizem que IA é prioridade estratégica. Só 12% têm um programa real em produção. 🔍

O gap não é de tecnologia. É de estrutura — e de coragem para começar pequeno e iterar rápido.

Os 12% que fazem têm três coisas: caso de uso específico, equipe dedicada e ciclos curtos de experimentação. O resto tem PowerPoints de estratégia.

73% dos casos de uso mais rentáveis de IA não surgem do TI. Surgem do negócio. Isso muda tudo sobre como estruturar um programa.

Em qual lado dessa divisão a sua empresa está?

📌 Salva esse carrossel para a próxima conversa sobre IA corporativa na sua empresa.

#inovacaocorporativa #inteligenciaartificial #inovacao #transformacaodigital #openinnovation #innovationlatam #startups #gestaoinovacao #corporateinnovation #AIstrategy #inovacaoaberta #empreendedorismocorporativo
```

## Quality Criteria

- Ortografia e gramática **brasileiras**; maiúscula no início de cada bloco de copy e após ponto final
- Slide 1 abre com dado-âncora — nunca apresentação, marca ou "Hoje vamos falar"
- **Exatamente 6 slides** (hook + contexto + 2 desenvolvimento + reflexão + CTA)
- **Copy enxuto:** slide 2 com 2–3 frases curtas; slides 3–4 com **≤3 linhas visíveis** no corpo (máximo 4 só se inevitável); frases curtas em todo o carrossel
- Slide 5 é de reflexão emocional — sem dados novos
- CTA tem exatamente 2 ações específicas ao tema (salvar + comentar)
- Caption com hook nos primeiros 125 chars + 8-12 hashtags no final (detalhe e contexto ficam aqui)

## Veto Conditions

0. **Língua:** copy com erros graves de ortografia/gramática (PT-BR) ou linhas de slide/caption que deveriam começar com maiúscula e começam com minúscula — revisar e corrigir antes de entregar
1. **Total de slides diferente de 6** — estrutura fixa obrigatória
2. Slide 1 começa com nome da marca, "Hoje vamos falar" ou qualquer apresentação — falha de scroll-stop
3. Slide de reflexão contém dado novo — violação do papel do slide de reflexão
4. Qualquer slide com **parágrafo longo** ou **mais de 4 linhas** no corpo (texto de artigo no slide) — falha de formato Instagram
