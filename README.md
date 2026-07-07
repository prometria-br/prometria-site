# Prometria — site estático para GitHub Pages

Site estático em HTML, CSS e JavaScript puro, preparado para GitHub Pages.

## Páginas

- `index.html` — Homepage
- `ofertas.html` — Ofertas e cupons ativos
- `sites-categorias.html` — Ofertas por site e categorias
- `redes.html` — WhatsApp, Telegram e redes sociais

## Dados editáveis

Os dados ficam em `data/`:

- `offers.json` — produtos/ofertas
- `coupons.json` — cupons/campanhas
- `categories.json` — categorias
- `platforms.json` — sites/plataformas
- `channels.json` — canais oficiais
- `settings.json` — configurações gerais

Por segurança, `offers.json` e `coupons.json` estão vazios. Assim não há ofertas, preços ou cupons inventados no site.

Use `data/offers.example.json` e `data/coupons.example.json` como referência de preenchimento.

## Publicação no GitHub Pages

Suba todo o conteúdo deste pacote na raiz do repositório.

Estrutura correta:

```txt
prometria-site/
├── index.html
├── ofertas.html
├── sites-categorias.html
├── redes.html
├── .nojekyll
├── assets/
├── data/
├── docs/
└── README.md
```

## Como ocultar ofertas/cupons

O site só exibe itens com:

```json
"status": "ativo"
```

Cupons com classificação `fraco` ou `rejeitado` não aparecem, mesmo se estiverem ativos.



## Logo oficial

Este pacote usa os arquivos de logo enviados anteriormente:

```txt
assets/img/prometria-logo-horizontal.png
assets/img/prometria-logo-vertical.jpg
assets/img/prometria-symbol.png
```

A logo principal usada no header é:

```txt
assets/img/prometria-logo-horizontal.png
```
