---
type: checkpoint
outputFile: squads/noticias-ia-tech-instagram/output/research-focus.md
---

# Step 01: Checkpoint — Foco da pesquisa

## Context Loading

Load these files before executing:
- `_opensquad/_memory/company.md` — contexto da marca (se existir)
- `squads/noticias-ia-tech-instagram/pipeline/data/domain-framework.md` — lembrete do fluxo

## Instructions

### Process

1. Apresentar ao gestor o propósito do squad (notícias IA/tech → Instagram).
2. Pedir o **foco específico** da pesquisa de hoje (texto livre).
3. Pedir a **janela temporal** com lista numerada:
   1. Últimas 24 horas
   2. Últimos 7 dias
   3. Último mês
   4. Sem restrição (evergreen)
4. Pedir **quatro eixos de pesquisa** (temas distintos) para orientar diversidade na curadoria — exemplos: novos modelos/LLM, hardware/aceleradores, regulação, ecossistema Latam, segurança, produto enterprise. O gestor pode ajustar os rótulos; o importante é haver **quatro linhas** antes de gastar buscas.
5. Guardar a resposta em `research-focus.md` no formato de saída abaixo.

## Output Format

The output MUST follow this exact structure:

```markdown
# Research Focus

**Topic:** {tema exato digitado pelo gestor}
**Time Range:** {rótulo da opção escolhida}
**Date:** {YYYY-MM-DD}

## Research themes (diversidade)

1. {eixo 1 — ex.: Novos modelos e APIs}
2. {eixo 2 — ex.: Hardware e infra de IA}
3. {eixo 3 — ex.: Regulação e governança}
4. {eixo 4 — ex.: Startups e investimento na região}
```

## Output Example

```markdown
# Research Focus

**Topic:** Regulação de IA generativa na UE e impacto em stacks cloud
**Time Range:** Últimos 7 dias
**Date:** 2026-03-30

## Research themes (diversidade)

1. Atos legislativos e prazos (EU AI Act, compliance)
2. Ofertas cloud e contratos enterprise sob novo enquadramento
3. Transparência e auditoria de modelos (obligações técnicas)
4. Reação do mercado: custos, multas e adoção
```

## Veto Conditions

Reject and redo if ANY of these are true:
1. Ficheiro sem tema ou sem janela temporal explícitos.
2. Data em formato incorreto.
3. Secção `## Research themes` ausente ou com menos de quatro eixos numerados.

## Quality Criteria

- [ ] Tema citável em uma frase
- [ ] Uma única janela temporal selecionada
- [ ] Data do dia no cabeçalho
- [ ] Quatro eixos de pesquisa distintos (uma linha cada)

## Notes

- Este ficheiro alimenta diretamente o Pedro Pesquisa; quanto mais específico o tema, melhor o ranqueamento.
- Evitar temas demasiado largos (“tudo sobre IA”) — preferir âmbito recortável em uma sessão de pesquisa.
- Os quatro eixos não são quatro notícias finais: são **âncoras** para o pesquisador cobrir variedade antes do gestor escolher **uma** história no passo 3.
