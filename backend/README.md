
# Backend — node-vue-lead-app

Resumo rápido
-------------
Este diretório contém a API backend escrita em TypeScript/Express que gerencia leads de clientes e autenticação. A API está preparada para rodar em desenvolvimento com `ts-node-dev` e em produção compilada (`tsc`) e executada a partir da pasta `dist`.

Principais responsabilidades
- Receber e validar criação/edição/exclusão de leads
- Buscar leads (lista, por id ou por email/nome)
- Exportar leads para CSV
- Autenticação (login/register) e rota protegida de exemplo
- Proteções: CORS configurável, rate limiting (global + endpoints de auth)

Como rodar localmente (rápido)
------------------------------
Requisitos: Node 18/20/22, npm, (opcional) Docker / docker-compose.

1) Instalar dependências (pasta `backend`):

```powershell
cd backend
npm install
```

2) Variáveis de ambiente
Crie um arquivo `.env` ou exporte as variáveis necessárias. Exemplos de variáveis usadas no projeto:

- `PORT` — porta que o servidor deve escutar (ex.: 4000)
- `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD` — usados no `docker-compose` para o container do Mongo;
- `LOCAL_CLIENT_URL`, `PROD_CLIENT_URL` — origens permitidas para CORS em dev/produçã0;
- `JWT_SECRET` — segredo para tokens JWT (se aplicável nas rotas auth);

O projeto também usa `@dotenvx/dotenvx` para carregar variáveis em desenvolvimento.

1) Rodar em dev:

```powershell
npm run dev
```

4) Build e start em produção (local):

```powershell
npm run build
npm start
```

Observação com Docker (local):
O repositório inclui um `docker-compose.yml` que monta serviços (mongo, backend, frontend). Para desenvolvimento local você pode usar `docker-compose up -d` a partir da raiz do projeto (precisa configurar as variáveis de ambiente usadas no compose).

Rotas expostas (documentação simples)
----------------------------------
Base URL: / (as rotas abaixo já incluem o caminho completo)

Auth
- POST /api/auth/register
	- Corpo (JSON): { name?, email, password }
	- Validação: email requerido e em formato válido; password requerido
	- Resposta: 201 criado ou 400 com erros de validação

- POST /api/auth/login
	- Corpo (JSON): { email, password }
	- Resposta: 200 + token/cookie de sessão (dependendo da implementação), ou 401

- GET /api/protected
	- Rota protegida: exige token/cookie (middleware `authenticateToken`)
	- Retorna 200 com { message, user } se autenticado

Leads (client leads)
- GET /api/leads
	- Retorna array de leads (DTO) — 200
	- Se nenhum lead encontrado atualmente o controller retorna 404

- GET /api/leads/:id
	- Parâmetros: id (path)
	- Retorna lead DTO ou 404/500

- GET /api/leads/search?email=...&name=...
	- Query params: `email` (string) e/ou `name` (string)
	- Busca por email ou nome (um ou outro)

- POST /api/leads
	- Corpo (JSON): ICreateLead (ex.: name, email, phone, jobTitle, birthDate, message, utm fields...)
	- Validação via `express-validator` (nome, email, phone, jobTitle, birthDate, message)
	- Retorna 201 com objeto criado ou 400 com erros de validação

- PUT /api/leads/:id
	- Atualiza lead por id com os mesmos campos do POST

- DELETE /api/leads/:id
	- Remove lead por id

Exportação CSV
- GET /api/leads/:id/csv  (nota: a implementação atual do serviço `getLeadAsCsv` retorna todos os leads se chamada sem id — ver código)
	- Retorna `text/csv` com attachment `leads.csv`

Validação e formatos
- O projeto valida entrada com `express-validator`. Exemplos de validação: `email` deve ser um email válido; `phone` tem validação customizada (limpa números e testa regex de DDD/9 dígitos);
- `birthDate` aceita formato de data — no frontend normalmente é um input date; se necessário, o backend possui transformações para formatação.

Rate limiting
- Foi adicionado `express-rate-limit` no `app.ts` para um limite global conservador (100 req/min por IP) e um limiter mais rígido nas rotas de autenticação (`/api/auth/login` e `/api/auth/register`) para mitigar brute-force (10 req por 15min).
- Em produção com múltiplas instâncias recomenda-se usar um store compartilhado (por exemplo Redis) para o rate limiter.

CORS
- Em ambiente de desenvolvimento a aplicação permite origens listadas em `LOCAL_CLIENT_URL` e `PROD_CLIENT_URL`. Em produção o valor de `origin` no CORS deve ser ajustado para a origem do frontend.

Persistência de tracking (UTM/gclid/fbclid)
- O frontend persiste automaticamente parâmetros de campanha (utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid) em `localStorage` e os reenvia quando o formulário de lead é submetido.

Onde olhar no código
- `src/app.ts` — configuração do Express (CORS, cookieParser, rate limiter global).
- `src/routes/clientLeadRoute.ts` — rotas relacionadas a leads.
- `src/routes/authRoute.ts` — rotas de autenticação; middleware `authenticateToken` em `src/middlewares/authToken.ts`.
- `src/services/clientLeadService.ts` — lógica de acesso a dados e transformação DTO/CSV.
- `src/tools/apiInputValidator.ts` — regras de validação para criação/atualização de lead.

Contribuição e manutenção
- Para rodar localmente use o `docker-compose.yml` ou os scripts `npm run dev` / `npm run build` + `npm start`.
- Adicione testes e cobertura conforme for necessário; atualmente não há testes automatizados nesta pasta.

