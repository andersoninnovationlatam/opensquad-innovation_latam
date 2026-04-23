---
task: "Ingest News from input/"
order: 1
input: |
  - input_selected_news: squads/tech-instagram-carousel/input/selected-news.md (fixo, fora do run_id)
output: |
  - selected_news: squads/tech-instagram-carousel/output/selected-news.md (com run_id na pasta do run)
---

# Ingest News

Copia a notícia do arquivo **input** para o **output** do run, com validação mínima. Não reescreve nem “melhora” o texto aqui — a revisão PT-BR ocorre no passo seguinte (`process-news`).

## Process

1. Ler `input/selected-news.md` por completo.
2. Considerar “vazio” se, após remover linhas em branco óbvias, não houver parágrafo com conteúdo substantivo (ex.: ainda estiver só o template “Substitua este parágrafo”).
3. Se vazio → não gravar; reportar erro: preencher `input/selected-news.md` e rodar de novo.
4. Se válido → gravar o mesmo texto em `output/selected-news.md` (caminho transformado pelo runner com `run_id`). Sem alterações de cópia.

## Quality Criteria

- [ ] Output é cópia fiel do input (byte-a-byte do corpo útil, salvo normalização de newline se o runner exigir)
- [ ] Nenhuma revisão gramatical neste passo
