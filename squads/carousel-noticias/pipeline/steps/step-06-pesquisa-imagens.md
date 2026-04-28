---
execution: inline
agent: bruno-buscador
inputFile: squads/carousel-noticias/output/carousel-copy.md
outputFile: squads/carousel-noticias/output/images/index.json
---

# Step: Busca e Download de Imagens

## Context Loading

Load these files before executing:
- `squads/carousel-noticias/output/carousel-copy.md` — copy aprovado pelo usuário (contém o bloco `=== ENTIDADES ===` preenchido pelo Caio)

## Instructions

### Process

1. Confirmar que `carousel-copy.md` existe e contém o bloco `=== ENTIDADES ===`.

2. **Extrair entidades do copy**:
   ```bash
   node squads/carousel-noticias/scripts/extract-topics.mjs squads/carousel-noticias/output
   ```
   O script lê o bloco `=== ENTIDADES ===` do `carousel-copy.md` e gera `topics.json` com as até 4 entidades já mapeadas para os slides 1, 3, 5 e 7.

3. **Verificar topics.json**: confirmar que o arquivo existe e contém o campo `entities` com `slide` (1, 3, 5 ou 7) e `name` por entrada.

4. **Executar busca e download de imagens**:
   ```bash
   node squads/carousel-noticias/scripts/search-reference-images.mjs squads/carousel-noticias/output
   ```
   O script tenta baixar uma imagem para cada entidade via SerpAPI. Aguardar conclusão.

5. **Verificar os downloads**:
   ```bash
   ls -lh squads/carousel-noticias/output/images/
   ```
   Confirmar arquivos `slide-0N-ref.*` para cada entidade (apenas slides 1, 3, 5, 7 — só as posições com entidade).

6. **Para imagens não baixadas** (listadas como `pending_manual_download` no `index.json`):

   > ⚠️ **OBRIGATÓRIO** — usar Playwright no Google Images. Jamais inventar, gerar ou descrever imagens sem baixar o arquivo real.

   Para **cada entidade pendente**:

   a. Navegar para `https://www.google.com/imghp`
   b. Digitar a query da entidade e pressionar Enter
   c. Aguardar resultados carregarem
   d. Clicar na primeira imagem sem texto sobreposto
   e. No painel lateral, abrir a imagem em tamanho original
   f. Copiar a URL direta da imagem
   g. Baixar com curl (nome correto do slide):
      ```bash
      curl -L -o "squads/carousel-noticias/output/images/slide-0N-ref.<ext>" \
        -H "User-Agent: Mozilla/5.0" "<url-da-imagem>"
      ```
   h. Verificar tamanho > 1KB
   i. Atualizar `index.json` com a nova entrada

   **Só avançar para o passo 7 após tentar Playwright para todas as pendentes.**

7. **Caso o copy não tenha entidades** (`=== ENTIDADES ===` com `(nenhuma)`):
   - Não executar busca.
   - Gravar `index.json` com `images: []` e `pending_manual_download: []`.
   - Informar ao usuário que a Diana gerará as imagens de fundo via IA (fallback do Step 7).

8. **Apresentar resumo ao usuário** conforme o formato abaixo.

## Output Format

```
=== IMAGENS BAIXADAS ===

📁 squads/carousel-noticias/output/images/

🖼️  Slide 1 → Nubank (empresa)
    Arquivo: slide-01-ref.webp — 42KB

🖼️  Slide 3 → Banco Central (empresa)
    Arquivo: slide-03-ref.png — 18KB

🖼️  Slide 5 → Roberto Campos Neto (pessoa)
    Arquivo: slide-05-ref.jpg — 95KB

🖼️  Slide 7 → Brasil (pais)
    Arquivo: slide-07-ref.jpg — 63KB

---
✅ N/N imagens prontas em output/images/
   Diana Design usará cada slide-0N-ref no slide correspondente.
   Slides ímpares sem entidade → Diana gera imagem AI no Step 7.
```

## Veto Conditions

Rejeitar e redo se:
1. `topics.json` não foi criado
2. Imagens listadas em `pending_manual_download` sem tentativa via Playwright
3. Arquivo de imagem com tamanho 0 ou menor que 1KB
4. Qualquer imagem fabricada, descrita ou inventada sem download real
5. Arquivos não seguem a nomenclatura `slide-0N-ref.*`

## Quality Criteria

- [ ] `topics.json` gerado a partir do bloco `=== ENTIDADES ===` do `carousel-copy.md`
- [ ] `output/images/` contém um arquivo `slide-0N-ref.*` para cada entidade listada (até 4, slides 1/3/5/7)
- [ ] Nenhuma imagem contém texto sobreposto visível
- [ ] `index.json` criado com campo `slide` em cada entrada
- [ ] Resumo apresentado ao usuário com lista de arquivos e tamanhos
