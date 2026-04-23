---
execution: subagent
agent: designer
format: instagram-feed
model_tier: powerful
inputFile: squads/noticias-ia-tech-instagram/output/visual_prompts.json
outputFile: squads/noticias-ia-tech-instagram/output/carousel-package/ENTREGA.md
---

# Step 08: Verificar notícia e gerar carrossel (IA + composição)

## Context Loading

Load these files before executing:
- `squads/noticias-ia-tech-instagram/output/visual_prompts.json`
- `squads/noticias-ia-tech-instagram/output/visual-prompts-approved.md`
- `squads/noticias-ia-tech-instagram/output/carousel_copy.json`
- `squads/noticias-ia-tech-instagram/output/selected-story.md`
- `squads/noticias-ia-tech-instagram/pipeline/data/carousel-visual-language.md`
- `squads/noticias-ia-tech-instagram/agents/designer/tasks/verify-news-for-visuals.md`
- `squads/noticias-ia-tech-instagram/agents/designer/tasks/generate-ai-carousel-from-json.md`
- `_opensquad/core/best-practices/image-design.md` — se necessário
- Skills: `image-ai-generator`, opcionalmente `image-creator`

## Instructions

### Process

1. Carregar **Diana Diapositivo** e executar tarefas em ordem: `verify-news-for-visuals` → `generate-ai-carousel-from-json`.
2. A primeira tarefa grava `verification-news.md` no diretório de output do run.
3. Só se **PASS**, executar geração de fundos IA, `compose-carousel-slides.py` e `ENTREGA.md`.
4. Se **FAIL**, não gerar imagens; `ENTREGA.md` documenta bloqueio.

## Output Format

`carousel-package/ENTREGA.md` com legenda (`meta.caption_full`), lista `slide-01.png` … `slide-05.png`, instruções de publicação.

## Veto Conditions

Reject and redo if ANY are true:
1. Imagens geradas com verificação FAIL.
2. `ENTREGA.md` vazio ou sem lista de assets quando PASS.

## Quality Criteria

- [ ] `verification-news.md` presente antes dos PNGs finais
- [ ] Cinco slides 1080×1350
- [ ] ENTREGA com legenda copiável
