---
step: 10
name: render-slides
type: agent
agent: beatriz-briefing
execution: subagent
inputFile: squads/instagram-carrossel/output/design-brief.md
outputFile: squads/instagram-carrossel/output/slides/
model_tier: powerful
---

## Contexto

**Agente:** Beatriz Briefing — Diretora de Arte
**Tarefa:** render-slides (Tarefa 2 de 2)
**Execução:** Subagent (opera em background com model_tier powerful)

O design brief foi aprovado. Beatriz Briefing gera os arquivos HTML de cada slide (1080×1350px, Montserrat via Google Fonts, identidade visual aprovada), verifica o slide 1 via screenshot e renderiza o batch completo.

---

## Context Loading

Beatriz Briefing deve ler antes de renderizar:

1. `squads/instagram-carrossel/output/design-brief.md` — especificações de cada slide (aprovadas no Passo 9)
2. `squads/instagram-carrossel/output/design-approval.md` — confirmar aprovação antes de prosseguir
3. `squads/instagram-carrossel/pipeline/data/template-reference.html` — modelo base de HTML/CSS
4. `squads/instagram-carrossel/pipeline/data/visual-identity.md` — paleta, tipografia e layout finais

---

## Instructions

### Process

1. **Confirmar aprovação do design** lendo design-approval.md — se não APROVADO, parar e aguardar

2. **Documentar o design system completo** antes de gerar qualquer HTML:
   - Paleta com hex exatos
   - Tipografia: família, pesos (500/700/900) e tamanhos por elemento
   - Layout: viewport, padding, Flexbox config
   - Branding: posição, elementos, path do logo, fallback

3. **Criar diretório** `squads/instagram-carrossel/output/slides/` se não existir

4. **Gerar slide-01.html** seguindo:
   - DOCTYPE HTML5 completo
   - @import Google Fonts (único recurso externo permitido)
   - CSS 100% inline — sem arquivo externo
   - Viewport: `width: 1080px; height: 1350px; overflow: hidden`
   - Layout: `display: flex; flex-direction: column; padding: 72px`
   - Fundo correto: #0d0d14 (ímpar) ou #993CB1 (par) conforme design-brief.md
   - Branding no canto inferior direito com border-top separator
   - Swipe hint (se não for o último slide)

5. **Verificar slide-01 via Playwright:**
   - Iniciar servidor HTTP local na pasta de output/slides/
   - Navegar ao slide-01.html
   - Tirar screenshot e verificar: viewport 1080×1350, branding visível, tipografia correta, sem contador
   - Se houver erro: corrigir o template antes de prosseguir com os demais slides

6. **Gerar slides restantes (slide-02 a slide-NN)** após aprovação visual do slide 1:
   - Manter design system consistente em todos os slides
   - Slides ímpares: fundo #0d0d14 + glow radial roxo
   - Slides pares: fundo #993CB1 + círculos decorativos
   - Swipe hint em todos exceto o último
   - Branding em 100% dos slides

7. **Apresentar resultado ao usuário:**
   - Total de slides gerados
   - Lista de arquivos com caminhos completos
   - Confirmação de que o branding está presente em todos

### Output Format

Cada arquivo gerado em `squads/instagram-carrossel/output/slides/`:
- `slide-01.html`
- `slide-02.html`
- ...
- `slide-NN.html`

**Estrutura HTML obrigatória:**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Slide [N] — [título do carrossel]</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1080px; height: 1350px; overflow: hidden;
      background: [#0d0d14 ou #993CB1];
      color: #fff; font-family: 'Montserrat', sans-serif;
      display: flex; flex-direction: column;
      padding: 72px; position: relative;
    }
    /* ... CSS completo ... */
  </style>
</head>
<body>
  <!-- Elementos decorativos de fundo -->
  <!-- Conteúdo principal (tag, headline, corpo/lista) -->
  <!-- Swipe hint (omitir no último slide) -->
  <!-- Footer/Branding — SEMPRE inferior direito -->
</body>
</html>
```

### Output Example

Após conclusão, apresentar ao usuário:
```
Renderização concluída com sucesso.

Slides gerados: 7
Localização: squads/instagram-carrossel/output/slides/

Arquivos:
- slide-01.html ✓ (verificado via screenshot)
- slide-02.html ✓
- slide-03.html ✓
- slide-04.html ✓
- slide-05.html ✓
- slide-06.html ✓
- slide-07.html ✓ (CTA final, sem swipe hint)

Branding (logo + @innovationlatam): presente em 7/7 slides ✓
Viewport 1080×1350px: confirmado em 7/7 slides ✓
Swipe hint: 6/7 slides (omitido no último, conforme regra) ✓

Próximo passo: Vera Veredito revisará o carrossel completo (Passo 11).
```

### Veto Conditions

- **NUNCA renderizar o batch sem verificar slide-01 via screenshot** — detectar erros de template antes de multiplicar
- **NUNCA usar font-size abaixo de 34px** em nenhum texto de corpo
- **NUNCA incluir contador de slide** ("2/8" ou similar) em nenhum HTML
- **NUNCA usar position absolute** para o layout principal de conteúdo
- **NUNCA incluir dependências externas** além do @import do Google Fonts
- **PARAR se** design-approval.md não existir ou não indicar APROVADO

### Quality Criteria

- Diretório slides/ criado e populado com N arquivos HTML
- slide-01.html verificado via screenshot antes do batch
- 100% dos slides com viewport 1080×1350px e overflow hidden
- @import Google Fonts presente em 100% dos arquivos
- Branding no canto inferior direito de 100% dos slides
- Swipe hint em todos exceto o último; nenhum contador de slide
- Font-size mínimo 34px para corpo; 62px para títulos; 68px+ para capa
