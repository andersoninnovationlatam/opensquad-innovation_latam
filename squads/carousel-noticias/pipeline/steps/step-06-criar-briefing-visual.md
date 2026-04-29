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
2. **Listar imagens do Bruno**: `ls squads/carousel-noticias/output/images/slide-*-ref.*` para identificar quais slides ímpares (1, 3, 5, 7) já possuem imagem de referência.
3. **Ler `image-refs.json`**: para cada entidade, tomar nota da `visual_description`, `brand_colors` e `parody_notes`. Esses dados são usados **apenas no fallback AI** (slides sem referência do Bruno).
4. Documentar o design system completo: dimensão 1080×1350px, Montserrat, paleta, overlay, branding.
5. Mapear os slides por tipo:
   - **Ímpares com referência do Bruno** → estratégia `reference`: anotar entidade + arquivo `slide-0N-ref.*`. **Nenhum prompt AI necessário** — a imagem já está em disco.
   - **Ímpares sem referência** → estratégia `ai-generated`: gerar prompt de paródia editorial conforme regras de Fotojornalismo Digital.
   - **Pares** → fundo #993CB1, texto branco.
6. **Para cada slide ímpar com `ai-generated`**: criar prompt de imagem AI em inglês que:
   - Use entidade do `image-refs.json` em paródia editorial (logo/cores/símbolo) quando aplicável
   - Adicione especificações técnicas com câmera/luz/lente do vocabulário do guia
   - Se não houver entidade relevante, usar abordagem temática dos `themes`
   - O runner passará automaticamente todas as imagens `slide-0N-ref.*` do Bruno como referências visuais multimodais para o modelo de imagem. O prompt deve descrever o CONCEITO visual desejado — não precisa redescrever o que já está nas referências. O modelo usará as referências como inspiração, não como cópia.
7. Para cada slide par: especificar fundo #993CB1 e confirmar contraste com texto branco.
8. Verificar asset do logo: `innovation-latam-logo-white.png` em `squads/carousel-noticias/assets/`.
9. Entregar briefing formatado slide a slide, com a estratégia (`reference` ou `ai-generated`) explícita em cada ímpar.

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
Estratégia de Background (se ímpar): reference (Bruno: <entidade>, arquivo slide-0N-ref.<ext>) | ai-generated
Tipo de Background: [Foto referência do Bruno OU Foto AI baseada no texto OU Fundo roxo #993CB1]
Prompt de imagem AI (apenas se ai-generated): "[descrição do CONCEITO visual em inglês — paródia editorial + contexto da notícia + estilo jornalístico + tom emocional + composição desejada. As referências visuais do Bruno serão enviadas automaticamente ao modelo como inspiração multimodal.]"
Especificações Técnicas (apenas se ai-generated):
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
1. Slide ímpar marcado como `ai-generated` sem prompt de imagem AI em inglês
2. Slide ímpar com `slide-0N-ref.*` existente marcado como `ai-generated` (deveria ser `reference`)
3. Qualquer especificação usa termos de câmera/luz/lente fora do `guia_diretor_arte.md`

## Quality Criteria

- [ ] Listagem de imagens em `output/images/` consultada antes de definir estratégia de cada ímpar
- [ ] Slides ímpares com `slide-0N-ref.*` marcados como `reference` (sem prompt AI)
- [ ] Slides ímpares sem referência: prompt em inglês com paródia editorial usando `image-refs.json` ou abordagem temática
- [ ] Design system documentado antes dos slides
- [ ] Todos os termos técnicos do guia_diretor_arte (sem invenção)
- [ ] Branding verificado slide a slide
- [ ] Caminho do logo verificado e indicado
- [ ] Output salvo em `art-brief.md`
