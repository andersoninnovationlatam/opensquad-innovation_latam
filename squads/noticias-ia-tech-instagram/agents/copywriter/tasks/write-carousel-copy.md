---
task: "Write carousel copy (JSON)"
order: 1
input: |
  - selected_story: notícia escolhida
  - news_raw: array JSON do Researcher
  - tone_of_voice: pipeline/data/tone-of-voice.md
output: |
  - carousel_copy.json
---

# Write carousel copy (JSON)

## Process

1. Ler `selected-story.md` e obter URL, título e resumo.
2. Ler `news_raw.json` e localizar o item cujo `link` coincide com a URL da história (ou o `rank` se estiver no selected-story); usar `conteudo`/`titulo` como base factual.
3. Se o tom não estiver fixado em memória do run, apresentar as **6 opções** de `tone-of-voice.md` numeradas e pedir escolha ao gestor **antes** de redigir o JSON final.
4. Redigir **5 slides**:
   - Slides **1–4**: desenvolver a **mesma** notícia com progressão lógica (capa → contexto → detalhe → implicação ou dado). Cada um com `slide_text` curto (overlay) e `caption_text` pode ser nota ou mini-resumo; a legenda única do post vai em `meta.caption_full`.
   - Slide **5**: apenas CTA Innovation Latam (sem facto novo).
5. Preencher `meta`: `source_url`, `source_label` (fonte limpa), `tone`, `caption_full` (legenda completa + hashtags + menção “Segundo o [Fonte]…” quando aplicável).
6. Gravar `carousel_copy.json` conforme schema `pipeline/artifacts/carousel_copy.schema.json`.

## Output JSON (contrato)

```json
{
  "meta": {
    "source_url": "https://...",
    "source_label": "TechCrunch",
    "tone": "{nome do tom escolhido}",
    "caption_full": "Texto completo da legenda do post… #hashtags"
  },
  "slides": [
    {
      "slide_number": 1,
      "slide_text": "Máximo dez palavras de manchete",
      "caption_text": "Notas ou mini-resumo para o slide 1"
    },
    {
      "slide_number": 2,
      "slide_text": "...",
      "caption_text": "..."
    },
    {
      "slide_number": 3,
      "slide_text": "...",
      "caption_text": "..."
    },
    {
      "slide_number": 4,
      "slide_text": "...",
      "caption_text": "..."
    },
    {
      "slide_number": 5,
      "slide_text": "Acompanhe a inovação com a Innovation Latam",
      "caption_text": "CTA institucional — repetir ou reforçar convite e link na bio"
    }
  ]
}
```

## Quality Criteria

- [ ] JSON válido e válido face ao schema.
- [ ] Exatamente 5 slides; slide 5 só CTA.
- [ ] `caption_full` pronta para colar no Instagram.
- [ ] Sem plágio de trechos longos da fonte.

## Veto Conditions

Reject and redo if ANY are true:
1. `slide_text` em qualquer slide com mais de ~12 palavras (exceto tolerância mínima).
2. `caption_full` sem menção de fonte quando há facto de notícia.
3. Slide 5 com conteúdo factual de nova notícia.
