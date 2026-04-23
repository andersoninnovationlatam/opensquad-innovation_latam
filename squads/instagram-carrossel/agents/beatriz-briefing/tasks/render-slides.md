---
task: render-slides
order: 2
agent: beatriz-briefing
input:
  - squads/instagram-carrossel/output/design-brief.md
  - squads/instagram-carrossel/pipeline/data/template-reference.html
  - squads/instagram-carrossel/pipeline/data/visual-identity.md
output: squads/instagram-carrossel/output/slides/
---

## Process

### Passo 1 — Ler e internalizar o design system
Ler `squads/instagram-carrossel/output/design-brief.md` para extrair:
- Especificações de cada slide (tipo, tipografia, branding, sujeito)
- Total de slides a renderizar

Ler `squads/instagram-carrossel/pipeline/data/template-reference.html` como modelo base de HTML e CSS.

Ler `squads/instagram-carrossel/pipeline/data/visual-identity.md` para confirmar especificações finais de:
- Color palette com hex exatos
- Tipografia com família, pesos e tamanhos por elemento
- Layout: viewport 1080×1350px, padding 72px, Flexbox coluna
- Componentes: tag pill, items list, swipe hint, footer

### Passo 2 — Documentar o design system antes de gerar HTMLs
Antes de gerar qualquer HTML, documentar o sistema completo que será aplicado:

```
DESIGN SYSTEM — Carrossel [título]

Viewport: 1080×1350px
Padding: 72px todos os lados
Font-family: Montserrat (Google Fonts @import)
Import URL: https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;900&display=swap

PALETA:
- Fundo dark (slides ímpares): #0d0d14
- Glow roxo: radial-gradient(circle, #993CB133, transparent 70%)
- Fundo roxo (slides pares): #993CB1
- Accent: #50beba
- Texto principal: #ffffff
- Texto suporte: rgba(255,255,255,0.85)
- Overlay itens: rgba(255,255,255,0.15)
- Decorativo: rgba(255,255,255,0.10-0.15)

TIPOGRAFIA:
- Capa (slide 1): Montserrat 700, 68px, line-height 1.15
- Títulos de conteúdo (slides 2+): Montserrat 900, 62-72px, line-height 1.15
- Corpo/suporte: Montserrat 500, 34px, line-height 1.6, rgba(255,255,255,0.85)
- Tags: Montserrat 700, 24px, uppercase, letter-spacing 2px
- Rodapé brand: Montserrat 700, 20px
- Rodapé handle: Montserrat 500, 20px, rgba(255,255,255,0.75)

BRANDING:
- Posição: canto inferior direito, margin-bottom 48px, margin-right 72px (padding)
- Elementos: [img logo] + [INNOVATION LATAM] + [@innovationlatam]
- Logo path: squads/instagram-carrossel/assets/innovation-latam-logo-white.png
- Logo fallback: <div class="footer-logo">IL</div>
- Border-top: 1px solid rgba(255,255,255,0.25)

SWIPE HINT:
- Texto: "Arraste para continuar →"
- Font: Montserrat 500, 24px, rgba(255,255,255,0.60)
- Omitir no último slide (CTA)
```

### Passo 3 — Criar diretório de output
Verificar se `squads/instagram-carrossel/output/slides/` existe. Se não, criar.

### Passo 4 — Gerar slide-01.html e verificar
Gerar o arquivo `squads/instagram-carrossel/output/slides/slide-01.html` seguindo:
- Estrutura HTML5 completa com `<!DOCTYPE html>`
- `@import` do Google Fonts no `<style>` interno
- CSS inline (sem arquivo externo)
- Viewport configurado: `width: 1080px; height: 1350px; overflow: hidden`
- Layout: `display: flex; flex-direction: column; padding: 72px`
- Conteúdo do Slide 1 conforme carousel-content.md
- Branding no canto inferior direito com `margin-top: auto` ou Flexbox
- Para slide ímpar: fundo #0d0d14 + glow radial roxo
- Para slide par: fundo #993CB1 + círculos decorativos

**Após gerar slide-01.html:**
- Iniciar servidor HTTP local na pasta de slides (ex: `python3 -m http.server 8080`)
- Navegar ao slide-01.html via Playwright
- Tirar screenshot para verificação visual
- Confirmar: viewport correto, branding visível, tipografia legível, sem contador de slide
- Se houver problema, corrigir antes de prosseguir

### Passo 5 — Gerar slides restantes (slide-02 a slide-NN)
Após aprovação visual do slide 1, gerar os demais slides em sequência:
- Manter o design system documentado no Passo 2 consistente em todos os slides
- Slides ímpares: fundo #0d0d14 + glow roxo (sem foto real — usar CSS background ou placeholder descritivo como comentário HTML)
- Slides pares: fundo #993CB1 + elementos decorativos (círculos de borda)
- Swipe hint em todos exceto o último
- Branding em 100% dos slides

### Passo 6 — Verificar batch completo e apresentar ao usuário
Após gerar todos os slides:
- Listar todos os arquivos gerados com seus caminhos
- Tirar screenshot de cada slide via Playwright
- Apresentar o resultado ao usuário com:
  - Total de slides gerados
  - Lista de caminhos dos arquivos
  - Confirmação de que o branding está presente em todos

