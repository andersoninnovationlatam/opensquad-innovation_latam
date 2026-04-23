---
execution: inline
agent: daria-design
inputFile: squads/agent-social-media-v2/output/slide-scenes.md
outputFile: squads/agent-social-media-v2/output/slides/
---

## Context Loading

Antes de executar, carregar:
- `squads/agent-social-media-v2/output/carousel-draft.md` — copy exato (headline, body, Visual cues); texto **curto por slide** (regra do Carlos)
- `squads/agent-social-media-v2/output/slide-scenes.md` — direção de arte por slide — **briefing visual prioritário**
- `squads/agent-social-media-v2/pipeline/data/real-imagery-and-safe-zones.md` — **norma atual**: 1080×1350; **fundo fotográfico obrigatório** por slide (`generate-bg-image.mjs` + `inject-bg-and-render.mjs`), não só CSS; texto editorial **à esquerda** em todos os slides; **rodapé** `@innovationlatam` + `ARRASTE ->` em todos; safe zone **y ≥ 1150px**; logo **`top: 30px; left: 100px`**
- `squads/agent-social-media-v2/pipeline/data/layout-variations.md` — referência de variações (alinhamento à esquerda + rodapé conforme norma acima)
- `squads/agent-social-media-v2/pipeline/data/visual-identity.md` — padrão post-05 (tokens)
- `squads/agent-social-media-v2/pipeline/data/anti-patterns.md` — o que nunca fazer no design
- `squads/agent-social-media-v2/agents/daria-design/tasks/design-slides.md` — task file

## Instructions

### Execução obrigatória — fundos fotográficos (extremamente importante)

Depois de existirem os HTML em `output/{run_id}/slides/v1/`, o Pipeline Runner **deve executar** na **raiz do repositório** (substituir `{run_id}` pelo ID real da run):

- **Opção recomendada:** `node squads/agent-social-media-v2/scripts/run-squad-design.mjs {run_id}`
- **Ou, por slide** (`NN` = `01` … `06`):  
  `node squads/agent-social-media-v2/scripts/generate-bg-image.mjs NN squads/agent-social-media-v2/output/{run_id}/slides`  
  `node squads/agent-social-media-v2/scripts/inject-bg-and-render.mjs NN squads/agent-social-media-v2/output/{run_id}/slides`

**Conclusão do step só é válida** se existirem `slides/backgrounds/bg-01.*` … `bg-06.*` **e** `slides/v1/rendered/slide-01.jpg` … `slide-06.jpg`. Gradient CSS sozinho **não** substitui este passo.

### Process

1. **Precedência:** `real-imagery-and-safe-zones.md` define **geometria, alinhamento e pipeline de fundo**. `visual-identity.md` define **tokens**. Em conflito com texto genérico antigo (“só CSS”, “rodapé no slide”), **prevalece a norma atual**.

2. **Ler `slide-scenes.md` e alinhar cada slide:** usar **Notas para Dária** e o **prompt mestre (EN)** como guia de atmosfera e fundo; o texto editorial vem sempre do `carousel-draft.md`. Se houver tensão entre cena e Visual cue do Carlos, **preservar marca e safe zone** e harmonizar (documentar em `design-documentation.md`).

3. **Converter logo a data-URI.** `squads/tech-instagram-carousel/assets/innovation-latam-logo-white.png` → base64 em todos os slides. Posição fixa: **`top: 30px; left: 100px`**, max-width **200px**.

4. **Planejar a sequência de layouts** para todos os slides com base nos papéis do draft, nos visual cues e nas **cenas** do Daniel Diretor, sempre segundo `layout-variations.md` (Cover / Image Context / Standard / Split / Reflection / CTA).

5. **Fundos:** para runs automatizados, usar `gen-slides-for-run.mjs` + `generate-bg-image.mjs` + `inject-bg-and-render.mjs` (ou `run-squad-design.mjs`). Cada slide recebe **foto IA** em `slides/backgrounds/` e injeção no HTML — **não** substituir por gradiente CSS sozinho.

6. **Criar `design-documentation.md`** em `output/slides/`: tokens, sequência de layouts, slide ↔ trecho de `slide-scenes.md`, tabela de backgrounds, checklist WCAG AA.

