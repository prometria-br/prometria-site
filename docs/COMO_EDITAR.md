# Como editar ofertas, cupons e links

## Ofertas
Edite `data/offers.json`.

```json
[
  {
    "id": "oferta-001",
    "nome": "Nome real do produto",
    "plataforma": "Amazon",
    "categoria": "Setup e escritório",
    "imagem": "https://link-da-imagem.jpg",
    "precoAtual": 288.90,
    "precoAntigo": 323.90,
    "cupom": "PODECOMPRAR",
    "precoComCupom": 253.90,
    "linkAfiliado": "https://seu-link-afiliado.com",
    "status": "ativo",
    "validade": "2026-12-31T23:59:00-03:00",
    "destaque": true,
    "observacao": "Preço e disponibilidade podem mudar."
  }
]
```

## Cupons
Edite `data/coupons.json`.

```json
[
  {
    "id": "cupom-001",
    "plataforma": "Amazon",
    "nomeCampanha": "Cupom Amazon",
    "codigo": "PODECOMPRAR",
    "desconto": "R$ 35 OFF",
    "valorMinimo": "R$ 299",
    "categoria": "Geral",
    "linkCampanha": "https://seu-link-afiliado.com",
    "status": "ativo",
    "validade": "2026-12-31T23:59:00-03:00",
    "classificacao": "forte",
    "observacao": "Sujeito a alteração."
  }
]
```

O site não exibe cupons `fraco`, `rejeitado`, `inativo` ou vencidos.

## Links sociais
Edite `data/channels.json` ou `data/settings.json`.