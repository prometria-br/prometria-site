# Como adicionar links, ofertas e cupons no site

## 1. Links de redes sociais e grupos

Os links já estão configurados em:

```txt
data/settings.json
data/channels.json
```

Links configurados:

```txt
WhatsApp: https://chat.whatsapp.com/C0VK6VCA1797UNlwfASj78
Telegram: https://t.me/prometriabr
Instagram: https://www.instagram.com/prometriabr/
TikTok: https://www.tiktok.com/@prometriabr
X/Twitter: https://x.com/Prometriabr
Linktree: https://linktr.ee/prometria
E-mail: prometriabr@gmail.com
```

A página `redes.html` deve ler/exibir esses canais.

## 2. Como adicionar ofertas

Abra:

```txt
data/offers.json
```

Hoje ele está vazio para não inventar produto nem preço.

Para adicionar uma oferta real, coloque um item assim:

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

Só aparecem ofertas com:

```txt
status: "ativo"
```

Se quiser esconder uma oferta:

```json
"status": "inativo"
```

## 3. Como adicionar cupons

Abra:

```txt
data/coupons.json
```

Para adicionar um cupom real:

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

O site não deve exibir cupons com:

```txt
classificacao: "fraco"
classificacao: "rejeitado"
status: "inativo"
status: "esgotado"
```

## 4. Arquivos de exemplo

Use como modelo:

```txt
data/offers.example.json
data/coupons.example.json
```

Não publique ofertas sem preço real validado.
