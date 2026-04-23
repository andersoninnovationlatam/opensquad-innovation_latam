---
execution: inline
agent: caio-carrossel
format: instagram-carousel
inputFile: squads/carousel-noticias/output/news-input.md
outputFile: squads/carousel-noticias/output/angles.md
---

# Step 02: Gerar Ângulos Narrativos

## Context Loading

Load these files before executing:
- `squads/carousel-noticias/output/news-input.md` — notícia fornecida pelo usuário no checkpoint anterior
- `_opensquad/_memory/company.md` — perfil da Innovation Latam, público-alvo e tom de voz
- `pipeline/data/research-brief.md` — referência sobre ângulos narrativos e drivers emocionais

## Instructions

### Process
1. Ler integralmente `news-input.md` e extrair: fato central, dados quantitativos, protagonistas (empresa/pessoa/país/setor), prazo ou período mencionado, impacto reportado e contexto de mercado.
2. Com base no perfil da Innovation Latam (líderes de inovação em grandes empresas), diagnosticar como esse público reage à notícia: o que os preocupa, o que os empolga, o que os surpreende.
3. Gerar 5 ângulos, um por driver emocional (Medo, Oportunidade, Educacional, Contrário, Inspiracional). Para cada ângulo, redigir a headline que seria o cover do carrossel — máximo 20 palavras, deve passar o scroll-stop test.
4. Apresentar os 5 ângulos numerados com: [ÂNGULO], headline, Driver emocional, Foco (o que será explorado).
5. Aguardar seleção do usuário (resposta vai para o checkpoint do Step 03).

## Output Format

```
ÂNGULOS PARA: [título resumido da notícia]

1. [ÂNGULO: MEDO]
   "[Headline — máx. 20 palavras]"
   Driver: Perda / risco de ficar para trás | Foco: [o que explora]

2. [ÂNGULO: OPORTUNIDADE]
   "[Headline — máx. 20 palavras]"
   Driver: Vantagem competitiva, ganho | Foco: [o que explora]

3. [ÂNGULO: EDUCACIONAL]
   "[Headline — máx. 20 palavras]"
   Driver: Curiosidade, domínio do assunto | Foco: [o que explora]

4. [ÂNGULO: CONTRÁRIO]
   "[Headline — máx. 20 palavras]"
   Driver: Indignação intelectual, desafio | Foco: [o que explora]

5. [ÂNGULO: INSPIRACIONAL]
   "[Headline — máx. 20 palavras]"
   Driver: Esperança, possibilidade | Foco: [o que explora]

Qual ângulo vamos desenvolver? (1-5)
```

## Output Example

```
ÂNGULOS PARA: Open Banking no Brasil atinge 40 milhões de usuários

1. [ÂNGULO: MEDO]
   "Enquanto sua empresa espera entender Open Banking, os concorrentes já estão monetizando os dados"
   Driver: Perda, risco de obsolescência | Foco: custo competitivo do atraso em adotar open finance

2. [ÂNGULO: OPORTUNIDADE]
   "O Brasil tem o 2º maior Open Banking do mundo. O que isso significa para quem age agora?"
   Driver: Vantagem competitiva, janela de mercado | Foco: o ecossistema disponível e como acessá-lo

3. [ÂNGULO: EDUCACIONAL]
   "40 milhões de usuários e você ainda não sabe o que o Open Banking muda na sua empresa?"
   Driver: Curiosidade, domínio do assunto | Foco: o que é, qual o tamanho e o impacto prático

4. [ÂNGULO: CONTRÁRIO]
   "Open Banking no Brasil: o que ninguém está falando sobre por que 60% das empresas vão perder essa onda"
   Driver: Indignação intelectual | Foco: os erros de interpretação mais comuns sobre open finance

5. [ÂNGULO: INSPIRACIONAL]
   "De país emergente a 2º do mundo em open finance. O que o Brasil fez que outras economias não conseguiram"
   Driver: Esperança, orgulho, possibilidade | Foco: a jornada e o que ela representa para a inovação

Qual ângulo vamos desenvolver? (1-5)
```

## Veto Conditions

Rejeitar e redo se:
1. Dois ângulos usam o mesmo driver emocional dominante
2. Qualquer headline ultrapassa 20 palavras

## Quality Criteria

- [ ] 5 ângulos com drivers emocionais distintos
- [ ] Cada headline máximo 20 palavras
- [ ] Nenhum ângulo fabrica dados ausentes da notícia
- [ ] Output salvo em `angles.md` antes do próximo step
