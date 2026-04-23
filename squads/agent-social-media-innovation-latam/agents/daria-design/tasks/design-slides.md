---
task: design-slides
agent: daria-design
order: 1
input:
  - squads/agent-social-media-innovation-latam/output/carousel-draft.md
  - squads/agent-social-media-innovation-latam/pipeline/data/visual-identity.md
  - squads/agent-social-media-innovation-latam/pipeline/data/layout-variations.md
output:
  - squads/agent-social-media-innovation-latam/output/slides/slide-01.html
  - squads/agent-social-media-innovation-latam/output/slides/slide-02.html
  - squads/agent-social-media-innovation-latam/output/slides/slide-NN.html
  - squads/agent-social-media-innovation-latam/output/slides/design-documentation.md
---

## Process

1. **Ler visual-identity.md antes de qualquer HTML.** Confirmar os tokens: fonte (Montserrat), paleta (roxo bg, teal, gold), logo (posição, tamanho, margem), rodapé (@innovationlatam | ARRASTE →), dimensões (1080×1440px).

2. **Ler layout-variations.md.** Identificar as 6 variações de layout e em quais slides cada uma se aplica. Planejar a sequência de layouts para todos os slides ANTES de criar o primeiro HTML.

3. **Converter o logo a data-URI.** Ler `squads/tech-instagram-carousel/assets/innovation-latam-logo-white.png` e converter a data-URI. Esta string será reutilizada em todos os slides.

4. **Criar design-documentation.md.** Documentar: tokens usados, sequência de layouts planejada, notas sobre imagens de fundo dos slides 1 e 2.

5. **Criar slide-01.html (Cover Layout).** Hero text no terço inferior, gradiente escuro sobre imagem AI brain glow (data-URI ou fallback), Montserrat 82px Bold, letter-spacing -0.02em, destaques em gold #e8c85c.

6. **Verificar slide 1 completo antes de avançar.** Confirmar: logo presente, WCAG AA calculado, sem overflow, dimensões 1080×1440px.

7. **Criar slide-02.html (Image Context Layout).** Imagem full-bleed + overlay rgba(21,10,28,0.85), headline 46px 700, body 36px 500, destaques teal #c0fefd. Verificar que o body tem mínimo 60 palavras.

8. **Criar slides de desenvolvimento (03 em diante).** Alternar entre Standard Content Layout e Split Content Layout conforme planejado. Verificar WCAG AA em cada slide individualmente.

9. **Criar slide de reflexão (penúltimo).** Reflection Layout: texto centralizado, espaçamento generoso (80px), sem rodapé "ARRASTE →", gradiente sutil diferente.

10. **Criar slide de CTA (último).** CTA Layout: elemento botão teal #50beba, texto ação em roxo escuro #0d0718, ação secundária em gold #e8c85c, sem rodapé "ARRASTE →".

11. **Verificação final de todos os slides.** Checklist: logo em todos, WCAG AA confirmado, sem overflow, dimensões corretas, variação de layout presente, nenhuma cor ou fonte fora dos tokens.

## Output Format

```html
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
  /* [layout-specific background] */
}
</style>
</head>
<body>
  <!-- Logo -->
  <div style="position:absolute; top:30px; left:30px; z-index:10;">
    <img src="[DATA-URI-LOGO-BRANCO]" style="max-width:200px; display:block;" alt="Innovation Latam" />
  </div>

  <!-- [Conteúdo específico do layout] -->

  <!-- Rodapé (exceto Reflection e CTA layouts) -->
  <div style="position:absolute; bottom:30px; left:54px; right:54px; z-index:10;
              display:flex; justify-content:space-between;
              font-size:24px; font-weight:600; color:rgba(255,255,255,0.5);">
    <span>@innovationlatam</span>
    <span>ARRASTE →</span>
  </div>
</body>
</html>
```

## Output Example

