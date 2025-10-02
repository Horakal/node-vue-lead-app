# Frontend — leads-vue

Resumo rápido
-------------
Aplicação frontend em Vue 3 + Vite + Vuetify para cadastro e gerenciamento de leads. Contém componentes para formulário público, painel administrativo e integração com o backend.

Como rodar localmente
---------------------
Pré-requisitos: Node 18/20/22 e npm.

1) Instalar dependências:

```powershell
cd frontend/leads-vue
npm install
```

2) Rodar em desenvolvimento (Vite dev server):

```powershell
npm run dev
```

3) Build para produção:

```powershell
npm run build
```

4) Servir a build (preview):

```powershell
npm run preview
```
ou usar um servidor estático/NGINX

Variáveis de ambiente
---------------------
As variáveis Vite ficam com o prefixo `VITE_`.
- `VITE_API_BASE` — URL base do backend (ex.: `https://api.seudominio.com`). Se não informado, o frontend usa localhost em dev.

Onde ajustar ícones e estilos
- O projeto utiliza Material Design Icons via CDN (arquivo `index.html`) e Vuetify. Se preferir instalar localmente, rode `npm i @mdi/font` e remova o CDN.

Tracking de UTM/gclid/fbclid
- O frontend persiste parâmetros de campanha (utm_*, gclid, fbclid) em `localStorage` via `src/utils/tracking.ts` e reidrata o formulário automaticamente.

Docker / Deploy (dicas)
----------------------
- Em produção prefira gerar a build (`npm run build`) e servir os arquivos resultantes (`dist`) com um servidor estático (nginx) ou Static Site provider.
- No Render você pode usar "Static Site" com build command: `npm install && npm run build` e publish directory: `dist`.
- Se for usar Docker, prefira um Dockerfile multi-stage que faça `npm run build` na etapa de build e copie `dist` para uma imagem nginx no estágio final.


