---
task: "Buscar e Baixar Imagens no Google Images"
order: 2
input: |
  - topics.json: array `entities` (name, type, slide) gerado pelo extract-topics a partir do bloco `=== ENTIDADES ===` do carousel-copy.md
output: |
  - output/images/: pasta com `slide-0N-ref.*` para cada entidade (até 4, mapeada aos slides 1, 3, 5 ou 7)
  - output/images/index.json: mapeamento slide → arquivo de imagem
---

# Buscar e Baixar Imagens no Google Images

Busca e baixa **uma imagem real para cada entidade** que o Caio listou no bloco `=== ENTIDADES ===` do `carousel-copy.md`. As entidades já chegam mapeadas aos slides 1, 3, 5 ou 7 — Bruno apenas executa a busca e o download. Se o Caio não listou entidades, Bruno encerra com `index.json` vazio e a Diana gera todos os backgrounds via IA.

## Process

1. **Confirmar prerequisito**: verificar que `squads/carousel-noticias/output/topics.json` existe.

2. **Criar pasta de imagens**:
   ```bash
   mkdir -p squads/carousel-noticias/output/images
   ```

3. **Ler as entidades**: usar o array `entities` do `topics.json` (já contém `name`, `type` e `slide` corretos, definidos pelo Caio). Se `entities` estiver vazio, encerrar e gravar `index.json` com `images: []`.

4. **Para cada entidade** (slide-alvo já vem do array):

   a. **Abrir o Google Images** com a query da entidade:
      - Navegar para `https://images.google.com/`
      - Digitar a query no campo de busca e pressionar Enter
      - Aguardar os resultados carregarem

   b. **Selecionar a melhor imagem**:
      - Percorrer os primeiros resultados visualmente
      - Escolher uma imagem **sem texto sobreposto** (sem marcas d'água, sem banners, sem legendas impressas na imagem)
      - Para logos e marcas: preferir fundo branco ou transparente
      - Para pessoas: preferir foto profissional em fundo neutro

   c. **Abrir a imagem em tamanho completo**:
      - Clicar na imagem para expandir no painel lateral do Google Images
      - Clicar em "Visitar" ou no botão de abrir imagem em tamanho original
      - Copiar a URL direta da imagem (`.webp`, `.png`, `.jpg`, `.svg` — nessa ordem de preferência)

   d. **Baixar a imagem** nomeando-a com o número do slide correspondente:
      ```bash
      curl -L -o "squads/carousel-noticias/output/images/slide-0N-ref.<ext>" \
        -H "User-Agent: Mozilla/5.0" "<url-da-imagem>"
      ```
      Substituir `0N` pelo número do slide zero-padded (01, 03, 05, 07).

5. **Registrar no index.json**: após baixar todas as imagens, criar o arquivo:
   ```json
   {
     "generated_at": "<ISO timestamp>",
     "images": [
       { "entity": "Nubank", "type": "company", "slide": 1, "file": "output/images/slide-01-ref.webp", "source_url": "..." },
       { "entity": "Banco Central", "type": "company", "slide": 3, "file": "output/images/slide-03-ref.png", "source_url": "..." },
       { "entity": "Lula", "type": "person", "slide": 5, "file": "output/images/slide-05-ref.jpg", "source_url": "..." },
       { "entity": "Brasil", "type": "location", "slide": 7, "file": "output/images/slide-07-ref.jpg", "source_url": "..." }
     ]
   }
   ```
   Salvar em `squads/carousel-noticias/output/images/index.json`.

6. **Verificar arquivos baixados**:
   ```bash
   ls -lh squads/carousel-noticias/output/images/
   ```
   Confirmar que as 4 imagens (`slide-01-ref`, `slide-03-ref`, `slide-05-ref`, `slide-07-ref`) existem e têm tamanho > 1KB.

7. **Reportar ao usuário**: apresentar lista das 4 imagens baixadas com nome do arquivo, slide correspondente e tamanho.

## Regras de Seleção de Imagem

- **Sem texto na imagem**: descartar imagens que contenham texto, legendas, banners ou marcas d'água impressas diretamente no pixel da imagem
- **Alta qualidade**: preferir imagens com boa resolução (mínimo 300x300px)
- **Representativa**: a imagem deve ser reconhecível como sendo aquela entidade
- **Formatos aceitos**: `.webp` > `.png` > `.jpg` — preferir .webp quando disponível
- **Fundo limpo**: para logos, preferir fundo branco, preto ou transparente

## Output Format

```
=== IMAGENS BAIXADAS ===

🖼️  Slide 1 → Nubank (company)
    Arquivo: output/images/slide-01-ref.webp
    Tamanho: 42KB
    Fonte: https://...

🖼️  Slide 3 → Banco Central (company)
    Arquivo: output/images/slide-03-ref.png
    Tamanho: 18KB
    Fonte: https://...

🖼️  Slide 5 → Roberto Campos Neto (person)
    Arquivo: output/images/slide-05-ref.jpg
    Tamanho: 95KB
    Fonte: https://...

🖼️  Slide 7 → Brasil (location)
    Arquivo: output/images/slide-07-ref.jpg
    Tamanho: 63KB
    Fonte: https://...

---
✅ 4/4 imagens salvas em squads/carousel-noticias/output/images/
   index.json atualizado com mapeamento slide → arquivo
```

## Quality Criteria

- [ ] Pasta `output/images/` contém um arquivo `slide-0N-ref.*` para cada entidade declarada (até 4 — slides 1, 3, 5 ou 7)
- [ ] Arquivos nomeados conforme o `slide` definido pelo Caio em `=== ENTIDADES ===`
- [ ] `index.json` criado com campo `slide` em cada entrada
- [ ] Nenhuma imagem selecionada contém texto sobreposto visível
- [ ] Arquivos têm tamanho > 1KB (não corrompidos)
- [ ] Quando `entities` está vazio: `index.json` gerado com `images: []` e nenhum download executado

## Veto Conditions

Rejeitar e refazer se:
1. Entidades em `entities` ficaram em `pending_manual_download` sem tentativa via Playwright
2. Arquivo de imagem corrompido ou com tamanho 0
3. Imagem selecionada contém texto impresso visível
4. Qualquer imagem foi inventada, descrita ou referenciada sem que um arquivo real tenha sido baixado
5. Arquivos não seguem a nomenclatura `slide-0N-ref.*`
