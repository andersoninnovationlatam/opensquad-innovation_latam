# Layout Variations — Sistema post-05 + Instagram 4:5 (1080×1350) mobile
**Squad:** agent-social-v3
**Propósito:** Variação editorial mantendo tokens post-05; **norma completa** em `real-imagery-and-safe-zones.md` (precedência em caso de dúvida).
**Atualizado:** 2026-04-06 — texto editorial **à esquerda** em todos os slides; rodapé **`@innovationlatam`** + **`ARRASTE ->`**; fundos fotográficos via pipeline (`generate-bg-image` + `inject-bg-and-render`).

---

## Layout (norma atual — este squad)

- **Canvas:** **1080×1350px** (proporção **4:5**).
- **Faixa proibida para texto editorial:** `y ≥ 1150px` (últimos **200px**). Detalhes em **`real-imagery-and-safe-zones.md`**.
- **Padding lateral (norma fixa):** **100px** esquerda/direita (mínimo aceitável **72px** com nota em `design-documentation.md`).
- **Alinhamento:** texto editorial **`text-align: left`** em **todos** os slides (slide 1 na banda; slides 2–6 na área útil); `align-items: flex-start` onde usar flex column.
- **Logo:** canto superior esquerdo (`top: 30px`, `left: 100px`), inalterável.
- **Rodapé no canvas:** **`@innovationlatam`** à esquerda e **`ARRASTE ->`** à direita (ex.: `bottom: 0; margin-bottom: 20px`, `left/right: 100px`, `justify-content: space-between`).

---

## Princípio Fundamental

**Variação de layout ≠ variação de identidade visual.**

Variação composicional com os mesmos tokens (cores, Montserrat, logo). **Nenhuma cor nova. Nenhuma fonte nova.**

**Nota:** Os blocos de exemplo HTML mais abaixo podem ainda mostrar `text-align: center` ou omitir o rodapé; a **norma vigente** é a do início deste ficheiro e `real-imagery-and-safe-zones.md` (texto à esquerda + `@innovationlatam` / `ARRASTE ->`).

---

## Tokens Imutáveis (Referência Rápida)

```
Fonte:        Montserrat exclusivamente (Google Fonts)
Bg slides 3+: placeholder .bg-synth no HTML; fundo final = foto IA injetada (.real-bg)
Destaque 1:   #c0fefd  (teal) — classes .hl-teal
Destaque 2:   #e8c85c  (gold) — classes .hl-gold
Institucional:#993CB1  (roxo — glows)
Logo:         branco, data-URI, canto superior esquerdo, max-width 200px, top 30px / left 100px
Dimensões:    1080px × 1350px
Export:       slide-NN.jpg em rendered/ (ver real-imagery-and-safe-zones.md)
```

---

## As 6 Variações de Layout Permitidas

---

### Variação 1: Cover Layout (Slide 1 — Obrigatória)

**Headline** na faixa **60%–80%** (`top: 810px`, `height: 270px`), **alinhada à esquerda** na banda. Fundo full-bleed (foto IA após inject). **Rodapé** `@innovationlatam` + `ARRASTE ->` obrigatório (o snippet abaixo omite por brevidade — ver `gen-slides-for-run.mjs`).

```html
<body style="
  width:1080px; height:1350px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background-image: url('[DATA-URI-IMAGEM]');
  background-size: cover; background-position: center;
  position: relative;
">
  <div style="position:absolute; top:30px; left:100px; z-index:2;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <div style="
    position:absolute; inset:0;
    background: linear-gradient(to bottom, rgba(21,10,28,0.5) 0%, rgba(21,10,28,0.85) 55%, rgba(21,10,28,0.95) 100%);
  "></div>

  <div style="
    position:absolute; top:810px; left:100px; right:100px; height:270px;
    display:flex; flex-direction:column; align-items:flex-start; justify-content:center; text-align:left; z-index:2;
  ">
    <h1 style="
      font-size:76px; font-weight:700; color:#fff;
      letter-spacing:-0.02em; line-height:1.1; margin:0;
      max-width:100%;
    ">
      [HEADLINE COM <span style="color:#e8c85c;">[DADO ÂNCORA]</span>]
    </h1>
  </div>
</body>
```

