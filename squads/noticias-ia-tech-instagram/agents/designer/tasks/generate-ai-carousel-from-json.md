---
task: "Generate AI carousel from JSON prompts"
order: 2
input: |
  - visual_prompts.json (aprovado)
  - carousel_copy.json
  - selected_story.md
output: |
  - raw/*.png fundos IA
  - carousel-package/slide-NN.png
  - carousel-package/ENTREGA.md
---

# Generate AI carousel from JSON prompts

Só executar se `verification-news.md` estiver **PASS**.

## Process

1. Confirmar `verification-news.md` = **PASS**. Se **FAIL**, não gerar imagens; escrever `ENTREGA.md` mínimo a explicar bloqueio.
2. Ler `visual_prompts.json` e `carousel_copy.json`.
3. Criar pasta `carousel-package/raw/` no diretório de output do run.
4. Para cada slide (1–5), gerar fundo com **skill `image-ai-generator`**:
   - Prompt = apenas `image_prompt` (sem pedir texto na imagem).
   - Guardar como `carousel-package/raw/raw_slide_01.png` … `raw_slide_05.png`.
   - **Modo**: `production` para entrega final (ou `test` só se o gestor pedir iteração barata).
   - Variável de ambiente: `OPENROUTER_API_KEY` (ver skill `skills/image-ai-generator`).
5. Compor slides finais com texto + logo:
   ```bash
   python3 squads/noticias-ia-tech-instagram/scripts/compose-carousel-slides.py \
     --visual-prompts "<run>/visual_prompts.json" \
     --carousel-copy "<run>/carousel_copy.json" \
     --raw-dir "<run>/carousel-package/raw" \
     --out-dir "<run>/carousel-package"
   ```
   (Substituir `<run>` pelo path real do output transformado pelo runner.)
6. Garantir `slide-01.png` … `slide-05.png` em `carousel-package/` (1080×1350). O compose já inclui logo; **não** é necessário `apply-innovation-logo.py` em seguida salvo correção pontual.
7. Escrever `carousel-package/ENTREGA.md` com legenda copiável (`meta.caption_full` do `carousel_copy.json`), lista de assets e ordem de publicação.

## Fallback

- Se `image-ai-generator` falhar num slide, documentar e repetir só esse slide ou usar `image-creator` / template conforme `carousel-visual-language.md`.

## Quality Criteria

- [ ] Cinco PNGs finais numerados.
- [ ] Resolução 1080×1350 após compose.
- [ ] ENTREGA com legenda completa.

## Veto Conditions

Reject and redo if ANY are true:
1. Imagens geradas com verificação **FAIL**.
2. Menos de 5 `slide-NN.png` quando PASS.
