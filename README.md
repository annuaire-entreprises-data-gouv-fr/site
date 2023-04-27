# Annuaire des Entreprises - [Site web]

[![CI (lint, unit-tests, end2end, a11y)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/pre-merge.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/pre-merge.yml)
[![Deploy - Staging](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-staging.yml/badge.svg?branch=main)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-staging.yml)
[![Deploy - Production](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-production.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/deploy-production.yml)
![Page entreprise](https://img.shields.io/uptimerobot/status/m787859483-e754b64b78a0c30eea102880?label=Page%20entreprise&logo=Page%20entreprise)
![Recherche](https://img.shields.io/uptimerobot/status/m787859512-adcc5cd05674366504f96c86?label=Recherche&logo=Page%20entreprise)

**Statut des APIs utilisées sur le site :**

Pour voir le détail des disponibilités des API utilisées sur le site, [consultez la page de statut](https://annuaire-entreprises.data.gouv.fr/donnees/api).

Ce site est disponible en ligne : [L’Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr).

Ce site a pour vocation de mettre à disposition des citoyens et des agents les données ouvertes "Open-data" des entreprises, associations et administrations dotées d'un n° siren/siret.

## Comment contribuer ?

Vous êtes un contributeur exterieur ? [Soumettez-nous une nouvelle issue ou une pull request.](https://github.com/etalab/annuaire-entreprises-site/issues/new/choose)

Vous faîtes partie de l’équipe contenu ? [Consultez le tutoriel.](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/tree/main/CONTRIBUTE-CONTENT.md)

## Architecture du service 🏗

Ce repository fait partie d'un ensemble de services qui constituent l'[Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr) :

| Description                                                                             | Accès                                                                     |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Le site Web                                                                             | [par ici 👉](https://github.com/etalab/annuaire-entreprises-site)         |
| L’API du Moteur de recherche                                                            | [par ici 👉](https://github.com/etalab/annuaire-entreprises-search-api)   |
| Le traitement permettant la génération de données à ingérer dans le moteur de recherche | [par ici 👉](https://github.com/etalab/annuaire-entreprises-search-infra) |
| Le proxy API du site                                                                    | [par ici 👉](https://github.com/etalab/annuaire-entreprises-api-proxy)    |

## A propos des choix d'architecture

Ce site utilise Next.js de manière modifiée :

- en developpement, next.js tourne de manière normale.
- en production, la ré-hydratation de react dans le navigateur est uniquement activée sur les pages où c'est pertinent. Pour le reste des pages, Next.js se comporte comme un framework de rendu serveur traditionnel.

## Installation

```bash
# Installation
npm i

# Lancer le site en dev
npm run dev

# Lancer le site en prod
export PORT=3000
npm run build && npm run start
```

## Tooling Dev Experience

### Commitlint

Nous utilisons [commitlint](https://commitlint.js.org/#/guides-local-setup) pour vérifier que les messages.

### Bundle analyzer

[@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) is installed in this project to run an analyze use `npm run build:analyze`

### Eslint

Afin d'améliorer votre expérience de dev vous pouvez utiliser [l'extenstion Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

Ajouter la configuration ci-dessous pour fixer les problèmes de linting automatiquement

```
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
```

## Tests

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

## Deploiement

Le déploiement se fait par [Github action](https://github.com/etalab/annuaire-entreprises-site/actions)

A chaque "merge" sur master :

- Laissez le déploiement se faire automatiquement sur [staging](https://staging.annuaire-entreprises.data.gouv.fr) via l'action [deploy-staging](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/deploy-staging.yml)
- Vérifiez vos changements sur [staging](https://staging.annuaire-entreprises.data.gouv.fr)
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

## Vie privée

Pour modifier la liste des siren protégés en diffusion [mettre à jour la liste suivante](https://github.com/etalab/annuaire-entreprises-site/edit/main/public/protected-siren.txt)

## Licence

Ce projet est sous AGPL 3.0
