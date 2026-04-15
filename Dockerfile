# BASE
FROM node:20-alpine as base

ARG ENVIRONMENT=production
ARG BUILD_DATE
ARG BUILD_VERSION=main
ARG BUILD_REVISION
ARG MAX_OLD_SPACE_SIZE=2048

WORKDIR /app

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

ENV NODE_OPTIONS="--max-old-space-size=${MAX_OLD_SPACE_SIZE}"
ENV NODE_ENV=$ENVIRONMENT

# INSTALL
FROM base as install
COPY package.json package-lock.json .
COPY . .
RUN npm ci --include=dev --ignore-scripts

# BUILDER
FROM install as builder
RUN npm run build

# RELEASE
FROM base as release
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

CMD ["npm", "run", "start"]
