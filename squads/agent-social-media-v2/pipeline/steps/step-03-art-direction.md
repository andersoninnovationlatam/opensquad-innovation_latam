---
execution: inline
agent: daniel-diretor
inputFile: squads/agent-social-media-v2/output/carousel-draft.md
outputFile: squads/agent-social-media-v2/output/slide-scenes.md
---

## Context Loading

Antes de executar, carregar:
- `squads/agent-social-media-v2/output/carousel-draft.md` — copy e Visual cues de todos os slides
- `squads/agent-social-media-v2/pipeline/data/art-direction-photography-guide.md` — componentes técnicos, estrutura de prompt, exemplos
- `squads/agent-social-media-v2/pipeline/data/real-imagery-and-safe-zones.md` — compliance, data-URI, safe zones (o diretor não gera HTML; alinha brief com as normas)
- `squads/agent-social-media-v2/agents/daniel-diretor/tasks/define-slide-scenes.md` — task detalhado

## Instructions

### Process

1. **Mapear todos os slides** na ordem do draft (incluindo caption apenas como contexto opcional, não como slide).

2. **Por slide:** interpretar o texto (headline, body, papel editorial: hook, contexto, desenvolvimento, reflexão, CTA).

3. **Definir direção de arte** usando o vocabulário do guia: ângulo de câmera, plano/enquadramento, lente de referência, iluminação, composição, color grading sugerido.

4. **Escrever o prompt mestre em inglês** (pronto para IA ou briefing de produção), em camadas completas.

5. **Escrever notas para Dária:** como a cena vira fundo visual (full-bleed vs gradiente/SVG), densidade, temperatura de cor alinhada à paleta roxo/teal/post-05.

6. **Não duplicar** o copy do Carlos no lugar da cena — a secção "Mensagem (síntese)" deve ter no máximo 1–2 frases de interpretação.

## Output Format

```markdown
# Direção de arte — [TÍTULO DO CARROSSEL]
**Carrossel:** [mesmo título do carousel-draft]
**Gerado por:** Daniel Diretor
**Data:** [YYYY-MM-DD]

---

## Slide 01 — [PAPEL: ex. HOOK / Cover]
### Mensagem (síntese)
[1–2 frases: o que o slide comunica]

### Interpretação narrativa
[Tom emocional + metáfora espacial: ex. urgência, abertura, confronto de ideias]

### Parâmetros técnicos
| Campo | Escolha |
|-------|---------|
| Camera angle | [ex.: Low Angle] |
| Shot size | [ex.: Medium Close-Up] |
| Lens reference | [ex.: 85mm, shallow DOF] |
| Lighting | [ex.: Rembrandt, low-key] |
| Color mood | [ex.: teal and orange, desaturated] |

### Prompt mestre (EN)
> [Parágrafo único em inglês, estilo exemplo do guia — cinematic editorial photography, …]

### Notas para Dária (implementação HTML)
- Fundo: [full-bleed fotográfico abstrato / gradiente + formas / …]
- Overlay: [se aplicável, rgba(21,10,28,0.85) ou variação]
- Evitar: texto na imagem; respeitar safe zone y ≥ 1150px para texto editorial

---

## Slide 02 — [PAPEL: ex. CONTEXTO / Image Context]
[mesma estrutura]

---

[Repetir para todos os slides até o último — CTA incluído]

---

## Checklist
- [ ] Número de slides = número de secções "## Slide NN"
- [ ] Cada slide tem prompt EN + notas Dária
- [ ] Variedade de ângulos/planos ao longo do carrossel
```

## Veto Conditions

1. `slide-scenes.md` sem secção para algum slide presente no `carousel-draft.md`
2. Prompts mestres genéricos iguais em todos os slides (falta de interpretação por slide)

## Quality Criteria

- Vocabulário alinhado ao `art-direction-photography-guide.md`
- Cenas interpretam o significado do texto, não apenas repetem palavras-chave
- Inglês fluente nos prompts mestres
