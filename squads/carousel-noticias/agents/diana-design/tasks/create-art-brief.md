---
task: "Criar Briefing Visual"
order: 1
input: |
  - carousel_copy: Copy completo aprovado dos slides (de carousel-copy.md)
  - guia_diretor_arte: Vocabulário técnico de câmera, luz e lente
  - doc_posicao_logo: Regras de posicionamento do logo e handle
output: |
  - art_brief: Briefing visual detalhado slide a slide (art-brief.md)
---

# Criar Briefing Visual

Transforma o copy aprovado do carrossel em especificações visuais técnicas para cada slide, seguindo o sistema de alternância ímpar/par da Innovation Latam. Produz prompts de imagem AI prontos para geração e especificações de HTML completas.

## Process

1. **Ler documentos obrigatórios**: ler `_opensquad/_memory/guia_diretor_arte.md` (vocabulário de câmera, luz, lente) e `_opensquad/_memory/doc_posicao_logo_logo_conta.md` (regras de branding). Estes dois documentos são pré-requisito. Não iniciar o briefing sem tê-los lido.

2. **Mapear slides por tipo**: listar todos os slides e classificá-los em ímpares (foto AI) e pares (fundo #993CB1). Slide 1 é ímpar, slide 2 é par, etc.

3. **Para cada slide ímpar**: redigir especificação técnica completa:
   - **Prompt de imagem AI**: descrição em inglês da imagem, começando pelo elemento central, depois contexto e mood. Deve refletir diretamente o conteúdo do slide.
   - **Câmera/Enquadramento**: usar SOMENTE termos do `guia_diretor_arte.md` (ex.: Plano médio, Close-up, Contra-plongée)
   - **Luz**: usar SOMENTE termos do `guia_diretor_arte.md` (ex.: Luz natural / golden hour, High key, Rembrandt)
   - **Lente**: usar SOMENTE termos do `guia_diretor_arte.md` (ex.: 85mm f/1.4, 35mm f/2.8)

4. **Para cada slide par**: especificar:
   - Background: fundo sólido #993CB1
   - Nota de contraste: confirmar que o texto branco será legível (contraste WCAG AA)

5. **Documentar o design system** antes das especificações de slides:
   - Família tipográfica: Montserrat (Google Fonts)
   - Pesos: Bold 700 (somente título do cover), Medium 500 (todos os demais)
   - Tamanhos mínimos: Hero 67px (cover), Heading 48px, Body 34px, Caption 24px
   - Paleta: branco #FFFFFF (texto), roxo #993CB1 (slides pares), gradiente overlay (slides ímpares)
   - Dimensão: 1080×1350px todos os slides
   - Branding: logo branco + @innovationlatam, canto inferior direito, margem 32-48px

6. **Listar assets necessários**: verificar se `innovation-latam-logo-white.png` existe no squad. Se não existir, indicar que precisa ser copiado de outro squad.

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

Assets necessários:
  - innovation-latam-logo-white.png: [caminho verificado ou instrução de cópia]

=== BRIEFING POR SLIDE ===

Slide [N] ([tipo: Cover / Conteúdo / CTA]):
Tipo de Background: [Foto baseada no texto OU Fundo roxo #993CB1]
Prompt de imagem AI (ímpares): "[descrição em inglês da imagem]"
Especificações Técnicas (ímpares):
  Câmera: [termo do guia_diretor_arte]
  Luz: [termo do guia_diretor_arte]
  Lente: [focal + abertura]
Tipografia: [Montserrat Bold 700 para cover / Montserrat Medium 500 para demais]
Check de Branding: [Logo branco Innovation Latam + @innovationlatam, canto inferior direito, margem 40px]

[repetir para cada slide]
```

## Output Example

> Use como referência de qualidade, não como template rígido.

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

Assets necessários:
  - innovation-latam-logo-white.png: squads/carousel-noticias/assets/innovation-latam-logo-white.png

=== BRIEFING POR SLIDE ===

Slide 1 (Cover):
Tipo de Background: Foto baseada no texto
Prompt de imagem AI: "A confident professional in a modern glass office building looking at a large monitor displaying data dashboards and AI analytics, warm natural lighting, sharp focus on the person, blurred city skyline background, corporate innovation atmosphere"
Especificações Técnicas:
  Câmera: Plano médio-close — peito para cima, levemente Contra-plongée para transmitir poder
  Luz: Luz natural / golden hour vindo da janela ao fundo, criando halo de luz
  Lente: 85mm f/1.8 — desfoque suave do fundo
Tipografia: Montserrat Bold 700 para o título da capa
Check de Branding: Logo branco Innovation Latam + @innovationlatam, canto inferior direito, margem 40px

Slide 2 (Contexto):
Tipo de Background: Fundo roxo #993CB1
Tipografia: Montserrat Medium 500 — headline 48px, body 34px
Check de Branding: Logo branco + @innovationlatam, canto inferior direito, margem 40px
Nota: texto branco sobre #993CB1 — contraste WCAG AA verificado (ratio ~5.3:1)

Slide 3 (Argumento 1):
Tipo de Background: Foto baseada no texto
Prompt de imagem AI: "A diverse team of professionals collaborating around a modern meeting table with laptops and tablets, warm office lighting, natural authentic expressions, business casual attire, soft bokeh background"
Especificações Técnicas:
  Câmera: Plano aberto (long shot) — corpo inteiro da equipe, mesa em perspectiva
  Luz: High key — ambiente iluminado, sombras suaves, transmite energia positiva
  Lente: 35mm f/2.8 — levemente grande angular para incluir todos os participantes
Tipografia: Montserrat Medium 500 — headline 48px, body 34px
Check de Branding: Logo branco + @innovationlatam, canto inferior direito, margem 40px
```

## Quality Criteria

- [ ] Design system documentado antes de qualquer especificação de slide
- [ ] Todos os termos de câmera, luz e lente são do `guia_diretor_arte.md` (sem invenção)
- [ ] Slides ímpares têm prompt de imagem AI em inglês + especificações técnicas completas
- [ ] Slides pares têm fundo #993CB1 especificado
- [ ] Branding verificado para cada slide individualmente
- [ ] Assets necessários listados com caminho verificado
- [ ] Template de slide usa exatamente: Tipo de Background, Especificações Técnicas (se ímpar), Tipografia, Check de Branding

## Veto Conditions

Rejeitar e refazer se:
1. Qualquer slide ímpar não tem prompt de imagem AI em inglês
2. Qualquer especificação usa termos de câmera, luz ou lente que não estão no `guia_diretor_arte.md`
