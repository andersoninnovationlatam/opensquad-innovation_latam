---
execution: inline
agent: news-ingest
inputFile: squads/tech-instagram-carousel/input/selected-news.md
outputFile: squads/tech-instagram-carousel/output/selected-news.md
---

# Step 01: Ingestão da notícia

## Context Loading

- `squads/tech-instagram-carousel/input/selected-news.md` — edite **antes** de rodar o squad
- `agents/news-ingest/tasks/ingest-news.md`

## Instructions

Atue como **Ingestão de Notícia**. Siga a task **Ingest News**: validar entrada, copiar para `output/selected-news.md` do run sem alterar o texto.

## Output

`selected-news.md` na pasta de output do run, idêntico ao material válido de entrada.
