---
execution: inline
agent: daria-design
inputFile: squads/agent-social-media-innovation-latam/output/carousel-draft.md
outputFile: squads/agent-social-media-innovation-latam/output/slides/
---

## Context Loading

Antes de executar, carregar:
- `squads/agent-social-media-innovation-latam/output/carousel-draft.md` — copy completo de todos os slides
- `squads/agent-social-media-innovation-latam/pipeline/data/visual-identity.md` — padrão post-05 obrigatório
- `squads/agent-social-media-innovation-latam/pipeline/data/layout-variations.md` — as 6 variações de layout permitidas
- `squads/agent-social-media-innovation-latam/pipeline/data/anti-patterns.md` — o que nunca fazer no design
- `squads/agent-social-media-innovation-latam/agents/daria-design/tasks/design-slides.md` — task file

## Instructions

### Process

1. **Ler visual-identity.md e layout-variations.md na íntegra** antes de escrever qualquer linha de HTML. Os tokens são lei. As variações de layout são o único espaço criativo.

2. **Converter logo a data-URI.** Ler `squads/tech-instagram-carousel/assets/innovation-latam-logo-white.png` e converter a data-URI base64. Esta string será usada em todos os slides.

3. **Planejar a sequência de layouts** para todos os slides com base nos visual cues do carousel-draft.md e nas regras de layout-variations.md.

4. **Criar design-documentation.md** em `output/slides/` documentando: tokens usados, sequência de layouts planejada, checklist de WCAG AA.

5. **Criar slide-01.html (Cover Layout).** Montserrat 82px Bold, letter-spacing -0.02em, gradiente escuro sobre imagem AI brain glow (data-URI de `squads/tech-instagram-carousel/assets/ai-brain-glow.png` ou fallback com gradiente), destaques em gold #e8c85c.

6. **Verificar slide 1 completo** antes de avançar para os demais: logo presente, texto sem overflow, WCAG AA calculado.

7. **Criar slide-02.html (Image Context Layout).** Imagem full-bleed com overlay rgba(21,10,28,0.85), headline 46px 700, body 36px 500, destaques em teal #c0fefd. Verificar que body text tem mínimo 60 palavras.

8. **Criar slides de desenvolvimento (03 em diante).** Alternar Standard Content e Split Content Layout conforme planejado. Body 40px 500, destaques em teal #c0fefd ou gold #e8c85c. Verificar WCAG AA individualmente.

9. **Criar slide de reflexão (penúltimo, Reflection Layout).** Texto centralizado, padding lateral 72px, gradiente alternativo, sem rodapé "ARRASTE →".

10. **Criar slide de CTA (último, CTA Layout).** Elemento botão teal sólido #50beba, ações visualmente distintas, sem rodapé "ARRASTE →".

11. **Checklist final** de todos os slides: logo em todos, WCAG AA confirmado, sem overflow, dimensões 1080×1440px, variação de layout presente.

## Output Format

```html
<!-- slide-NN.html -->
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 1080px;
  height: 1440px;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
  /* background específico do layout */
}
</style>
</head>
<body>
  <!-- Logo -->
  <div style="position:absolute; top:30px; left:30px; z-index:10;">
    <img src="data:image/png;base64,[BASE64_LOGO]"
         style="max-width:200px; display:block;" alt="Innovation Latam" />
  </div>
  <!-- Conteúdo do slide -->
  <!-- Rodapé (quando aplicável) -->
</body>
</html>
```

```markdown
<!-- design-documentation.md -->
# Design Documentation
**Carrossel:** [título]
**Data:** [YYYY-MM-DD]

## Tokens
- Fonte: Montserrat (Google Fonts) — pesos usados: [lista]
- Bg slides 3+: linear-gradient(135deg, #150a1c 0%, #2a1538 100%)
- Teal: #c0fefd | Gold: #e8c85c | Overlay: rgba(21,10,28,0.XX)

## Sequência de Layouts
| Slide | Variação | WCAG AA |
|-------|----------|---------|
| 01 | Cover Layout | ✓ X.X:1 |
| 02 | Image Context Layout | ✓ X.X:1 |
[...]

## Checklist Final
- [x] Logo presente em todos os slides (N/N)
- [x] WCAG AA ≥ 4.5:1 em todos os slides
- [x] Sem overflow em nenhum slide
- [x] Dimensões 1080×1440px em todos os HTMLs
- [x] Variação de layout (N variações distintas)
```

## Output Example

```html
<!-- slide-04.html — Split Content Layout -->
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 1080px; height: 1440px; overflow: hidden;
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #150a1c 0%, #2a1538 100%);
  display: flex; flex-direction: column;
  padding: 0 54px;
}
</style>
</head>
<body>
  <div style="padding-top:30px; margin-left:-24px;">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
         style="max-width:200px; display:block;" alt="Innovation Latam" />
  </div>

  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:40px;">
    <h2 style="font-size:52px; font-weight:700; color:#fff; margin:0; line-height:1.15;">
      O que separa os programas que chegam ao mês 12
    </h2>

    <div style="background:rgba(153,60,177,0.30); border-left:4px solid #c0fefd;
                border-radius:0 12px 12px 0; padding:32px 36px;">
      <p style="font-size:38px; font-weight:700; color:#c0fefd; margin:0; line-height:1.3;">
        → Patrocinador C-level com autoridade real<br>
        → Budget pré-aprovado para pilotar<br>
        → Critério de sucesso definido antes
      </p>
    </div>

    <p style="font-size:36px; font-weight:500; color:rgba(255,255,255,0.8); margin:0; line-height:1.4;">
      Sem esses 3, o programa vira vitrine — não transformação.
      <span style="font-size:28px; color:rgba(255,255,255,0.5);">(Gartner, 2025)</span>
    </p>
  </div>

  <div style="display:flex; justify-content:space-between; padding-bottom:30px;
              font-size:24px; font-weight:600; color:rgba(255,255,255,0.5);">
    <span>@innovationlatam</span>
    <span>ARRASTE →</span>
  </div>
</body>
</html>
```

## Veto Conditions

1. Qualquer slide usando fonte diferente de Montserrat — violação inaceitável do sistema post-05, ativa REJECT automático na revisão
2. Logo ausente em qualquer slide — violação de identidade de marca, ativa REJECT automático na revisão
3. Texto sobre imagem sem overlay de no mínimo rgba(21,10,28,0.75) — falha WCAG AA garantida
4. Contraste calculado abaixo de 4.5:1 em qualquer elemento de texto — falha WCAG AA

## Quality Criteria

- Todos os slides 1080×1440px, HTML auto-suficiente, sem JS, sem CDN além de Google Fonts
- Logo branco via data-URI em todos os slides, posição e tamanho corretos
- WCAG AA (4.5:1) calculado e documentado para cada slide em design-documentation.md
- Sem overflow de texto em nenhum slide
- Ao menos 3 variações de layout distintas nos slides de conteúdo
