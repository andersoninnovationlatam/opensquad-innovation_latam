---
task: "Define visual prompts (JSON)"
order: 1
input: |
  - carousel_copy.json
  - carousel_visual_language.md
output: |
  - visual_prompts.json
---

# Define visual prompts (JSON)

## Process

1. Ler `carousel_copy.json` (slides 1–5) e `pipeline/data/carousel-visual-language.md`
2. Para cada slide, redigir `image_prompt` **apenas** com descrição de fundo (fotografia realista cinematográfica, iluminação, profundidade de campo, áreas desfocadas ou escuras para leitura).
3. Copiar `slide_text` para o campo `text_overlay` (deve coincidir com o copy).
4. **Slide 5 (CTA)**: fundo institucional (gradiente suave, escritório abstrato, luz azul) — sem texto na IA.
5. Gravar `visual_prompts.json` conforme `pipeline/artifacts/visual_prompts.schema.json`.

## Output JSON

```json
{
  "slides": [
    {
      "slide_number": 1,
      "image_prompt": "Photorealistic … negative space at top for headline …",
      "text_overlay": "{igual a slide_text do slide 1}"
    }
  ]
}
```

## Quality Criteria

- [ ] Cinco entradas; `image_prompt` sem pedir texto/URL/logotipo na imagem.
- [ ] Estilo consistente (realista/cinema) ao longo do carrossel.

## Veto Conditions

Reject and redo if ANY are true:
1. Qualquer prompt que peça palavras, números ou logos na imagem.
2. `text_overlay` divergente do `carousel_copy.json` para o mesmo `slide_number`.
