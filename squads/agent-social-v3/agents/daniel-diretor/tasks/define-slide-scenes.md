---
task: define-slide-scenes
agent: daniel-diretor
order: 1
input:
  - squads/agent-social-v3/output/carousel-draft.md
  - squads/agent-social-v3/pipeline/data/art-direction-photography-guide.md
output:
  - squads/agent-social-v3/output/slide-scenes.md
---
## Regras Críticas de Diversidade Visual (GUARDRAILS)

Você DEVE garantir que o carrossel tenha ritmo visual e não seja repetitivo. Para isso, siga estas regras inegociáveis:

1. **Matriz de Diversidade Visual:** É estritamente PROIBIDO usar o mesmo arquétipo visual em mais de 2 slides.
2. **Regra do Slide 5 (Reflexão):** O slide de reflexão DEVE ser intimista e humano.
3. **Regra do Slide 6 (CTA):** O slide de CTA deve sugerir preparação. Se usar tecnologia, que seja secundária e não o foco principal.
4. **Regra de Integração de Marcas (Logos):** Sempre que o texto do slide mencionar uma empresa específica (ex: Google, Microsoft, AWS, Anthropic, etc.), o prompt da imagem DEVE solicitar a inclusão do logotipo dessa empresa de forma orgânica e contextualizada no ambiente. O logo não deve flutuar artificialmente; ele deve aparecer de forma realista (ex: gravado em um servidor, em um crachá, em uma caneca, em uma parede de escritório, ou em uma tela secundária). Se o texto citar múltiplas marcas, escolha a principal para o contexto visual.

## Process

1. Ler o `carousel-draft.md` completo e listar cada slide na ordem (Slide 1 — HOOK, Slide 2 — CONTEXTO, …).

2. **Detectar empresa(s) protagonista(s):** identificar qual empresa ou produto tecnológico é o foco central da notícia (ex: "OpenAI lança GPT-5", "Google corta empregos"). Consultar `pipeline/data/brand-reference.md` e anotar:
   - Nome da empresa detectada
   - Brand elements visuais a usar (cores, produto visual, estética, elemento de prompt recomendado)
   - Se nenhuma empresa for protagonista clara, usar o visual padrão IL sem brand element

3. Para **cada slide**, extrair headline + body (e Visual cue do Carlos, se existir) e responder: *Que ideia central e que emoção dominam este slide?*

4. Consultar `art-direction-photography-guide.md` e escolher de forma coerente:
   - Camera angle (ex.: Eye Level, Low Angle, High Angle…)
   - Shot size (ex.: WS, MS, CU…)
   - Lente de referência (faixa mm e intenção)
   - Iluminação e atmosfera (ex.: low-key, Rembrandt, golden hour…)
   - Composição (leading lines, depth of field, color grading sugerido)

5. Redigir um **prompt mestre em inglês** (parágrafo único ou dois) seguindo a estrutura em camadas do guia: mídia/estilo → enquadramento/ângulo → equipamento → sujeito/ação → cenário → luz → composição/color grading.

   **Integração de marca:** nos slides prioritários (1, 2 e o mais temático), incorporar o `elemento de prompt` da empresa detectada no `brand-reference.md` como parte natural da cena — em monitores/telas ao fundo, no ambiente, nos objetos de cena ou no color grading. A paleta purple/teal da IL permanece como base; brand colors entram como accent.


6. Adicionar **Notas para Dária (HTML):** como traduzir a cena em fundo (gradiente + SVG, imagem full-bleed data-URI, overlay `rgba(21,10,28,0.85)` quando necessário), sempre respeitando safe zone e identidade Innovation Latam. Indicar empresa detectada e brand elements aplicados.

7. Garantir **variedade** entre slides: não repetir a mesma combinação ângulo+plano em todos; ritmo visual alinhado ao papel do slide (capa impactante, contexto mais denso, desenvolvimento claro, reflexão mais íntima, CTA convidativo).

## Output

Ficheiro `output/slide-scenes.md` com a estrutura definida em `pipeline/steps/step-03-art-direction.md`.

## Quality Criteria

- Número de secções de slide = número de slides no `carousel-draft.md`
- Cada slide tem prompt em inglês + campos técnicos preenchidos
- Referência explícita ao guia de fotografia (vocabulário correto)
- Notas para Dária acionáveis e compatíveis com data-URI / CSS do squad
