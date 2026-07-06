# Como subir no GitHub

1. Extraia o ZIP.
2. Abra a pasta extraída.
3. Selecione o conteúdo interno, não a pasta inteira.
4. No GitHub, vá em `Code > Add file > Upload files`.
5. Arraste estes itens para a raiz do repositório:
   - `index.html`
   - `.nojekyll`
   - `assets/`
   - `data/`
   - `docs/`
   - `ofertas/`
   - `cupons/`
   - `categorias/`
   - `sites/`
   - `aprovados/`
   - `grupos/`
   - `README.md`
6. Clique em `Commit changes`.

## Erro comum

Errado:

```txt
prometria-site/
└── prometria-site-v3-multipaginas-real/
    ├── index.html
    └── ofertas/
```

Certo:

```txt
prometria-site/
├── index.html
├── ofertas/
└── cupons/
```