<h1 align="center">
  <img src="https://github.com/etalab/annuaire-entreprises-site/blob/main/public/images/annnuaire-entreprises.svg" width="400px" />
</h1>

Dépôt du site [Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr). Pour [l’API Recherche d’Entreprises](https://api.gouv.fr/les-api/api-recherche-entreprises), consultez le [dépôt de l’API](https://github.com/etalab/annuaire-entreprises-search-api).

Ce site met à disposition des citoyens et des agents les données ouvertes (open-data) des entreprises, associations et administrations dotées d'un n° SIREN/SIRET.

## Statuts

[![CI (lint, unit-tests, end2end, a11y)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/pre-merge.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/pre-merge.yml)
[![Recipe on staging](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/recipe-staging.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/recipe-staging.yml)
[![SEO](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/seo.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/seo.yml)
[![Deploy - Staging](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-staging.yml/badge.svg?branch=main)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-staging.yml)
[![Deploy - Production](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-production.yml)
![Page entreprise](https://img.shields.io/uptimerobot/status/m787859483-e754b64b78a0c30eea102880?label=Page%20entreprise&logo=Page%20entreprise)
![Recherche](https://img.shields.io/uptimerobot/status/m787859512-adcc5cd05674366504f96c86?label=Recherche&logo=Page%20entreprise)

**Disponibilités des APIs utilisées par le site :**

Pour voir le détail des disponibilités des API utilisées sur le site, [consultez la page de statut](https://annuaire-entreprises.data.gouv.fr/donnees/api).

## Contenu

### Comment contribuer ?

Vous êtes un contributeur exterieur ? [Soumettez-nous une nouvelle issue ou une pull request.](https://github.com/etalab/annuaire-entreprises-site/issues/new/choose)

Vous faîtes partie de l’équipe contenu ? [Consultez le tutoriel.](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/tree/main/CONTRIBUTE-CONTENT.md)

### Vie privée et siren protégés

Pour modifier la liste des siren protégés en diffusion [mettre à jour la liste suivante](https://github.com/etalab/annuaire-entreprises-site/edit/main/public/protected-siren.txt)

## Dépôts liés 🏗

Ce dépôt fait partie d'un ensemble de dépôts qui constituent l'[Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr) :

| Description                         | Accès                                                                       |
| ----------------------------------- | --------------------------------------------------------------------------- |
| Le site Web                         | [par ici 👉](https://github.com/etalab/annuaire-entreprises-site)           |
| L’API du Moteur de recherche        | [par ici 👉](https://github.com/etalab/annuaire-entreprises-search-api)     |
| Pipeline ETL                        | [par ici 👉](https://github.com/etalab/annuaire-entreprises-search-infra)   |
| Le proxy API du site                | [par ici 👉](https://github.com/etalab/annuaire-entreprises-api-proxy)      |
| Tests de pertinence de la recherche | [par ici 👉](https://github.com/etalab/annuaire-entreprises-search-testing) |

## Développement

### Choix d’architecture du site

Pour des raisons de [performances](https://pagespeed.web.dev/analysis/https-annuaire-entreprises-data-gouv-fr-entreprise-danone-552032534/z9b3dtu5dl?form_factor=mobile), ce site utilise Next.js de manière modifiée :

- en developpement, next.js tourne de manière normale.
- en production, la ré-hydratation de react dans le navigateur est uniquement activée sur les pages où c'est pertinent. Pour le reste des pages, Next.js est utilisé comme un framework de rendu serveur traditionnel (type Django ou Rails).

### Outils

Nous utilisons [Commit-lint](https://commitlint.js.org/#/) avec [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#why-use-conventional-commits)

[L'extension Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) avec la configuration ci-dessous permet de corriger les problèmes de linting automatiquement :

```
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
```

### Installation

#### Prérequis

Le projet nécessite node > 18 et redis installé pour être lancé en local.

- [Installer Node](https://nodejs.org/en/download/package-manager)
- [Installer Redis](https://redis.io/docs/getting-started/installation/)

```bash
# Installation
npm i

# Lancer le site en dev
npm run dev

# Lancer le site en prod
npm run build && npm run start
```

### Tests

1. Linter

```bash
npm run lint
```

2. Tests unitaires

```bash
npm run test:unit
```

3. Tests end2end

```bash
npm run test:end2end
```

4. Tests end2end sur staging (Recipe on staging)

```bash
npm run test:recipe-staging
```

## Deploiement

Le déploiement se fait par [Github action](https://github.com/etalab/annuaire-entreprises-site/actions)

A chaque "merge" sur master :

- Laissez le déploiement se faire automatiquement sur [staging](https://staging.annuaire-entreprises.data.gouv.fr) via l'action [deploy-staging](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/deploy-staging.yml)
- Vérifiez vos changements sur [staging](https://staging.annuaire-entreprises.data.gouv.fr)
- Vérifiez que les tests end2end passent sur [recipe-staging](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/recipe-staging.yml)
- Lancez manuellement le déploiement sur [production](https://annuaire-entreprises.data.gouv.fr) : sur [deploy-production](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/deploy-production.yml) et cliquez sur "Run workflow" -> "Run workflow"

NB: Si plusieurs déploiements sont déclenchés en même temps, seul le premier va jusqu'au bout. Les autres sont automatiquement interrompus.

## Sitemap & scripts SEO

Le script SEO est déclenché deux fois par mois par une github action.
Il génère :

- un ensemble de sitemaps listant les ~8M d'unite legales (~200 fichiers)
- un arbre de page de resultats statiques avec les ~8M d’UL (~200 000 fichiers)

Les fichiers sont compressés puis stockés dans un artifact et téléchargés lors du déploiement sur les différents environnements.

Le script est dans son propre dossier, avec son propre `package.json` et sa propre config `typescript`.

Pour lancer le script :

```bash
cd seo-script
npm run build:seo
```

## Licence

Ce projet est sous AGPL 3.0
