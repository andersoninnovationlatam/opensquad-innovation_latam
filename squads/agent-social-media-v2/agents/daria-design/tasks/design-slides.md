---
task: design-slides
agent: daria-design
order: 1
input:
  - squads/agent-social-media-v2/output/carousel-draft.md
  - squads/agent-social-media-v2/output/slide-scenes.md
  - squads/agent-social-media-v2/pipeline/data/visual-identity.md
  - squads/agent-social-media-v2/pipeline/data/real-imagery-and-safe-zones.md
  - squads/agent-social-media-v2/pipeline/data/layout-variations.md
output:
  - squads/agent-social-media-v2/output/slides/slide-01.html
  - squads/agent-social-media-v2/output/slides/slide-02.html
  - squads/agent-social-media-v2/output/slides/slide-NN.html
  - squads/agent-social-media-v2/output/slides/design-documentation.md
---

## Execução obrigatória após os HTMLs (extremamente importante)

Quando os ficheiros `slide-01.html` … `slide-06.html` existirem em `output/{run_id}/slides/v1/`, o passo **não está terminado** até o Pipeline Runner **executar** na raiz do repo **um** dos seguintes:

1. **Orquestrador (recomendado):**  
   `node squads/agent-social-media-v2/scripts/run-squad-design.mjs {run_id}`  
   (substituir `{run_id}` pelo nome da pasta em `output/`, ex.: `2026-04-08-112052`.)

2. **Ou, para cada slide `01`–`06`:**  
   `node squads/agent-social-media-v2/scripts/generate-bg-image.mjs NN squads/agent-social-media-v2/output/{run_id}/slides`  
   `node squads/agent-social-media-v2/scripts/inject-bg-and-render.mjs NN squads/agent-social-media-v2/output/{run_id}/slides`

**Verificação obrigatória:** pasta `slides/backgrounds/` com 6 imagens **e** `slides/v1/rendered/` com 6× `slide-NN.jpg`. **Proibido** marcar o design como completo sem estes ficheiros.

---

## Process

0. **Copy do Carlos** vem em **frases curtas** (regra do squad). O HTML deve respeitar tipografia mínima da norma **sem** compactar demais para caber parágrafo longo; se o draft vier pesado, documentar risco de overflow em `design-documentation.md`.

1. **Ler `real-imagery-and-safe-zones.md` e `layout-variations.md`** antes de `visual-identity.md` onde houver conflito. Normas: **fundo fotográfico por slide** via `generate-bg-image.mjs` + `inject-bg-and-render.mjs` (ou `run-squad-design.mjs`); **faixa inferior** y ≥ **1150px** sem texto editorial; **Cover** hook na banda **60%–80%** (**top: 810px**, **height: 270px**), **à esquerda**; **slides 1–6** editorial **à esquerda**; **rodapé** `@innovationlatam` + `ARRASTE ->` em **todos** os slides; **padding lateral 100px**; **tipografia** mínima (ver `real-imagery-and-safe-zones.md` §0).

2. **Ler visual-identity.md.** Confirmar tokens: Montserrat, paleta, logo, dimensões **1080×1350px (4:5)**.

3. **Ler `slide-scenes.md` (Daniel Diretor) e o `carousel-draft.md` completo.** Para cada slide: (a) texto exato e Visual cues vêm do draft; (b) atmosfera, plano, luz e notas de implementação vêm do `slide-scenes.md`; (c) registar background visual exclusivo alinhado à cena — ver regra abaixo.

4. **Fundos fotográficos obrigatórios.** O pipeline padrão: HTML base (`gen-slides-for-run.mjs` ou HTML equivalente) → **uma imagem IA por slide** em `slides/backgrounds/bg-NN.*` → `inject-bg-and-render.mjs`. A camada `.bg-synth` no HTML é placeholder até o inject; **não** tratar gradiente CSS como substituto final do fundo.