---

## Output Format

Cada slide gerado deve ser um arquivo HTML auto-contido em:
`squads/instagram-carrossel/output/slides/slide-01.html` a `slide-NN.html`

**Estrutura obrigatória de cada HTML:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Slide [N] — [título do carrossel]</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px;
      height: 1350px;
      overflow: hidden;
      background: [#0d0d14 ou #993CB1];
      color: #fff;
      font-family: 'Montserrat', sans-serif;
      display: flex;
      flex-direction: column;
      padding: 72px;
      position: relative;
    }
    /* ... CSS completo ... */
  </style>
</head>
<body>
  <!-- Elementos decorativos de fundo (circles, glow) -->
  <!-- Conteúdo principal -->
  <!-- Swipe hint (omitir no último slide) -->
  <!-- Footer/Branding — SEMPRE inferior direito -->
</body>
</html>
```

---

## Output Example

**slide-01.html (slide ímpar — fundo escuro):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Slide 1 — 7 mitos sobre IA</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px; height: 1350px; overflow: hidden;
      background: #0d0d14;
      color: #fff;
      font-family: 'Montserrat', sans-serif;
      display: flex; flex-direction: column;
      padding: 72px; position: relative;
    }
    .bg-glow {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 800px; height: 800px; border-radius: 50%;
      background: radial-gradient(circle, #993CB133, transparent 70%);
      pointer-events: none;
    }
    .category-bar {
      display: flex; align-items: center; gap: 16px;
      margin-bottom: 48px; flex-shrink: 0;
    }
    .category-line { width: 4px; height: 40px; background: #993CB1; border-radius: 2px; }
    .category-label {
      font-size: 24px; font-weight: 700; color: #993CB1;
      text-transform: uppercase; letter-spacing: 2px;
    }
    h1 {
      font-size: 68px; font-weight: 700; line-height: 1.15;
      margin-bottom: 32px; flex-shrink: 0;
    }
    .body-text {
      font-size: 34px; font-weight: 500;
      color: rgba(255,255,255,0.85); line-height: 1.6;
      flex: 1;
    }
    .swipe-hint {
      text-align: center; margin: 32px 0 24px; flex-shrink: 0;
      font-size: 24px; font-weight: 500; color: rgba(255,255,255,0.60);
    }
    .footer {
      display: flex; align-items: center; justify-content: flex-end; gap: 16px;
      padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.25); flex-shrink: 0;
    }
    .footer-text { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .footer-brand { font-size: 20px; font-weight: 700; letter-spacing: 1px; }
    .footer-handle { font-size: 20px; font-weight: 500; color: rgba(255,255,255,0.75); }
    .footer-logo {
      width: 48px; height: 48px; border-radius: 10px;
      background: rgba(255,255,255,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 900;
    }
  </style>
</head>
<body>
  <div class="bg-glow"></div>
  <div class="category-bar">
    <div class="category-line"></div>
    <span class="category-label">Inovação Corporativa</span>
  </div>
  <h1>7 mitos sobre IA que estão <span style="color:#50beba">travando</span> sua empresa</h1>
  <p class="body-text">O Gartner confirmou: 70% das Fortune 500 já usam IA generativa. Se a sua não usa, o problema provavelmente não é a tecnologia.</p>
  <div class="swipe-hint">Arraste para continuar →</div>
  <footer class="footer">
    <div class="footer-text">
      <span class="footer-brand">INNOVATION LATAM</span>
      <span class="footer-handle">@innovationlatam</span>
    </div>
    <div class="footer-logo">IL</div>
  </footer>
</body>
</html>
```

---

## Quality Criteria

1. Diretório `squads/instagram-carrossel/output/slides/` criado e populado
2. Arquivo `slide-01.html` verificado via screenshot antes de renderizar os demais
3. Todos os slides com `width: 1080px; height: 1350px; overflow: hidden`
4. `@import` do Google Fonts presente em 100% dos arquivos HTML
5. Branding (logo + handle) no canto inferior direito de todos os slides
6. Swipe hint presente em todos os slides exceto o último
7. Nenhum contador de slide em nenhum HTML
8. Font-size mínimo 34px para corpo; 62px para títulos de conteúdo; 68px+ para capa
9. Slides ímpares com fundo #0d0d14; slides pares com fundo #993CB1
10. CSS 100% inline — sem arquivo CSS externo; sem CDN de ícones

---

## Veto Conditions

- **NUNCA renderizar o batch sem verificar slide-01 via screenshot** — detectar erros de template antes de multiplicá-los
- **NUNCA usar font-size abaixo de 34px** para qualquer texto de corpo
- **NUNCA incluir contador de slide** ("2/8" ou similar) em nenhum HTML
- **NUNCA usar position absolute** para o layout principal — apenas para elementos decorativos
- **NUNCA incluir dependências externas** além do @import do Google Fonts
- **PARAR se** design-brief.md não existir ou não houver aprovação registrada no checkpoint anterior
