<h1 align="center">
  <img src="https://github.com/etalab/annuaire-entreprises-site/blob/main/public/images/annnuaire-entreprises.svg" width="400px" />
</h1>

Dépôt du site [Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr). Pour [l’API Recherche d’Entreprises](https://api.gouv.fr/les-api/api-recherche-entreprises), consultez le [dépôt de l’API](https://github.com/etalab/annuaire-entreprises-search-api).

Ce site met à disposition des citoyens et des agents les données ouvertes (open-data) des entreprises, associations et administrations dotées d'un n° SIREN/SIRET.

## Statuts

[![CI (lint, unit-tests, end2end, a11y)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/pre-merge.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/actions/workflows/pre-merge.yml)
[![External API check](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/external-api-test.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/external-api-test.yml)
[![SEO](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/seo.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/seo.yml)
[![Deploy](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/deploy.yml/badge.svg)](https://github.com/etalab/annuaire-entreprises-site/actions/workflows/deploy.yml)

**Disponibilités des APIs utilisées par le site :**

Pour voir le détail des disponibilités des API utilisées sur le site, [consultez la page de statut](https://annuaire-entreprises.data.gouv.fr/donnees/api).

## Contenu

### Comment contribuer ?

Vous êtes un contributeur exterieur ? [Soumettez-nous une nouvelle issue ou une pull request.](https://github.com/etalab/annuaire-entreprises-site/issues/new/choose)

Vous faîtes partie de l’équipe contenu ? [Consultez le tutoriel.](https://github.com/etalab/annuaire-entreprises.data.gouv.fr/tree/main/CONTRIBUTE-CONTENT.md)

### Vie privée et siren protégés

Pour protéger un siren et en limiter la diffusion [suivez la procédure](https://annuaire-entreprises.data.gouv.fr/faq/supprimer-donnees-personnelles-entreprise).

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

### Installation

#### Prérequis

Le projet nécessite node > 18 et redis installé pour être lancé en local.

- [Installer Node](https://nodejs.org/en/download/package-manager)
- [Installer Redis](https://redis.io/docs/getting-started/installation/)

```bash
# Installation
npm i

# Copier le fichier .env
cp .env.dev .env

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

4. Tests API calls

```bash
npm run test:api-clients
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

## Remontée d'erreur

Nous utilisons [Sentry](https://errors.data.gouv) pour remonter les erreurs du site. Voici les bonnes pratiques à suivre pour remonter une erreur :

1. **Utiliser le bon niveau d'erreur**

- `fatal` : une erreur qui empêche tout ou une partie du site de fonctionner. Une page d'erreur est affichée à l'utilisateur.
- `logErrorInSentry` : une fonctionnalité importante du site ne fonctionne pas.
- `logWarningInSentry` : une fonctionnalité mineure du site ne fonctionne pas. Un comportement imprévu est arrivé. Non bloquant pour l'utilisateur.
- `logInfoInSentry` : information sur le comportement du site

2. **Logguer des erreurs et non des string**. Cela permet d'avoir les stacktrace complètes et uniformise l'affichage dans sentry. Pour cela, vous pouvez vous aider de la classe `Exception`

```typescript
  logErrorInSentry(new Exception({ name: 'RedisClientFailException' });
```

3. **Remonter des erreurs métiers** : l'erreur doit informer sur ce qui n'a pas fonctionné du point de vue de l'utilisateur. Vous pouvez utiliser le paramètre `cause` pour logguer l'erreur technique à l'origine de l'erreur métier. Vous pouvez également ajouter des informations contextuelles sur l'erreur via le paramètre `context`.

```typescript
try {
  // ...
} catch (e) {
  logErrorInSentry(
    new Exception({
      name: 'AgentConnectionFailedException',
      message: 'Error during authentication',
      cause: e,
      context: {
        siren,
        siret,
        details: agentId,
      },
    })
  );
}
```

4. **Utiliser des classes d'erreur spécialisée**.

- `Exception` : erreur métier
- `InternalError` : bug interne du code qui n'est **jamais** supposé arriver
- `FetchRessourceException` : erreur lors d'un appel à une API externe

Vous pouvez en créer d'autres en étendant la classe `Exception`.