5. **Converter o logo a data-URI.** Ler `squads/tech-instagram-carousel/assets/innovation-latam-logo-white.png` e reutilizar em todos os slides. Posição obrigatória: **`position:absolute; top:30px; left:100px`** (única norma — ver `real-imagery-and-safe-zones.md` §0). Nunca usar coordenadas diferentes sem nota em `design-documentation.md`.

6. **Fundo final:** gerado por IA e injetado (ver passo 4). Google Fonts `@import` permitido.

7. **Criar design-documentation.md.** Documentar: tokens, sequência de layouts, **tabela de backgrounds**: slide | prompt / arquivo em `backgrounds/` | inject aplicado.

8. **Criar slide-01.html (Cover Layout).** Hook na banda **810px + 270px altura**, **à esquerda**; após inject: foto full-bleed; overlay; **padding 100px** no bloco; **rodapé** `@innovationlatam` + `ARRASTE ->`.

9. **Verificar slide 1 antes de avançar.** Logo, WCAG AA, sem overflow, **1080×1350px**.

10. **Criar slide-02.html (Image Context).** Fundo IA **diferente do slide 1** + overlay; texto **à esquerda**; não invadir y ≥ 1150px; rodapé obrigatório.

11. **Criar slides 03+.** Para cada slide: releer copy no `carousel-draft.md`; garantir **fundo IA** distinto; layout Standard/Split com texto **à esquerda**, **padding 100px**. WCAG AA por slide.

12. **Reflexão (penúltimo).** Reflection Layout; texto **à esquerda**; **padding 100px**; acima de y=**1150px**; com rodapé obrigatório.

13. **CTA (último).** CTA Layout; fundo IA distinto; blocos **à esquerda**; **padding 100px**; com rodapé obrigatório.

14. **Verificação final.** Confirmar que nenhum par de slides tem backgrounds idênticos. Checklist em `real-imagery-and-safe-zones.md` §4 + logo, WCAG, tokens.

## Output Format

```html
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
  /* [layout-specific background] */
}
</style>
</head>
<body>
  <!-- Logo -->
  <div style="position:absolute; top:30px; left:100px; z-index:10;">
    <img src="[DATA-URI-LOGO-BRANCO]" style="max-width:200px; display:block;" alt="Innovation Latam" />
  </div>

  <!-- [Conteúdo específico do layout] — todos os slides: editorial à esquerda -->
  <!-- Rodapé: @innovationlatam + ARRASTE -> (ver real-imagery-and-safe-zones.md) -->
</body>
</html>
```

## Output Example

```html
<!-- slide-03.html — Standard Content (exemplo legado de markup; norma atual: texto à esquerda + rodapé @innovationlatam + ARRASTE ->) -->
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: 1080px; height: 1350px; overflow: hidden;
  font-family: 'Montserrat', sans-serif;
  background: linear-gradient(135deg, #150a1c 0%, #2a1538 100%);
  display: flex; flex-direction: column;
  padding: 0 100px;
  position: relative;
}
</style>
</head>
<body>
  <div style="padding-top:30px;">
    <img src="data:image/png;base64,[BASE64_DO_LOGO]" style="max-width:200px; display:block;" alt="Innovation Latam" />
  </div>

  <div style="flex:1; min-height:0; display:flex; flex-direction:column; align-items:center; justify-content:center;
              text-align:center; padding:24px 0 230px 0; width:100%;">
    <h2 style="font-size:52px; font-weight:700; color:#fff; margin:0 0 32px 0; line-height:1.15; width:100%;">
      Por que as intenções não viram projetos?
    </h2>
    <p style="font-size:40px; font-weight:500; color:#fff; line-height:1.4; margin:0; width:100%;">
      Porque "programa de IA" foi delegado ao TI.<br><br>
      Mas <span style="color:#c0fefd; font-weight:700;">73%</span> dos casos de uso mais rentáveis de IA surgem do negócio:
      vendas, operações, RH — não do departamento de tecnologia.<br><br>
      <span style="font-size:32px; color:rgba(255,255,255,0.6);">(Harvard Business Review, 2024)</span>
    </p>
  </div>

</body>
</html>
```