```html
<!-- slide-03.html — Standard Content Layout -->
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
  <!-- Logo Innovation Latam -->
  <div style="padding-top:30px; margin-left:-24px;">
    <img src="data:image/png;base64,[BASE64_DO_LOGO]" style="max-width:200px; display:block;" alt="Innovation Latam" />
  </div>

  <!-- Conteúdo principal -->
  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; padding:40px 0;">
    <h2 style="font-size:52px; font-weight:700; color:#fff; margin:0 0 32px 0; line-height:1.15;">
      Por que as intenções não viram projetos?
    </h2>
    <p style="font-size:40px; font-weight:500; color:#fff; line-height:1.4; margin:0;">
      Porque "programa de IA" foi delegado ao TI.<br><br>
      Mas <span style="color:#c0fefd; font-weight:700;">73%</span> dos casos de uso mais rentáveis de IA surgem do negócio:
      vendas, operações, RH — não do departamento de tecnologia.<br><br>
      <span style="font-size:32px; color:rgba(255,255,255,0.6);">(Harvard Business Review, 2024)</span>
    </p>
  </div>

  <!-- Rodapé -->
  <div style="display:flex; justify-content:space-between; padding-bottom:30px;
              font-size:24px; font-weight:600; color:rgba(255,255,255,0.5);">
    <span>@innovationlatam</span>
    <span>ARRASTE →</span>
  </div>
</body>
</html>
```

```markdown
<!-- design-documentation.md -->
# Design Documentation — [NOME DO CARROSSEL]
**Gerado por:** Dária Design
**Data:** [YYYY-MM-DD]

## Tokens Aplicados
- Fonte: Montserrat (Google Fonts) — pesos 500, 600, 700, 800
- Bg slides 3+: linear-gradient(135deg, #150a1c 0%, #2a1538 100%)
- Destaque teal: #c0fefd
- Destaque gold: #e8c85c
- Logo: data-URI de innovation-latam-logo-white.png

## Sequência de Layouts
| Slide | Variação | Verificação WCAG |
|-------|----------|-----------------|
| 01 | Cover Layout | ✓ ratio [X.X]:1 |
| 02 | Image Context Layout | ✓ ratio [X.X]:1 |
| 03 | Standard Content Layout | ✓ ratio [X.X]:1 |
| 04 | Split Content Layout | ✓ ratio [X.X]:1 |
| 05 | Standard Content Layout | ✓ ratio [X.X]:1 |
| 06 | Split Content Layout | ✓ ratio [X.X]:1 |
| 07 | Reflection Layout | ✓ ratio [X.X]:1 |
| 08 | CTA Layout | ✓ ratio [X.X]:1 |

## Checklist Final
- [x] Logo presente em todos os slides (8/8)
- [x] WCAG AA confirmado em todos os slides (4.5:1 mínimo)
- [x] Sem overflow de texto em nenhum slide
- [x] Dimensões 1080×1440px em todos os HTMLs
- [x] Variação de layout em slides de conteúdo (4 variações distintas usadas)
- [x] Reflection Layout sem rodapé ARRASTE
- [x] CTA Layout sem rodapé ARRASTE, com botão teal
```

## Quality Criteria

- Todos os slides 1080×1440px, HTML auto-suficiente, sem dependências externas além de Google Fonts
- Montserrat como única fonte em todos os HTMLs
- Logo branco via data-URI presente em todos os slides com posição e tamanho corretos
- WCAG AA (4.5:1) calculado e documentado para cada slide em design-documentation.md
- Sem overflow de texto em nenhum slide (verificação visual + código)
- Ao menos 3 variações de layout distintas usadas nos slides de conteúdo

## Veto Conditions

1. Qualquer slide usando fonte diferente de Montserrat — violação inaceitável do sistema post-05
2. Logo ausente em qualquer slide — violação de identidade de marca que ativa REJECT na revisão
3. Texto sobre imagem sem overlay de no mínimo rgba(21,10,28,0.75) — falha WCAG AA garantida
4. Contraste calculado abaixo de 4.5:1 em qualquer elemento de texto — falha WCAG AA
