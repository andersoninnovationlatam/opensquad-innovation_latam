---
task: "Verify news for visuals"
order: 1
input: |
  - selected_story: notícia original
  - carousel_copy: roteiro e legenda em JSON
  - news_raw: opcional — cruzamento de factos
output: |
  - verification: PASS ou FAIL em verification-news.md
---

# Verify news for visuals

Garante alinhamento entre a notícia capturada, o copy em `carousel_copy.json` e o que será ilustrado — **bloqueia** geração de imagens se houver divergência material.

## Process

1. Ler `selected-story.md` e `carousel_copy.json` (campos `meta.source_url`, slides 1–4; slide 5 é CTA).
2. Opcional: cruzar com `news_raw.json` para o mesmo URL.
3. Se necessário, `web_fetch` na URL da notícia para confirmar titular e datas.
4. Comparar: titular, datas, entidades, números citados no copy vs. fonte.
5. Se tudo coincidir com tolerância zero para invenções → **PASS**. Caso contrário → **FAIL** com divergências.
6. Escrever `verification-news.md` no formato de saída.

## Output Format

```markdown
# Verificação de notícia (visual)

## Resultado
PASS | FAIL

## Checklist
- [ ] URL da notícia coincide com meta.source_url
- [ ] Titular e factos dos slides 1–4 sustentados pela fonte
- [ ] Datas e números coerentes
- [ ] Nenhuma afirmação forte inventada no copy

## Divergências (se FAIL)
1. ...

## Evidência
- Fonte consultada: ...
- Data de acesso: YYYY-MM-DD
```

## Quality Criteria

- [ ] Resultado PASS ou FAIL explícito.
- [ ] Cada FAIL tem localização (slide ou campo JSON).

## Veto Conditions

Reject and redo if ANY are true:
1. `verification-news.md` sem PASS/FAIL claro.
2. PASS com número no copy que não está na fonte.
