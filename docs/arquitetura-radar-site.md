# Arquitetura sugerida: Radar Prometria + Site

## Objetivo
Criar um workflow novo e paralelo aos workflows atuais, sem mexer no que já está funcionando.

## Fluxo recomendado

1. Ler fontes de produtos/categorias/campanhas.
2. Buscar produtos/ofertas/campanhas.
3. Validar dados mínimos:
   - título
   - imagem
   - preço atual
   - preço original, quando houver
   - link afiliado
   - marketplace
   - disponibilidade
4. Calcular score da oferta:
   - desconto
   - avaliação
   - vendas
   - risco de variação
   - categoria
   - classificação da curadoria
5. Decidir destino:
   - enviar para grupos
   - publicar no site
   - manter em backup
   - rejeitar
6. Atualizar base central `CATALOGO_SITE`.
7. Gerar `data/produtos.json`.
8. Atualizar GitHub Pages via commit automático.
9. Revalidar ofertas ativas periodicamente.
10. Marcar como EXPIRADO/REMOVER quando perder preço, estoque, cupom ou link.

## Status sugeridos

- ATIVO: aparece no site
- PAUSADO: não aparece, mas fica salvo
- EXPIRADO: saiu do site
- REMOVER: limpar em manutenção
- BACKUP: produto bom, mas ainda não publicado
- REJEITADO: não usar

## Campos mínimos do site

- id
- titulo
- descricao
- categoria
- marketplace
- preco_atual
- preco_original
- desconto
- cupom
- link_afiliado
- imagem_url
- status_site
- selo
- score
- vendas
- avaliacao
- ultima_verificacao

## Observação
Os workflows atuais não precisam ser alterados no primeiro momento. A saída para o site deve ser uma camada nova e independente.
