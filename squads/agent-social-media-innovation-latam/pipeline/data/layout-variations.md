# Layout Variations — Sistema post-05
**Squad:** agent-social-media-innovation-latam
**Propósito:** Resolução do conflito entre "variação de layout" (editorial) e "identidade visual fixa" (post-05)
**Atualizado:** 2026-04-01

---

## Princípio Fundamental

**Variação de layout ≠ variação de identidade visual.**

Este documento define como criar ritmo visual entre slides SEM sair dos tokens do sistema post-05. Toda variação é composicional — usa as mesmas cores, a mesma fonte, o mesmo logo, o mesmo rodapé. Apenas a composição e a hierarquia de texto mudam.

**Regra de ouro:** Nenhuma cor nova. Nenhuma fonte nova. Apenas composição variada dentro dos tokens existentes.

---

## Tokens Imutáveis (Referência Rápida)

```
Fonte:        Montserrat exclusivamente (Google Fonts)
Bg slides 3+: linear-gradient(135deg, #150a1c 0%, #2a1538 100%)
Destaque 1:   #c0fefd  (teal)
Destaque 2:   #e8c85c  (gold)
Institucional:#993CB1  (roxo — para efeitos especiais, brilhos, glows)
Logo:         branco, data-URI, canto superior esquerdo, max-width 200px, margem 30px
Rodapé:       @innovationlatam esquerda | ARRASTE → direita, Montserrat 600 24px
Dimensões:    1080px × 1440px
```

---

## As 6 Variações de Layout Permitidas

---

### Variação 1: Cover Layout (Slide 1 — Obrigatória)

**Aplica-se a:** Slide 1 (hook âncora) exclusivamente

**Descrição:** Hero text no terço inferior sobre fundo de imagem full-bleed com gradiente escuro forte. O impacto vem da tipografia grande e da imagem de fundo.

**Estrutura HTML:**
```html
<body style="
  width:1080px; height:1440px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background-image: url('[DATA-URI-IMAGEM]');
  background-size: cover; background-position: center;
  position: relative;
">
  <!-- Logo -->
  <div style="position:absolute; top:30px; left:30px;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <!-- Gradiente overlay escuro da base -->
  <div style="
    position:absolute; bottom:0; left:0; right:0; height:75%;
    background: linear-gradient(to top, rgba(21,10,28,0.98) 60%, transparent 100%);
  "></div>

  <!-- Bloco de texto no terço inferior -->
  <div style="
    position:absolute; bottom:10%; left:5%; right:5%;
  ">
    <h1 style="
      font-size:82px; font-weight:700; color:#fff;
      letter-spacing:-0.02em; line-height:1.05; margin:0;
    ">
      [HEADLINE COM <span style="color:#e8c85c;">[DADO ÂNCORA]</span>]
    </h1>
  </div>

  <!-- Rodapé -->
  <div style="
    position:absolute; bottom:30px; left:5%; right:5%;
    display:flex; justify-content:space-between;
    font-size:24px; font-weight:600; color:rgba(255,255,255,0.6);
  ">
    <span>@innovationlatam</span>
    <span>ARRASTE →</span>
  </div>
</body>
```

**CSS Rules Específicas:**
- `font-size: 82px`, `font-weight: 700`, `letter-spacing: -0.02em`
- Gradiente: `linear-gradient(to top, rgba(21,10,28,0.98) 60%, transparent 100%)`
- Destaques em `#e8c85c` (gold) ou `#c0fefd` (teal) para o dado âncora

---

### Variação 2: Image Context Layout (Slide 2 — Obrigatória)

**Aplica-se a:** Slide 2 (slide de contexto) exclusivamente

**Descrição:** Imagem full-bleed com overlay escuro forte. Maior carga de texto do carrossel. Headline + body longo.

