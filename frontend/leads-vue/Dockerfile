# build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE
ENV VITE_API_BASE=${VITE_API_BASE}

RUN if [ -n "$VITE_API_BASE" ]; then echo "VITE_API_BASE=$VITE_API_BASE" > .env; fi

# Run build
RUN npm run build-only

# production stage
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]