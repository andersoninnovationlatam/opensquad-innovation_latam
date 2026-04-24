---
execution: inline
agent: diana-design
inputFile: squads/carousel-noticias/output/carousel-copy.md
outputFile: squads/carousel-noticias/output/art-brief.md
---

# Step 07: Criar Briefing Visual

## Context Loading

Load these files before executing:
- `squads/carousel-noticias/output/carousel-copy.md` — copy aprovado dos slides
- `squads/carousel-noticias/output/image-refs.json` — referências visuais de marcas e empresas coletadas pelo Bruno Buscador (Step 6). Usar para criar prompts de paródia editorial nos slides ímpares.
- `_opensquad/_memory/guia_diretor_arte.md` — vocabulário técnico obrigatório (câmera, luz, lente)
- `_opensquad/_memory/doc_posicao_logo_logo_conta.md` — regras de posicionamento de branding
- `_opensquad/_memory/company.md` — identidade visual da Innovation Latam (cores, logo, handle)

## Instructions

### Process
1. Ler os documentos de memória obrigatórios (`guia_diretor_arte.md` e `doc_posicao_logo_logo_conta.md`) antes de iniciar.
2. **Ler `image-refs.json`**: verificar quais marcas, empresas e figuras foram pesquisadas pelo Bruno. Para cada entidade, tomar nota da `visual_description`, `brand_colors` e `parody_notes` — esses elementos guiarão os prompts dos slides ímpares.
3. Documentar o design system completo: dimensão 1080×1350px, Montserrat, paleta, overlay, branding.
4. Mapear os slides por tipo: ímpares (foto AI com paródia) vs. pares (fundo #993CB1).
5. **Para cada slide ímpar**: criar prompt de imagem AI em inglês que:
   - Identifique qual entidade do `image-refs.json` é mais relevante para o texto do slide
   - Incorpore os elementos visuais reconhecíveis dessa entidade (cores, logo, símbolo) em uma **paródia editorial** — a imagem deve remeter à marca real de forma criativa e humorística
   - Adicione especificações técnicas com câmera/luz/lente do vocabulário do guia
   - Se não houver entidade relevante para o slide, usar abordagem temática baseada nos `themes` do `image-refs.json`
6. Para cada slide par: especificar fundo #993CB1 e confirmar contraste com texto branco.
7. Verificar asset do logo: o arquivo `innovation-latam-logo-white.png` precisa estar em `squads/carousel-noticias/assets/`.
8. Entregar briefing formatado slide a slide.

### Diretrizes de Paródia Editorial (quando image-refs.json contém dados)

- **Paródia de logo de empresa**: representar o logo/símbolo da empresa em contexto irônico relacionado à notícia. Ex: logo do Nubank sendo "espremido" por pinça de taxas de juros.
- **Paródia de figura pública**: mostrar a pessoa em cenário que reforce a notícia (mesa de negociação, palanque, sala de servidor).
- **Paródia temática**: quando a notícia envolve conceito (juros, IA, energia), personificar o tema usando os elementos visuais das marcas que o cercam.
- **Sempre manter estilo jornalístico**: "Premium editorial illustration", "Realistic 3D render", "News magazine cover style" — nunca cartoon infantil.
- **Incluir as brand_colors da entidade** no prompt para garantir reconhecibilidade.

## Output Format

```
=== DESIGN SYSTEM ===
Viewport: 1080×1350px
Fonte: Montserrat (Google Fonts @import)
  Hero (cover): 67px / Bold 700
  Heading: 48px / Bold 700
  Body: 34px / Medium 500
  Caption: 24px / Medium 500
Paleta:
  Texto: #FFFFFF
  Fundo pares: #993CB1
  Overlay (ímpares): linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)
Branding: logo branco + @innovationlatam | canto inferior direito | margem 32-48px

Assets:
  - innovation-latam-logo-white.png: [caminho verificado ou instrução]

=== BRIEFING POR SLIDE ===

Slide [N] ([tipo]):
Tipo de Background: [Foto baseada no texto OU Fundo roxo #993CB1]
Referência de paródia (se ímpar + image-refs disponível): [entidade usada + parody_notes]
Prompt de imagem AI (se ímpar): "[descrição em inglês — inclui elementos visuais reconhecíveis da marca + contexto da notícia + estilo jornalístico]"
Especificações Técnicas (se ímpar):
  Câmera: [termo do guia]
  Luz: [termo do guia]
  Lente: [focal + abertura]
Tipografia: [Montserrat Bold 700 cover / Medium 500 demais]
Check de Branding: [Logo branco + @innovationlatam, canto inferior direito, margem 40px]
```

## Output Example

```
=== DESIGN SYSTEM ===
Viewport: 1080×1350px
Fonte: Montserrat (Google Fonts @import)
  Hero (cover): 67px / Bold 700
  Heading: 48px / Bold 700
  Body: 34px / Medium 500
  Caption: 24px / Medium 500
Paleta:
  Texto: #FFFFFF
  Fundo pares: #993CB1
  Overlay (ímpares): linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)
Branding: logo branco + @innovationlatam | canto inferior direito | margem 40px

Assets:
  - innovation-latam-logo-white.png: squads/carousel-noticias/assets/innovation-latam-logo-white.png

=== BRIEFING POR SLIDE ===

Slide 1 (Cover):
Tipo de Background: Foto baseada no texto com paródia de marca
Referência de paródia: Banco Central do Brasil — escudo verde #00A859, símbolo institucional, prédio governamental
Prompt de imagem AI: "Premium editorial illustration: giant green shield with 'BCB' letters (Banco Central do Brasil style, color #00A859) centered in a dramatic financial district skyline, bold percentage sign '14.75%' glowing in gold overlaid on the shield, cinematic lighting, news magazine cover aesthetic, ultra realistic 3D render, 8k, clean composition, no text watermarks"
Especificações Técnicas:
  Câmera: Plano aberto (long shot) — cityscape aéreo, perspectiva Plongée suave
  Luz: Luz dramática / hard light — iluminação contrastada, sombras profundas
  Lente: Grande angular 24mm — perspectiva ampla, sem distorção excessiva
Tipografia: Montserrat Bold 700 — título da capa
Check de Branding: Logo branco Innovation Latam + @innovationlatam, canto inferior direito, margem 40px

Slide 2 (Contexto):
Tipo de Background: Fundo roxo #993CB1
Tipografia: Montserrat Medium 500 — heading 48px, body 34px
Check de Branding: Logo branco + @innovationlatam, canto inferior direito, margem 40px
Nota: texto branco sobre #993CB1 — contraste 5.3:1, acima do mínimo WCAG AA
```

## Veto Conditions

Rejeitar e redo se:
1. Qualquer slide ímpar sem prompt de imagem AI em inglês
2. Qualquer especificação usa termos de câmera/luz/lente fora do `guia_diretor_arte.md`

## Quality Criteria

- [ ] `image-refs.json` carregado e consultado antes de criar prompts dos slides ímpares
- [ ] Slides ímpares com entidade relevante em image-refs: prompt inclui elementos visuais da marca (cores, logo, símbolo) em contexto de paródia editorial
- [ ] Slides ímpares sem entidade relevante: prompt usa abordagem temática dos `themes`
- [ ] Design system documentado antes dos slides
- [ ] Todos os termos técnicos do guia_diretor_arte (sem invenção)
- [ ] Branding verificado slide a slide
- [ ] Caminho do logo verificado e indicado
- [ ] Output salvo em `art-brief.md`
