FROM node:22-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

FROM base AS development

RUN pnpm install --frozen-lockfile

COPY . .

CMD ["pnpm", "run", "dev"]

FROM base AS builder

ARG VITE_API_BASE_URL

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM base AS production

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/.output ./.output

ENV NODE_ENV=production
ENV HOST=0.0.0.0

CMD ["pnpm", "run", "start"]
