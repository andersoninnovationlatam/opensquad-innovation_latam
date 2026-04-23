---
task: "Gerar Ângulos Narrativos"
order: 1
input: |
  - news_content: Texto completo da notícia fornecida pelo usuário (de news-input.md)
output: |
  - angles: 5 ângulos narrativos numerados, cada um com título e gancho de 1 linha
---

# Gerar Ângulos Narrativos

Analisa a notícia fornecida e extrai 5 perspectivas emocionalmente distintas que podem ser usadas para criar um carrossel de Instagram de alto engajamento. Cada ângulo usa um driver emocional diferente e produzirá um carrossel com caráter único.

## Process

1. **Ler e extrair a notícia**: ler integralmente o arquivo `news-input.md`. Identificar: fato central, dados quantitativos (%), protagonistas (empresa, pessoa, país), prazo ou período, impacto e contexto de mercado.

2. **Diagnóstico de audiência**: com base no perfil da Innovation Latam (`_opensquad/_memory/company.md`), identificar como o público-alvo (líderes de inovação em grandes empresas) provavelmente reage a essa notícia — o que os preocupa, empolga, surpreende ou desafia.

3. **Gerar os 5 ângulos** — um por driver emocional:
   - **Medo**: o que acontece se o leitor não agir com base nessa notícia? Foco no risco de ficar para trás.
   - **Oportunidade**: que janela se abre com essa notícia? Foco no ganho competitivo para quem agir agora.
   - **Educacional**: o que o leitor precisa entender sobre essa notícia para tomar decisões melhores? Foco em contexto e mecanismo.
   - **Contrário**: o que essa notícia revela que vai contra o que a maioria acredita ou está fazendo? Foco na crença equivocada.
   - **Inspiracional**: que possibilidade ou transformação essa notícia representa? Foco no potencial humano/empresarial.

4. **Redigir headline de gancho para cada ângulo**: 1 frase que seria o cover do carrossel naquele ângulo. Máximo 20 palavras. Deve passar o scroll-stop test.

5. **Apresentar os 5 ângulos numerados** e aguardar seleção do usuário.

## Output Format

```
ÂNGULOS PARA: [título resumido da notícia]

1. [ÂNGULO: MEDO]
   "[Headline do cover — máximo 20 palavras]"
   Driver: [nome do driver emocional] | Foco: [o que este ângulo vai explorar]

2. [ÂNGULO: OPORTUNIDADE]
   "[Headline do cover — máximo 20 palavras]"
   Driver: [nome do driver emocional] | Foco: [o que este ângulo vai explorar]

3. [ÂNGULO: EDUCACIONAL]
   "[Headline do cover — máximo 20 palavras]"
   Driver: [nome do driver emocional] | Foco: [o que este ângulo vai explorar]

4. [ÂNGULO: CONTRÁRIO]
   "[Headline do cover — máximo 20 palavras]"
   Driver: [nome do driver emocional] | Foco: [o que este ângulo vai explorar]

5. [ÂNGULO: INSPIRACIONAL]
   "[Headline do cover — máximo 20 palavras]"
   Driver: [nome do driver emocional] | Foco: [o que este ângulo vai explorar]

Qual ângulo vamos desenvolver? (1-5)
```

## Output Example

> Use como referência de qualidade, não como template rígido.

```
ÂNGULOS PARA: McKinsey — empresas com IA reduziram custos em 34% em 18 meses

1. [ÂNGULO: MEDO]
   "Enquanto você lê isso, sua concorrência já está 18 meses à frente com IA"
   Driver: Perda, risco de obsolescência | Foco: o custo do atraso que se acumula a cada mês

2. [ÂNGULO: OPORTUNIDADE]
   "Empresas que adotaram IA reduziram custos em 34% em 18 meses. A janela ainda está aberta."
   Driver: Vantagem competitiva, ganho | Foco: o momento de implementar antes que o mercado acomode

3. [ÂNGULO: EDUCACIONAL]
   "O relatório McKinsey que todo CEO está lendo: o que IA fez em 18 meses em 1.500 empresas"
   Driver: Curiosidade, domínio do assunto | Foco: entender os dados e o que eles significam na prática

4. [ÂNGULO: CONTRÁRIO]
   "Por que 66% das empresas investindo em IA agora vão desperdiçar esse dinheiro"
   Driver: Indignação intelectual, desafio ao status quo | Foco: as condições que a maioria ignora para IA funcionar

5. [ÂNGULO: INSPIRACIONAL]
   "Uma empresa de médio porte zerou a fila de atendimento em 3 meses usando IA. Veja como."
   Driver: Esperança, possibilidade real | Foco: prova de que é possível mesmo sem ser uma big tech

Qual ângulo vamos desenvolver? (1-5)
```

## Quality Criteria

- [ ] 5 ângulos gerados, cada um com driver emocional distinto
- [ ] Nenhum ângulo é variação do mesmo driver (não pode ter dois "oportunidade" ou dois "medo")
- [ ] Cada headline tem máximo 20 palavras
- [ ] Cada headline passa o scroll-stop test internamente: "Isso faria você parar de rolar?"
- [ ] Nenhum ângulo fabrica dados não presentes na notícia fornecida

## Veto Conditions

Rejeitar e refazer se:
1. Dois ou mais ângulos usam o mesmo driver emocional dominante (ex: dois ângulos de urgência/medo)
2. Qualquer headline ultrapassa 20 palavras
