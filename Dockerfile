# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:22.22-alpine
ARG PNPM_VERSION=11.1.2

FROM ${NODE_IMAGE} AS base

ARG PNPM_VERSION
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"

WORKDIR /app

RUN corepack enable \
  && corepack prepare "pnpm@${PNPM_VERSION}" --activate \
  && pnpm --version

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile --prod=false --ignore-scripts

FROM deps AS build

COPY . .

ENV NODE_ENV=production

RUN pnpm run build

FROM base AS prod-deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
  pnpm install --frozen-lockfile --prod --ignore-scripts

FROM ${NODE_IMAGE} AS runner

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY --from=prod-deps --chown=node:node /app/package.json ./package.json
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.output ./.output

USER node

EXPOSE 3000

CMD ["node", "--import", "./.output/server/instrument.server.mjs", ".output/server/index.mjs"]
