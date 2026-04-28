---
type: checkpoint
outputFile: squads/carousel-noticias/output/news-input.md
---

# Checkpoint: Fornecer Notícia e Ângulo

**Squad:** Carrossel de Notícias — Innovation Latam

Olá! Vamos criar um carrossel para o Instagram da Innovation Latam.

A entrada deste squad acontece pelo frontend, onde o usuário informa **dois campos obrigatórios**:

1. **Notícia** — texto da notícia (artigo completo, resumo ou pontos principais).
2. **Ângulo de Perspectiva** — driver narrativo escolhido pelo usuário entre os 6 valores:
   - `EDUCACIONAL` (Ensino e Valor)
   - `MEDO` (Urgência e Alerta)
   - `ENTUSIASMO` (Oportunidade e Futuro)
   - `CURIOSIDADE` (Mistério e Descoberta)
   - `POLEMICA` (Debate e Opinião)
   - `EMPATIA` (Conexão Humana)

> Dica: quanto mais detalhes na notícia (título, fonte, dados, contexto), melhor o resultado.

## Estrutura obrigatória do `news-input.md`

O backend grava o arquivo neste formato. Se por algum motivo o ângulo não chegar (ex.: execução manual via CLI), o Claude/orquestrador pergunta ao usuário e grava o campo `angulo:` no frontmatter antes de avançar.

```
---
angulo: <EDUCACIONAL | MEDO | ENTUSIASMO | CURIOSIDADE | POLEMICA | EMPATIA>
---

# Notícia

<texto integral da notícia colado pelo usuário>
```

## Validação antes de avançar

- [ ] `news-input.md` existe em `squads/carousel-noticias/output/<runId>/`
- [ ] Frontmatter contém `angulo:` com um dos 6 valores válidos (case-insensitive — backend grava sempre em uppercase)
- [ ] Corpo da notícia preenchido (não vazio)

> Se qualquer um desses itens falhar, o pipeline para neste checkpoint até o usuário fornecer os dados faltantes.