**Estrutura HTML:**
```html
<body style="
  width:1080px; height:1440px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background-image: url('[DATA-URI-IMAGEM-CONTEXTO]');
  background-size: cover; background-position: center;
  position: relative;
">
  <!-- Overlay escuro forte -->
  <div style="
    position:absolute; inset:0;
    background: rgba(21,10,28,0.85);
  "></div>

  <!-- Logo -->
  <div style="position:absolute; top:30px; left:30px; z-index:2;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <!-- Conteúdo de texto -->
  <div style="
    position:absolute; top:140px; left:5%; right:5%; bottom:80px;
    display:flex; flex-direction:column; justify-content:center; z-index:2;
  ">
    <h2 style="
      font-size:46px; font-weight:700; color:#fff;
      margin:0 0 32px 0; line-height:1.15;
    ">[HEADLINE]</h2>
    <p style="
      font-size:36px; font-weight:500; color:#fff;
      line-height:1.5; margin:0;
    ">
      [BODY COM <span style="color:#c0fefd;">[DESTAQUES EM TEAL]</span>]
    </p>
  </div>

  <!-- Rodapé -->
  <div style="
    position:absolute; bottom:30px; left:5%; right:5%; z-index:2;
    display:flex; justify-content:space-between;
    font-size:24px; font-weight:600; color:rgba(255,255,255,0.6);
  ">
    <span>@innovationlatam</span>
    <span>ARRASTE →</span>
  </div>
</body>
```

**CSS Rules Específicas:**
- Overlay: `rgba(21,10,28,0.75)` mínimo, até `rgba(21,10,28,0.95)` em imagens complexas
- Headline: `font-size: 46px`, `font-weight: 700`
- Body: `font-size: 36px`, `font-weight: 500`
- Destaques em `#c0fefd` (teal)
- Maior volume de texto — 60 a 120 palavras no body

---

### Variação 3: Standard Content Layout (Slides 3+ — Layout Base)

**Aplica-se a:** Slides de conteúdo 3 em diante (layout padrão)

**Descrição:** Fundo roxo sólido, texto alinhado à esquerda, hierarquia clara headline + body. É o layout base dos slides de conteúdo.

**Estrutura HTML:**
```html
<body style="
  width:1080px; height:1440px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background: linear-gradient(135deg, #150a1c 0%, #2a1538 100%);
  display:flex; flex-direction:column;
  padding: 0 54px;
  box-sizing: border-box;
">
  <!-- Logo -->
  <div style="padding-top:30px; margin-left:-24px;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <!-- Conteúdo principal -->
  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; padding:40px 0;">
    <h2 style="
      font-size:52px; font-weight:700; color:#fff;
      margin:0 0 32px 0; line-height:1.15;
    ">[HEADLINE]</h2>
    <p style="
      font-size:40px; font-weight:500; color:#fff;
      line-height:1.4; margin:0;
    ">
      [BODY COM <span style="color:#c0fefd;">[DESTAQUES EM TEAL]</span>]
    </p>
  </div>

  <!-- Rodapé -->
  <div style="
    display:flex; justify-content:space-between; padding-bottom:30px;
    font-size:24px; font-weight:600; color:rgba(255,255,255,0.5);
  ">
    <span>@innovationlatam</span>
    <span>ARRASTE →</span>
  </div>
</body>
```

**CSS Rules Específicas:**
- Background: `linear-gradient(135deg, #150a1c 0%, #2a1538 100%)`
- Headline: `font-size: 52px`, `font-weight: 700`
- Body: `font-size: 40px`, `font-weight: 500`
- Destaques em `#c0fefd`

---

### Variação 4: Split Content Layout (Slides 3+ — Variação com Callout Box)

**Aplica-se a:** Slides de conteúdo 3 em diante (alternativa ao Standard para criar ritmo)

**Descrição:** Fundo roxo sólido com headline no topo + caixa de destaque semi-transparente para o dado ou frase principal. Cria hierarquia visual mais forte e destaca dados numéricos.

