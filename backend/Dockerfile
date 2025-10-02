# build stage
FROM node:22.15-alpine AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --production=false
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# runtime stage
FROM node:22.15-alpine AS runtime
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --production=true
COPY --from=build /usr/src/app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/server.js"]