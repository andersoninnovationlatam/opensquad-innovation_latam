# Imagens reais + Safe zones Instagram 4:5 (norma — agent-social-v3)

**Viewport obrigatório:** **1080×1350px** (proporção **4:5**, feed Instagram). **Tokens post-05** (Montserrat, paleta, logo): mantidos; este documento acrescenta **brief de imagem**, **geometria** e **regras mobile**.

**Precedência:** onde este ficheiro entra em conflito com descrições genéricas de `visual-identity.md` ou trechos legados de outros ficheiros, **prevalece este documento** para o squad `agent-social-v3`. **`layout-variations.md`** está alinhado a estas regras (atualização 2026-04).

---

## Regras não negociáveis (pipeline)

0. **Execução obrigatória (extremamente importante):** o Pipeline Runner **e** o agente Dária **devem** disparar os scripts abaixo na **raiz do repositório** para cada run com `run_id` em `output/`. Sem esta execução, **não** há carrossel válido para Instagram (só HTML com placeholder não conta como entregável final).
   - **Orquestrador (recomendado):** `node squads/agent-social-v3/scripts/run-squad-design.mjs <run-id>`
   - **Ou, por slide** (`NN` = `01` … `06`):  
     `node squads/agent-social-v3/scripts/generate-bg-image.mjs NN squads/agent-social-v3/output/<run-id>/slides`  
     `node squads/agent-social-v3/scripts/inject-bg-and-render.mjs NN squads/agent-social-v3/output/<run-id>/slides`  
   **Critério de sucesso:** existem `slides/backgrounds/bg-01.*` … `bg-06.*` **e** `slides/v1/rendered/slide-01.jpg` … `slide-06.jpg`.

1. **Imagens geradas em todos os slides:** cada run **deve** gerar fundo por slide com `squads/agent-social-v3/scripts/generate-bg-image.mjs`, guardar em `slides/backgrounds/bg-NN.*`, e injetar com `inject-bg-and-render.mjs`. O orquestrador `run-squad-design.mjs <run-id>` executa este fluxo. **Não** considerar o design concluído sem imagens geradas e injetadas.
2. **Texto editorial:** **`text-align: left`** em todos os slides (incluindo **slides 2–6**); **padding lateral 100px**. O **slide 1 (Cover)** mantém o hook na banda **60%–80%** com texto **à esquerda** no bloco.
3. **Rodapé no slide:** em **todos** os slides, incluir **`@innovationlatam`** à esquerda e **`ARRASTE ->`** à direita na faixa inferior (ex.: `position: absolute; left: 100px; right: 100px; bottom: 0; margin-bottom: 20px; justify-content: space-between`), sem invadir a faixa `y ≥ 1150px` com texto editorial principal.
4. **Um único formato de export dos slides:** em `slides/{versão}/rendered/` deve existir **apenas** `slide-NN.jpg` (JPEG, qualidade ~92 no Playwright). **Não** gerar PNG duplicado do mesmo quadro; `inject-bg-and-render.mjs` grava só `.jpg` e remove `.png` homólogo se existir de runs antigos.

---

## 0. Layout mobile-first (obrigatório)

- **Slide 1:** hook na banda 60%–80%, **texto à esquerda** no bloco.
- **Slides 2–6:** **texto à esquerda** na área útil.
- **Logo:** canto superior esquerdo, `top: 30px; left: 100px`, max-width **200px** (data-URI).
- **Rodapé:** `@innovationlatam` | `ARRASTE ->` (Montserrat ~24px / 600, contraste legível).
- **Tipografia:** body mínimo **36px** (slide 2) e **38–40px** (slides 3+); `line-height` ≥ **1.42**.

---

## 1. Conteúdos “reais” nas imagens

**Canal:** `carousel-draft.md`, campo **`Visual cue`** de cada slide.

### Slide 1 (Cover)

- Fundo **full-bleed** fotográfico (gerado + injetado). **Presença humana** em cena plausível (ver versões anteriores deste doc: proibido surreal puro sem figura humana).

### Slide 2

- Imagem full-bleed alinhada ao contexto (ex.: laboratório, equipa, pesquisa). **Overlay** `rgba(21,10,28,0.85)` sobre a foto.

### Requisito técnico

- Fundo final **embebido** após injeção (data-URI na camada `.real-bg`). **Nenhuma URL** solta para bitmaps no HTML.

---

## 2. Safe zones (1080×1350)

- **Texto editorial (headline/body):** não invadir **y ≥ 1150px**.
- **Rodapé** @ / ARRASTE: na base do slide com **`margin-bottom: 20px`** (ex.: `bottom: 0; margin-bottom: 20px` com `left/right: 100px`), sem sobrepor o bloco principal de leitura.
- **Padding 100px** lateral no texto.

### Slide 1

- Headline na banda **810px + 270px altura**, **à esquerda** no bloco.

### Slides 2–6

- **Alinhados à esquerda** na área útil.

---

## 3. Bloco opcional no `carousel-draft.md`

```markdown
## Brief de layout (esta run)
- **Viewport:** 1080×1350px (4:5); texto editorial à esquerda; rodapé @innovationlatam + ARRASTE ->; padding 100px.
- **Imagens:** generate-bg-image + inject-bg-and-render por slide (obrigatório).
```

---

## 4. Checklist — Dária

1. `body` = **1080×1350px**.
2. **6 imagens** em `backgrounds/` + HTML pós-injeção com `.real-bg`.
3. Sem texto editorial principal em **y ≥ 1150px**.
4. Slide 1: banda 60%–80%, texto à esquerda.
5. Slides 2–6: texto **à esquerda**.
6. **Rodapé** com `@innovationlatam` e `ARRASTE ->` em **todos** os slides.
7. WCAG AA.
8. Ficheiros finais do carrossel em `rendered/`: **só** `slide-NN.jpg` (sem `.png` paralelo).