- Capa: `font-size: 76–82px` conforme comprimento da manchete (evitar overflow).

---

### Variação 2: Image Context Layout (Slide 2 — Obrigatória)

Área de texto termina **acima de y=1150px**. Conteúdo **à esquerda** na área útil (o HTML de exemplo abaixo pode ainda mostrar `text-align:center`; a norma vigente é à esquerda + rodapé).

```html
<body style="
  width:1080px; height:1350px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background-image: url('[DATA-URI-IMAGEM-CONTEXTO]');
  background-size: cover; background-position: center;
  position: relative;
">
  <div style="position:absolute; inset:0; background: rgba(21,10,28,0.85);"></div>

  <div style="position:absolute; top:30px; left:100px; z-index:2;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <div style="
    position:absolute; top:130px; left:100px; right:100px; bottom:250px;
    display:flex; flex-direction:column; justify-content:center; z-index:2;
    text-align:center; align-items:center;
  ">
    <h2 style="font-size:46px; font-weight:700; color:#fff; margin:0 0 28px 0; line-height:1.15; max-width:100%;">
      [HEADLINE]
    </h2>
    <p style="font-size:36px; font-weight:500; color:#fff; line-height:1.5; margin:0; max-width:100%;">
      [BODY COM <span style="color:#c0fefd;">[DESTAQUES]</span>]
    </p>
  </div>
</body>
```

---

### Variação 3: Standard Content Layout (Slides 3+)

Texto **à esquerda**. Fundo final = foto IA (não apenas gradiente estático no entregável).

```html
<body style="
  width:1080px; height:1350px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background: linear-gradient(135deg, #150a1c 0%, #2a1538 100%);
  display:flex; flex-direction:column;
  padding: 0 100px;
  box-sizing: border-box;
  position:relative;
">
  <div style="padding-top:30px; flex-shrink:0;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <div style="
    flex:1; min-height:0;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; padding:20px 0 230px 0; width:100%;
  ">
    <h2 style="font-size:50px; font-weight:700; color:#fff; margin:0 0 28px 0; line-height:1.15; width:100%;">
      [HEADLINE]
    </h2>
    <p style="font-size:40px; font-weight:500; color:#fff; line-height:1.45; margin:0; width:100%;">
      [BODY COM <span style="color:#c0fefd;">[DESTAQUES]</span>]
    </p>
  </div>
</body>
```

---

### Variação 4: Split Content Layout (Slides 3+)

Callout e editorial **à esquerda**; o exemplo HTML abaixo pode usar markup antigo — aplicar `text-align:left` e rodapé na implementação real.

```html
<body style="
  width:1080px; height:1350px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background: linear-gradient(135deg, #150a1c 0%, #2a1538 100%);
  display:flex; flex-direction:column;
  padding: 0 100px;
  box-sizing: border-box;
  position:relative;
">
  <div style="padding-top:30px; flex-shrink:0;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <div style="
    flex:1; min-height:0;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    text-align:center; gap:36px; padding:20px 0 230px 0; width:100%;
  ">
    <h2 style="font-size:50px; font-weight:700; color:#fff; margin:0; line-height:1.15; width:100%;">[HEADLINE]</h2>

    <div style="
      background: rgba(153,60,177,0.30);
      border-left: 4px solid #c0fefd;
      border-radius: 0 12px 12px 0;
      padding: 28px 32px; width:100%; max-width:100%; text-align:center; box-sizing:border-box;
    ">
      <p style="font-size:42px; font-weight:700; color:#c0fefd; margin:0; line-height:1.25;">[DADO OU FRASE]</p>
    </div>

    <p style="font-size:38px; font-weight:500; color:rgba(255,255,255,0.85); margin:0; line-height:1.45; width:100%;">
      [COMPLEMENTO]
    </p>
  </div>
</body>
```