7. **Criar slide-01.html (Cover Layout).** Banda **60%–80%** (`top: 810px`, `height: 270px`), hook **alinhado à esquerda** na banda; overlay sobre fundo (após inject: foto real); destaque numérico **gold #e8c85c**; tipografia conforme `visual-identity.md` / norma §0.

8. **Verificar slide 1** antes dos demais: logo, WCAG AA, sem overflow, **1080×1350px**.

9. **Criar slide-02.html (Image Context).** Fundo distinto do slide 1; overlay **rgba(21,10,28,0.85)** (ou 0.75–0.95 conforme contraste); headline + body **à esquerda** (norma todos os slides); tipografia mínima: body **36px** (norma §0).

10. **Criar slides de desenvolvimento (3 e 4).** Alternar Standard / Split; texto **à esquerda** (slides 2–6), **padding 100px**, body **38–40px**; fundos fotográficos **distintos** (IA). WCAG AA por slide. Depois reflexão (5) e CTA (6).

11. **Slide de reflexão (penúltimo).** Reflection Layout; texto **à esquerda**; com rodapé @ + ARRASTE ->.

12. **Slide de CTA (último).** Botão teal **#50beba**; blocos **à esquerda**; com rodapé @ + ARRASTE ->.

13. **Checklist final:** `real-imagery-and-safe-zones.md` §4; logo em todos; texto editorial à esquerda; rodapé `@innovationlatam` + `ARRASTE ->` em todos; sem overflow; **1080×1350px**; variação de layout.

## Output Format

```html
<!-- slide-NN.html — HTML auto-suficiente; Montserrat @import; body 1080×1350 -->
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 1080px;
  height: 1350px;
  overflow: hidden;
  font-family: 'Montserrat', sans-serif;
}
</style>
</head>
<body>
  <div style="position:absolute; top:30px; left:100px; z-index:10;">
    <img src="data:image/png;base64,[BASE64_LOGO]"
         style="max-width:200px; display:block;" alt="Innovation Latam" />
  </div>
  <!-- Conteúdo: texto à esquerda; padding 0 100px; rodapé @innovationlatam + ARRASTE -> -->
</body>
</html>
```

```markdown
<!-- design-documentation.md -->
# Design Documentation
**Carrossel:** [título]
**Data:** [YYYY-MM-DD]

## Norma aplicada
- real-imagery-and-safe-zones.md (v3) + layout-variations.md

## Tokens
- Fonte: Montserrat — [pesos]
- Overlay: rgba(21,10,28,0.XX)

## Sequência de layouts
| Slide | Variação | WCAG |
|-------|----------|------|
| 01 | Cover | ✓ |
| ... | ... | ... |

## Checklist
- [ ] Logo top:30px left:100px em todos
- [ ] Texto editorial à esquerda; rodapé @ + ARRASTE -> em todos os slides
- [ ] Safe zone y < 1150px para texto editorial
- [ ] Backgrounds únicos (sem gradiente repetido genérico)
```

## Veto Conditions

1. Qualquer slide usando fonte diferente de Montserrat — violação do sistema post-05
2. Logo ausente ou fora de **`top: 30px; left: 100px`** (sem documentação)
3. Texto sobre imagem sem overlay mínimo **rgba(21,10,28,0.75)**
4. Contraste abaixo de 4.5:1 em qualquer elemento de texto
5. **Alinhamento errado:** editorial **não** à esquerda, ou **ausência** do rodapé @ / ARRASTE ->
6. `body` com dimensões diferentes de **1080×1350px**

## Quality Criteria

- Todos os slides **1080×1350px**, HTML auto-suficiente, sem JS, sem CDN além de Google Fonts
- Logo branco via data-URI em todos os slides, **`top: 30px; left: 100px`**
- **Norma atual:** texto editorial **à esquerda**; rodapé **@innovationlatam** + **ARRASTE ->**; padding **100px**; safe zone **y ≥ 1150px** respeitada
- WCAG AA (4.5:1) calculado e documentado para cada slide em `design-documentation.md`
- Sem overflow de texto em nenhum slide
- Ao menos 3 variações de layout distintas nos slides de conteúdo
- Fundos visualmente distintos entre slides (não repetir o mesmo gradiente padrão em todos)
