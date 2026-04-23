---
task: "Process News for Instagram Brief"
order: 1
input: |
  - selected_news: Texto da notícia fornecido pelo usuário (selected-news.md)
output: |
  - social_handoff: Brief para o Copywriter (social-handoff.md)
---

# Process News

A partir de `selected-news.md`, produz `social-handoff.md` com tudo o que o Copywriter precisa.

## Process

1. Ler `selected-news.md` por completo (título, fonte, datas, fatos, links).
2. **Revisão de português e gramática (obrigatório):** corrigir ortografia, concordância, regência e pontuação que esteja **objetivamente incorreta** ou gere ambiguidade. **Preservar a pontuação intencional do autor** ao reproduzir trechos ou parafrasear com fidelidade (não trocar vírgulas/pontos só por estilo se isso mudar ênfase ou leitura). Se for preciso alterar pontuação por clareza, registrar em **Cuidados / limites** com uma linha do tipo: “Ajuste pontual em [trecho]: [motivo].”
3. Extrair: **tese central**, **3–5 fatos verificáveis**, **por que importa** para a audiência Innovation Latam, **riscos de claim** (o que não dá para afirmar sem fonte).
4. Definir: **público-alvo** do post, **tom sugerido** (sem substituir a escolha formal de tom do Copywriter), **ganchos naturais** (lista curta de ideias, não o carrossel final).
5. Incluir **critérios de sucesso** (“o post funciona se…”).

## Output Format

```markdown
# Brief para Copywriter — [Título curto da notícia]

## Texto revisado (PT-BR)
[Se houver correções objetivas de gramática/ortografia em relação ao selected-news, listar aqui em bullet breve; se não houver, escrever: “Nenhuma correção necessária.”]

## Resumo fiel
[3–6 linhas, só com base no selected-news; pontuação alinhada ao original quando for paráfrase próxima]

## Fatos-chave
- ...

## Tese / ângulo editorial sugerido
[1 parágrafo]

## Audiência e objetivo no Instagram
- Audiência: ...
- Objetivo (ex.: salvar, comentar, compartilhar): ...

## Ganchos possíveis (não são slides finais)
1. ...
2. ...
3. ...

## Cuidados / limites
- ...

## O que o Copywriter deve entregar em seguida
Ângulos emocionais distintos e, após escolha do usuário, carrossel completo alinhado a este brief.
```

## Quality Criteria

- [ ] Revisão de português aplicada; pontuação do fonte respeitada salvo correção justificada
- [ ] Nenhum fato novo inventado em relação ao `selected-news.md`
- [ ] Brief permite ao Copywriter gerar `angles.md` sem ambiguidade grave
- [ ] Arquivo salvo em `squads/tech-instagram-carousel/output/social-handoff.md`
