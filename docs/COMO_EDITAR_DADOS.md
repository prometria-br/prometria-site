# Como editar ofertas e cupons

## Oferta

Adicione objetos em `data/offers.json` seguindo `data/offers.example.json`.

Campos principais:

- `nome`
- `plataforma`
- `categoria`
- `imagem`
- `precoAtual`
- `precoAntigo`
- `cupom`
- `precoComCupom`
- `linkAfiliado`
- `status`
- `validade`
- `destaque`
- `observacao`

## Cupom

Adicione objetos em `data/coupons.json` seguindo `data/coupons.example.json`.

Campos principais:

- `plataforma`
- `nomeCampanha`
- `codigo`
- `desconto`
- `valorMinimo`
- `categoria`
- `linkCampanha`
- `status`
- `validade`
- `classificacao`
- `observacao`

## Regras de exibição

- `status: ativo` aparece.
- `status: inativo`, `vencido`, `esgotado` ou qualquer outro não aparece.
- Cupom `classificacao: fraco` ou `rejeitado` não aparece.
- Se `validade` for uma data passada, o item não aparece.
