# node-vue-lead-app

Aplicação fullstack de exemplo para captura e gestão de leads.

Visão geral
-----------
Este repositório contém duas partes principais:

- `backend/` — API em Node.js + Express (TypeScript) que gerencia leads, autenticação, validação e exportação CSV.
- `frontend/leads-vue/` — aplicação cliente em Vue 3 + Vite + Vuetify para cadastro público de leads e painel administrativo.

Cada área tem seu próprio README com instruções mais detalhadas:

- `backend/src/readme.md` — documentação e rotas do backend.
- `frontend/leads-vue/README.md` — como rodar o frontend, variáveis Vite e deploy.

Quick start (desenvolvimento)
----------------------------
Recomenda-se usar o `docker-compose.yml` para levantar todos os serviços localmente (Mongo, backend e frontend).

1. Copie/defina variáveis de ambiente necessárias (ex.: .env local).
2. Na raiz do projeto rode:

```powershell
docker-compose up -d
```

Ou, se preferir rodar localmente sem Docker, siga as instruções dentro de `backend/` e `frontend/leads-vue/`


Veja os READMEs específicos dentro das pastas `backend` e `frontend/leads-vue` para instruções completas.