```markdown
<!-- design-documentation.md -->
# Design Documentation — [NOME DO CARROSSEL]
**Gerado por:** Dária Design
**Data:** [YYYY-MM-DD]

## Tokens Aplicados
- Fonte: Montserrat (Google Fonts) — pesos 500, 600, 700, 800
- Bg slides 3+: linear-gradient(135deg, #150a1c 0%, #2a1538 100%)
- Destaque teal: #c0fefd
- Destaque gold: #e8c85c
- Logo: data-URI de innovation-latam-logo-white.png

## Sequência de Layouts
| Slide | Variação | Verificação WCAG |
|-------|----------|-----------------|
| 01 | Cover Layout | ✓ ratio [X.X]:1 |
| 02 | Image Context Layout | ✓ ratio [X.X]:1 |
| 03 | Standard Content Layout | ✓ ratio [X.X]:1 |
| 04 | Split Content Layout | ✓ ratio [X.X]:1 |
| 05 | Reflection Layout | ✓ ratio [X.X]:1 |
| 06 | CTA Layout | ✓ ratio [X.X]:1 |

## Checklist Final
- [x] Logo presente em todos os slides (6/6)
- [x] WCAG AA confirmado em todos os slides (4.5:1 mínimo)
- [x] Sem overflow de texto em nenhum slide
- [x] Dimensões 1080×1350px em todos os HTMLs
- [x] Imagens bitmap = data-URI; rodapé com `bottom: 0; margin-bottom: 20px` onde aplicável (v3)
- [x] Cover: banda 60%–80% alinhada à esquerda; padding 100px; Standard/Split: texto alinhado à esquerda (v3)
- [x] Variação de layout entre slides (Cover, Image Context, Standard/Split, Reflection, CTA — ritmo visual distinto)
- [x] Reflection Layout com rodapé `@innovationlatam` + `ARRASTE ->`
- [x] CTA Layout com rodapé `@innovationlatam` + `ARRASTE ->`, com botão teal
```

## Quality Criteria

- Todos os slides **1080×1350px**, HTML auto-suficiente, sem dependências externas além de Google Fonts
- Montserrat como única fonte em todos os HTMLs
- Logo branco via data-URI presente em todos os slides com posição e tamanho corretos
- WCAG AA (4.5:1) calculado e documentado para cada slide em design-documentation.md
- Sem overflow de texto em nenhum slide (verificação visual + código)
- Ao menos 3 variações de layout distintas usadas nos slides de conteúdo

## Veto Conditions

0. **Faltam `slides/backgrounds/` (6 imagens) ou `slides/v1/rendered/` (6 JPEGs)** após o HTML — o runner **não** executou `generate-bg-image.mjs` + `inject-bg-and-render.mjs` (ou `run-squad-design.mjs`). **Bloqueio total:** correr os comandos da secção «Execução obrigatória após os HTMLs» antes de concluir.

1. Qualquer slide usando fonte diferente de Montserrat — violação inaceitável do sistema post-05
2. Logo ausente em qualquer slide, ou logo fora de **`top: 30px; left: 100px`** (salvo exceção documentada) — viola identidade de marca
3. Texto sobre imagem sem overlay de no mínimo rgba(21,10,28,0.75) — falha WCAG AA garantida
4. Contraste calculado abaixo de 4.5:1 em qualquer elemento de texto — falha WCAG AA
5. `body` com dimensões diferentes de **1080×1350px** ou texto editorial com **`text-align: center`** nos slides (norma v3: **`text-align: left`** em headline, body, reflexão e CTA)
6. Dois ou mais slides com backgrounds idênticos — viola a regra de imagem única por slide; cada slide deve ter fundo visualmente distinto gerado a partir do tema do seu texto
