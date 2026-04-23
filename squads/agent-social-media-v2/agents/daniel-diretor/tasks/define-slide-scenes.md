---
task: define-slide-scenes
agent: daniel-diretor
order: 1
input:
  - squads/agent-social-media-v2/output/carousel-draft.md
  - squads/agent-social-media-v2/pipeline/data/art-direction-photography-guide.md
output:
  - squads/agent-social-media-v2/output/slide-scenes.md
---

## Process

1. Ler o `carousel-draft.md` completo e listar cada slide na ordem (Slide 1 — HOOK, Slide 2 — CONTEXTO, …).

2. Para **cada slide**, extrair headline + body (e Visual cue do Carlos, se existir) e responder: *Que ideia central e que emoção dominam este slide?*

3. Consultar `art-direction-photography-guide.md` e escolher de forma coerente:
   - Camera angle (ex.: Eye Level, Low Angle, High Angle…)
   - Shot size (ex.: WS, MS, CU…)
   - Lente de referência (faixa mm e intenção)
   - Iluminação e atmosfera (ex.: low-key, Rembrandt, golden hour…)
   - Composição (leading lines, depth of field, color grading sugerido)

4. Redigir um **prompt mestre em inglês** (parágrafo único ou dois) seguindo a estrutura em camadas do guia: mídia/estilo → enquadramento/ângulo → equipamento → sujeito/ação → cenário → luz → composição/color grading.

   **Regra específica para o Slide 1 (Cover/Hook):** o prompt do Slide 1 **deve obrigatoriamente** retratar elementos reais e humanos — pessoas concretas em situações reais, ambientes físicos reconhecíveis, luz natural ou de ambiente real. É **proibido** usar metáforas visuais irreais, elementos CGI, cenários fantásticos ou abstrações não-fotográficas. Consultar a seção "Regra obrigatória para o prompt de imagem do Slide 1" em `real-imagery-and-safe-zones.md`.

5. Adicionar **Notas para Dária (HTML):** como traduzir a cena em fundo (gradiente + SVG, imagem full-bleed data-URI, overlay `rgba(21,10,28,0.85)` quando necessário), sempre respeitando safe zone e identidade Innovation Latam.

6. Garantir **variedade** entre slides: não repetir a mesma combinação ângulo+plano em todos; ritmo visual alinhado ao papel do slide (capa impactante, contexto mais denso, desenvolvimento claro, reflexão mais íntima, CTA convidativo).

## Output

Ficheiro `output/slide-scenes.md` com a estrutura definida em `pipeline/steps/step-03-art-direction.md`.

## Quality Criteria

- Número de secções de slide = número de slides no `carousel-draft.md`
- Cada slide tem prompt em inglês + campos técnicos preenchidos
- Referência explícita ao guia de fotografia (vocabulário correto)
- Notas para Dária acionáveis e compatíveis com data-URI / CSS do squad
