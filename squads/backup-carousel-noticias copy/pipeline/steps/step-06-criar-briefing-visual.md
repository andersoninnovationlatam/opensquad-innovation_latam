---
execution: inline
agent: diana-design
inputFile: squads/carousel-noticias/output/carousel-copy.md
outputFile: squads/carousel-noticias/output/art-brief.md
---

# Step 06: Criar Briefing Visual

## Context Loading

Load these files before executing:
- `squads/carousel-noticias/output/carousel-copy.md` — copy aprovado dos slides
- `_opensquad/_memory/guia_diretor_arte.md` — vocabulário técnico obrigatório (câmera, luz, lente)
- `_opensquad/_memory/doc_posicao_logo_logo_conta.md` — regras de posicionamento de branding
- `_opensquad/_memory/company.md` — identidade visual da Innovation Latam (cores, logo, handle)

## Instructions

### Process
1. Ler os dois documentos de memória obrigatórios (`guia_diretor_arte.md` e `doc_posicao_logo_logo_conta.md`) antes de iniciar.
2. Documentar o design system completo: dimensão 1080×1350px, Montserrat, paleta, overlay, branding.
3. Mapear os slides por tipo: ímpares (foto AI) vs. pares (fundo #993CB1).
4. Para cada slide ímpar: criar prompt de imagem AI em inglês inspirado no texto do slide + especificações técnicas com câmera/luz/lente do vocabulário do guia.
5. Para cada slide par: especificar fundo #993CB1 e confirmar contraste com texto branco.
6. Verificar asset do logo: o arquivo `innovation-latam-logo-white.png` precisa estar em `squads/carousel-noticias/assets/`. Se não existir, indicar que deve ser copiado de outro squad.
7. Entregar briefing formatado slide a slide.

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
Prompt de imagem AI (se ímpar): "[descrição em inglês]"
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
Tipo de Background: Foto baseada no texto
Prompt de imagem AI: "Aerial view of São Paulo financial district at golden hour, modern glass skyscrapers reflecting sunset light, dramatic sky with warm orange tones, professional urban photography, clean composition"
Especificações Técnicas:
  Câmera: Plano aberto (long shot) — cityscape aéreo, perspectiva Plongée suave
  Luz: Luz natural / golden hour — iluminação quente, sombras longas na horizontal
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

- [ ] Design system documentado antes dos slides
- [ ] Todos os termos técnicos do guia_diretor_arte (sem invenção)
- [ ] Branding verificado slide a slide
- [ ] Caminho do logo verificado e indicado
- [ ] Output salvo em `art-brief.md`
