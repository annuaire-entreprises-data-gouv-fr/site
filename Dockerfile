# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:22.22-alpine
ARG PNPM_VERSION=11.1.2
ARG ENVIRONMENT=production
ARG BUILD_DATE
ARG BUILD_VERSION=main
ARG BUILD_REVISION
ARG MAX_OLD_SPACE_SIZE=2048


FROM ${NODE_IMAGE} AS base

LABEL org.opencontainers.image.created="${BUILD_DATE}"
LABEL org.opencontainers.image.authors="https://github.com/annuaire-entreprises-data-gouv-fr/site/graphs/contributors"
LABEL org.opencontainers.image.url="https://github.com/annuaire-entreprises-data-gouv-fr/site"
LABEL org.opencontainers.image.documentation="https://github.com/annuaire-entreprises-data-gouv-fr/site/blob/main/README.md"
LABEL org.opencontainers.image.source="https://github.com/annuaire-entreprises-data-gouv-fr/site"
LABEL org.opencontainers.image.version="${BUILD_VERSION}"
LABEL org.opencontainers.image.revision="${BUILD_REVISION}"
LABEL org.opencontainers.image.vendor="annuaire-entreprises-data-gouv-fr"
LABEL org.opencontainers.image.licenses="MIT License"
LABEL org.opencontainers.image.title="Site Annuaire des Entreprises"
LABEL org.opencontainers.image.description="Image Docker du site de l'Annuaire des Entreprises"
LABEL org.opencontainers.image.base.name="node:20"
LABEL org.opencontainers.image.base.digest=""

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