**Estrutura HTML:**
```html
<body style="
  width:1080px; height:1440px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background: linear-gradient(135deg, #150a1c 0%, #2a1538 100%);
  display:flex; flex-direction:column;
  padding: 0 54px;
  box-sizing: border-box;
">
  <!-- Logo -->
  <div style="padding-top:30px; margin-left:-24px;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <!-- Conteúdo principal -->
  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:40px;">
    <h2 style="
      font-size:52px; font-weight:700; color:#fff;
      margin:0; line-height:1.15;
    ">[HEADLINE]</h2>

    <!-- Callout box com dado ou frase-chave -->
    <div style="
      background: rgba(153,60,177,0.30);
      border-left: 4px solid #c0fefd;
      border-radius: 0 12px 12px 0;
      padding: 32px 36px;
    ">
      <p style="
        font-size:44px; font-weight:700; color:#c0fefd;
        margin:0; line-height:1.2;
      ">[DADO OU FRASE DE DESTAQUE]</p>
    </div>

    <p style="
      font-size:38px; font-weight:500; color:rgba(255,255,255,0.85);
      margin:0; line-height:1.4;
    ">[CONTEXTO OU COMPLEMENTO]</p>
  </div>

  <!-- Rodapé -->
  <div style="
    display:flex; justify-content:space-between; padding-bottom:30px;
    font-size:24px; font-weight:600; color:rgba(255,255,255,0.5);
  ">
    <span>@innovationlatam</span>
    <span>ARRASTE →</span>
  </div>
</body>
```

**CSS Rules Específicas:**
- Callout box background: `rgba(153,60,177,0.30)` — usa a cor institucional em versão transparente
- Borda esquerda do callout: `4px solid #c0fefd`
- Texto do callout: `#c0fefd`, `font-weight: 700`
- Nenhuma cor nova — apenas variação de opacidade de tokens existentes

---

### Variação 5: Reflection Layout (Penúltimo Slide — Obrigatória)

**Aplica-se a:** Penúltimo slide de conteúdo (slide de reflexão) exclusivamente

**Descrição:** Fundo roxo com espaçamento generoso, texto centralizado, gradiente sutil mais suave. O visual cria pausa — é o único slide sem texto alinhado à esquerda.

**Estrutura HTML:**
```html
<body style="
  width:1080px; height:1440px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background: linear-gradient(160deg, #1a0d24 0%, #2a1538 50%, #150a1c 100%);
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding: 80px 72px;
  box-sizing: border-box;
  position: relative;
">
  <!-- Logo -->
  <div style="position:absolute; top:30px; left:30px;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <!-- Conteúdo centralizado -->
  <div style="text-align:center; max-width:900px;">
    <p style="
      font-size:28px; font-weight:500; color:rgba(192,254,253,0.7);
      margin:0 0 48px 0; letter-spacing:0.05em; text-transform:uppercase;
    ">reflexão</p>
    <p style="
      font-size:52px; font-weight:700; color:#fff;
      line-height:1.3; margin:0 0 48px 0;
    ">[PERGUNTA OU AFIRMAÇÃO DE REFLEXÃO]</p>
    <p style="
      font-size:38px; font-weight:500; color:rgba(255,255,255,0.75);
      line-height:1.45; margin:0;
    ">[COMPLEMENTO DA REFLEXÃO — OPCIONAL]</p>
  </div>
</body>
```

**CSS Rules Específicas:**
- Gradiente levemente diferente: `160deg` em vez de `135deg`, com mais camadas
- Texto centralizado (`text-align: center`) — única variação onde isso é aplicado
- Label "reflexão" em teal com opacidade: `rgba(192,254,253,0.7)`
- Sem rodapé "ARRASTE →" — este slide não quer que o usuário saia ainda
- Padding maior: `80px` laterais vs `54px` dos slides padrão

---

### Variação 6: CTA Layout (Último Slide — Obrigatória)

**Aplica-se a:** Último slide (CTA) exclusivamente

