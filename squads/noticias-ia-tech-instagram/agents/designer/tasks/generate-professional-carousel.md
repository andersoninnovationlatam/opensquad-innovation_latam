---
task: "Generate professional carousel"
order: 2
input: |
  - verification: verification-news.md com resultado PASS
  - instagram_draft: Roteiro e legenda aprovados
output: |
  - manifest: ENTREGA.md com lista de ficheiros PNG e instruções ao gestor
  - assets: slide-NN.png em carousel-package/
---

# Generate professional carousel

Só executa se a verificação anterior for **PASS**. Gera slides profissionais 1080×1440 (3:4), tipografia hierárquica, ritmo de cor e slide de créditos.

## Process

1. Confirmar leitura de `verification-news.md` com `PASS`. Se `FAIL`, abortar e não gerar imagens.
2. Ler **`pipeline/data/carousel-visual-language.md`** e os PNGs em **`pipeline/assets/examples/`** como referência de estilo (notícia tech, contraste, hierarquia tipográfica).
3. Carregar roteiro slide-a-slide do `instagram-draft.md` aprovado; mapear cada slide a headline + apoio.
4. **HTML primeiro, depois PNG:** criar layouts em **HTML/CSS** (um ficheiro por slide ou gerador) que reproduzam o “look” dos exemplos (fundo escuro, acento amarelo, serif+sans). Cada slide deve ter **imagem de fundo ilustrativa** (tema alinhado ao texto) com **overlay/gradiente escuro** para o texto não competir com a foto — ver `carousel-visual-language.md`. Incluir **sempre** o logo no canto superior esquerdo via `<img src="logo.png" alt="…">` e copiar a fonte canónica **`squads/noticias-ia-tech-instagram/pipeline/assets/innovation-latam-logo.png`** para `html/logo.png` junto aos HTML (o script `render-carousel-html-to-png.mjs` faz isto automaticamente).
5. Converter HTML → PNG **1080×1440** com **`scripts/render-carousel-html-to-png.mjs`** (Playwright/Chromium). Comando típico na raiz do repo:
   `node squads/noticias-ia-tech-instagram/scripts/render-carousel-html-to-png.mjs --draft <instagram-draft.md> --png-out <carousel-package/vN>`
   - Opcional `--html-only` para pré-visualizar no browser antes do raster.
6. **Fallback:** se não for possível HTML, exportar PNG por outra via e garantir logo com `scripts/apply-innovation-logo.py`.
7. Escrever `ENTREGA.md` com lista de ficheiros (PNG + pasta `html/`), legenda, hashtags, publicação manual e nota de que a entrega segue o fluxo HTML→PNG.

## Output Format

`ENTREGA.md`:

```markdown
# Entrega — Carrossel Instagram

## Legenda (copiar)
[texto completo]

## Hashtags
#tag1 #tag2 ...

## Assets
- carousel-package/slide-01.png — Capa
- carousel-package/slide-02.png — ...
...

## Publicação
- Ordem: carregar na ordem numérica
- Formato: feed 3:4
- Publicação: manual pelo gestor
```

## Output Example

```markdown
# Entrega — Carrossel Instagram

## Legenda (copiar)
[Legenda realista de 400–800 caracteres com quebras de linha]

## Hashtags
#InteligenciaArtificial #Tech #Inovacao

## Assets
- carousel-package/slide-01.png — Capa
- carousel-package/slide-02.png — Contexto
- carousel-package/slide-08.png — Créditos

## Publicação
- Ordem: carregar na ordem numérica
- Formato: feed 3:4
- Publicação: manual pelo gestor
```

## Quality Criteria

- [ ] Todos os slides do roteiro têm imagem correspondente.
- [ ] Texto legível em mobile; hierarquia headline > apoio.
- [ ] Último slide com fonte/URL.
- [ ] **Logo Innovation Latam** visível no canto superior esquerdo em **cada** PNG.
- [ ] Estilo condiz com `carousel-visual-language.md` e exemplos em `pipeline/assets/examples/`.

## Veto Conditions

Reject and redo if ANY are true:
1. Execução com `verification-news.md` ≠ PASS.
2. Algum slide sem texto legível ou fora de 3:4.
3. Algum slide **sem** o logo Innovation Latam aplicado.
