# Prometria Site V2 — páginas separadas

Versão reorganizada do site Prometria para GitHub Pages.

## Estrutura

- `index.html` — página inicial institucional
- `ofertas/` — vitrine de produtos com busca/filtros
- `cupons/` — campanhas e cupons ativos
- `categorias/` — navegação por categoria
- `sites/` — navegação por loja/marketplace
- `aprovados/` — produtos aprovados/curadoria forte
- `grupos/` — WhatsApp, Telegram e redes sociais
- `data/produtos.json` — base de produtos
- `data/campanhas.json` — base de campanhas/cupons
- `data/config.json` — links oficiais

## Como subir no GitHub

1. Extraia o ZIP.
2. Envie todo o conteúdo para a raiz do repositório `prometria-site`.
3. Faça commit.
4. Aguarde o GitHub Pages atualizar.

## Observação

O site não busca diretamente nos marketplaces. Ele lê os arquivos JSON da pasta `data/`.
Quando a automação ficar pronta, ela poderá atualizar `produtos.json` e `campanhas.json`.