---

### Variação 5: Reflection Layout (Penúltimo)

**Com rodapé** obrigatório. Texto **à esquerda** (exemplo HTML legado pode omitir rodapé no bloco).

```html
<body style="
  width:1080px; height:1350px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background: linear-gradient(160deg, #1a0d24 0%, #2a1538 50%, #150a1c 100%);
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding: 72px 100px 180px 100px;
  box-sizing: border-box;
  position: relative;
">
  <div style="position:absolute; top:30px; left:100px;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <div style="text-align:center; width:100%; max-width:100%;">
    <p style="font-size:28px; font-weight:500; color:rgba(192,254,253,0.7); margin:0 0 36px 0; letter-spacing:0.05em; text-transform:uppercase;">reflexão</p>
    <p style="font-size:48px; font-weight:700; color:#fff; line-height:1.3; margin:0 0 36px 0;">[PERGUNTA OU AFIRMAÇÃO]</p>
    <p style="font-size:36px; font-weight:500; color:rgba(255,255,255,0.75); line-height:1.45; margin:0;">[COMPLEMENTO — OPCIONAL]</p>
  </div>
</body>
```

---

### Variação 6: CTA Layout (Último)

**Com rodapé** obrigatório. Blocos **à esquerda** (exemplo HTML legado pode mostrar centrado).

```html
<body style="
  width:1080px; height:1350px; margin:0; overflow:hidden;
  font-family:'Montserrat',sans-serif;
  background: linear-gradient(135deg, #0d0718 0%, #1e0d2e 50%, #150a1c 100%);
  display:flex; flex-direction:column;
  padding: 0 100px;
  box-sizing: border-box;
  position: relative;
">
  <div style="padding-top:30px;">
    <img src="[DATA-URI-LOGO]" style="max-width:200px;" />
  </div>

  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:40px; text-align:center; padding-bottom:160px;">
    <h2 style="font-size:58px; font-weight:800; color:#fff; margin:0; line-height:1.1;">[HEADLINE DO CTA]</h2>
    <p style="font-size:38px; font-weight:500; color:rgba(255,255,255,0.85); margin:0; line-height:1.45; max-width:100%;">[BODY DO CTA]</p>
    <div style="background:#50beba; border-radius:16px; padding:24px 36px; display:inline-flex; align-items:center; gap:14px;">
      <span style="font-size:34px;">📌</span>
      <span style="font-size:34px; font-weight:700; color:#0d0718;">[AÇÃO SALVAR]</span>
    </div>
    <p style="font-size:34px; font-weight:600; color:#e8c85c; margin:0;">💬 [AÇÃO COMENTAR]</p>
  </div>
</body>
```

---

## Regras de Uso — Sequência (6 slides)

| Slide | Variação |
|-------|----------|
| 1 | Cover |
| 2 | Image Context |
| 3 | Standard |
| 4 | Split |
| 5 | Reflection |
| 6 | CTA |

---

## Veto Conditions de Layout

1. Mesma variação em mais de 2 slides consecutivos (exceto Cover e Image Context únicos)
2. Qualquer cor fora dos tokens
3. Fonte diferente de Montserrat
4. Logo ausente
5. **Rodapé** com `@innovationlatam` e `ARRASTE ->` **ausente** em qualquer slide — **proibido**
6. Texto editorial na **faixa proibida** `y ≥ 1150px`
7. Cover com headline **fora** da banda 60%–80%
8. **`text-align: center`** no bloco principal de conteúdo (slides 2–6) — **proibido**; norma: **à esquerda**
9. `body` com altura diferente de **1350px** ou largura diferente de **1080px**
