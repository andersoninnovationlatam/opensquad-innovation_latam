---
execution: inline
agent: social-media
inputFile: squads/tech-instagram-carousel/output/selected-news.md
outputFile: squads/tech-instagram-carousel/output/social-handoff.md
---

# Step 02: Social Media — Brief para o Copywriter

## Context Loading

- `squads/tech-instagram-carousel/output/selected-news.md` — notícia copiada do passo 1 (`input/selected-news.md`)
- `agents/social-media/tasks/process-news.md` — instruções da task

## Instructions

Atue como **Social Media**. Leia a notícia, sintetize para Instagram e grave o brief em `social-handoff.md` conforme a task **Process News**.

## Output

Arquivo: `squads/tech-instagram-carousel/output/social-handoff.md`

## Quality Criteria

- [ ] Brief permite ao Copywriter gerar ângulos sem inventar fatos fora do `selected-news.md`
- [ ] Nenhuma etapa de “buscar notícias na web” — só o material enviado por você
