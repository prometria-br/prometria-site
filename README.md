# Prometria Site V3 — multipáginas real

Esta versão corrige dois pontos:

1. O site não é mais uma landing page única com âncoras.
2. Os produtos de teste não exibem preços fixos para evitar valores errados no ar.

## Estrutura correta

Envie o conteúdo deste pacote para a raiz do repositório:

```txt
prometria-site/
├── index.html
├── .nojekyll
├── assets/
├── data/
├── docs/
├── ofertas/
├── cupons/
├── categorias/
├── sites/
├── aprovados/
└── grupos/
```

## URLs esperadas

```txt
https://prometria-br.github.io/prometria-site/
https://prometria-br.github.io/prometria-site/ofertas/
https://prometria-br.github.io/prometria-site/cupons/
https://prometria-br.github.io/prometria-site/categorias/
https://prometria-br.github.io/prometria-site/sites/
https://prometria-br.github.io/prometria-site/aprovados/
https://prometria-br.github.io/prometria-site/grupos/
```

## Preços

Produtos de teste estão sem preço. O card mostra "Ver preço atualizado".

Quando a automação estiver pronta, atualize `data/produtos.json` com campos como:

```json
{
  "title": "Nome do produto",
  "marketplace": "Amazon",
  "category": "Setup e escritório",
  "price": 323.90,
  "finalPrice": 288.90,
  "coupon": "PODECOMPRAR",
  "affiliateUrl": "https://..."
}
```