**Descrição:** Alto contraste visual, elemento tipo botão em teal ou gold, hierarquia clara das duas ações (salvar + comentar). Visualmente distinto de todos os outros slides.

**Estrutura HTML:**
```html
<body style="
  width:1080px; height:1440px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background: linear-gradient(135deg, #0d0718 0%, #1e0d2e 50%, #150a1c 100%);
  display:flex; flex-direction:column;
  padding: 0 54px;
  box-sizing: border-box;
  position: relative;
">
  <!-- Logo -->
  <div style="padding-top:30px; margin-left:-24px;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <!-- Conteúdo do CTA -->
  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:48px;">
    <h2 style="
      font-size:62px; font-weight:800; color:#fff;
      margin:0; line-height:1.1;
    ">[HEADLINE DO CTA]</h2>

    <p style="
      font-size:40px; font-weight:500; color:rgba(255,255,255,0.85);
      margin:0; line-height:1.4;
    ">[BODY DO CTA — CONTEXTO DA AÇÃO]</p>

    <!-- Elemento tipo botão — ação 1 (Salvar) -->
    <div style="
      background: #50beba;
      border-radius: 16px;
      padding: 28px 40px;
      display: inline-flex; align-items: center; gap: 16px;
    ">
      <span style="font-size:38px;">📌</span>
      <span style="
        font-size:36px; font-weight:700; color:#0d0718;
      ">[AÇÃO DE SALVAR — ESPECÍFICA AO TEMA]</span>
    </div>

    <!-- Ação 2 (Comentar) -->
    <p style="
      font-size:36px; font-weight:600; color:#e8c85c;
      margin:0;
    ">💬 [AÇÃO DE COMENTAR — ESPECÍFICA AO TEMA]</p>
  </div>
</body>
```

**CSS Rules Específicas:**
- Gradiente mais escuro: começa de `#0d0718` para criar diferenciação máxima
- Botão de CTA: `background: #50beba` (teal sólido de alta saturação) — único slide onde teal é fundo
- Texto no botão: `color: #0d0718` (roxo escuro) — alto contraste sobre teal
- Ação secundária: `color: #e8c85c` (gold) — diferencia das ações primárias
- Headline maior: `font-size: 62px`, `font-weight: 800`
- Sem rodapé "ARRASTE →" — este é o último slide

---

## Regras de Uso das Variações

### Sequência Recomendada (8 slides)

| Slide | Variação | Obrigatoriedade |
|-------|----------|----------------|
| 1 | Cover Layout | Obrigatória |
| 2 | Image Context Layout | Obrigatória |
| 3 | Standard Content Layout | Recomendada (base) |
| 4 | Split Content Layout | Recomendada (alternância) |
| 5 | Standard Content Layout | Recomendada |
| 6 | Split Content Layout | Recomendada |
| 7 | Reflection Layout | Obrigatória |
| 8 | CTA Layout | Obrigatória |

### Para 7 slides

| Slide | Variação |
|-------|----------|
| 1 | Cover |
| 2 | Image Context |
| 3 | Standard |
| 4 | Split |
| 5 | Standard |
| 6 | Reflection |
| 7 | CTA |

### Para 9 slides

| Slide | Variação |
|-------|----------|
| 1 | Cover |
| 2 | Image Context |
| 3 | Standard |
| 4 | Split |
| 5 | Standard |
| 6 | Split |
| 7 | Standard |
| 8 | Reflection |
| 9 | CTA |

---

## Veto Conditions de Layout

1. Usar a mesma variação em mais de 2 slides consecutivos (exceto Cover e Image Context que são únicos)
2. Criar qualquer cor fora dos tokens definidos neste documento
3. Usar fonte diferente de Montserrat em qualquer variação
4. Remover o logo de qualquer slide
5. Omitir o rodapé em slides que não são Reflection ou CTA
6. Usar texto centralizado em qualquer slide exceto o Reflection Layout
