<h1 align="center">
  <img src="https://github.com/annuaire-entreprises-data-gouv-fr/site/blob/main/public/images/annuaire-entreprises-paysage-large.gif" width="400px" />
</h1>

<a href="https://github.com/annuaire-entreprises-data-gouv-fr/site/blob/main/LICENSE"><img src="https://img.shields.io/github/license/annuaire-entreprises-data-gouv-fr/site.svg?color=green" alt="License Badge"></a>
[![CI (lint, unit-tests, end2end, a11y)](https://github.com/annuaire-entreprises-data-gouv-fr/site/actions/workflows/pre-merge.yml/badge.svg)](https://github.com/annuaire-entreprises-data-gouv-fr/site/actions/workflows/pre-merge.yml)
[![External API check](https://github.com/annuaire-entreprises-data-gouv-fr/site/actions/workflows/external-api-test.yml/badge.svg)](https://github.com/annuaire-entreprises-data-gouv-fr/site/actions/workflows/external-api-test.yml)
[![Deploy](https://github.com/annuaire-entreprises-data-gouv-fr/site/actions/workflows/deploy.yml/badge.svg)](https://github.com/annuaire-entreprises-data-gouv-fr/site/actions/workflows/deploy.yml)
<a href="https://annuaire-entreprises.data.gouv.fr/administration"><img src="https://img.shields.io/badge/Page-partenaires-blue.svg" alt="Partenaires Badge"></a>
<a href="https://annuaire-entreprises.data.gouv.fr/donnees/sources"><img src="https://img.shields.io/badge/Page-datasources-blue.svg" alt="Sources de données Badge"></a>
<a href="https://annuaire-entreprises.data.gouv.fr/donnees/api"><img src="https://img.shields.io/badge/Page-statuts-blue.svg" alt="Statut des API Badge"></a>
<a href="https://annuaire-entreprises.data.gouv.fr/historique-des-modifications"><img src="https://img.shields.io/badge/Page-changelog-blue.svg" alt="Changelog Badge"></a>
<a href="https://annuaire-entreprises.data.gouv.fr/a-propos/stats"><img src="https://img.shields.io/badge/Page-stats-blue.svg" alt="Statistiques Badge"></a>

Dépôt du site [L'Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr). Pour [l’API Recherche d’Entreprises](https://www.data.gouv.fr/fr/dataservices/api-recherche-dentreprises/), consultez le [dépôt de l’API](https://github.com/annuaire-entreprises-data-gouv-fr/search-api).

Ce site met à disposition des citoyens et des agents les données ouvertes (open-data) des entreprises, associations et administrations dotées d'un n° SIREN/SIRET.

Ce site ré-utilise les données des différentes [administrations partenaires](https://annuaire-entreprises.data.gouv.fr/administration).

## Contenu

### Comment contribuer ?

Vous êtes un contributeur exterieur ? [Soumettez-nous une nouvelle issue ou une pull request.](https://github.com/annuaire-entreprises-data-gouv-fr/site/issues/new/choose)

Vous faîtes partie de l’équipe contenu ? [Consultez le tutoriel.](https://github.com/annuaire-entreprises-data-gouv-fr/site/tree/main/CONTRIBUTE-CONTENT.md)

### Vie privée et siren protégés

Pour protéger un siren et en limiter la diffusion [suivez la procédure](https://annuaire-entreprises.data.gouv.fr/faq/supprimer-donnees-personnelles-entreprise).

## Dépôts liés 🏗

Voici la liste des dépôts de code du projet [L'Annuaire des Entreprises](https://annuaire-entreprises.data.gouv.fr) :

| Description                         | Accès                                                                             |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| Le site Web                         | [par ici 👉](https://github.com/annuaire-entreprises-data-gouv-fr/site)           |
| Les actions SEO                     | [par ici 👉](https://github.com/annuaire-entreprises-data-gouv-fr/seo)            |
| L’API du Moteur de recherche        | [par ici 👉](https://github.com/annuaire-entreprises-data-gouv-fr/search-api)     |
| Pipeline ETL                        | [par ici 👉](https://github.com/annuaire-entreprises-data-gouv-fr/search-infra)   |
| Le proxy API du site                | [par ici 👉](https://github.com/annuaire-entreprises-data-gouv-fr/api-proxy)      |
| Tests de pertinence de la recherche | [par ici 👉](https://github.com/annuaire-entreprises-data-gouv-fr/search-testing) |
| Authentification des outils d’admin | [par ici 👉](https://github.com/annuaire-entreprises-data-gouv-fr/admin-auth)     |

## Développement

### Outils

Le site est une application React construite avec [TanStack Start](https://tanstack.com/start), [TanStack Router](https://tanstack.com/router), Vite et Nitro.

Nous utilisons [pnpm](https://pnpm.io/) comme gestionnaire de paquets, [Vitest](https://vitest.dev/) pour les tests unitaires et [Playwright](https://playwright.dev/) pour les tests end-to-end.

Nous utilisons [Commit-lint](https://commitlint.js.org/#/) avec [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#why-use-conventional-commits).

### Installation

#### Prérequis

Le projet nécessite [node](https://github.com/nvm-sh/nvm) et pnpm. Les versions attendues sont déclarées dans `package.json` et `.nvmrc`.

```bash
# Activer pnpm via Corepack si nécessaire
corepack enable

# Installer les dépendances
pnpm install

# Copier le fichier .env
cp .env.dev .env

# Lancer le site en développement
pnpm dev

# Compiler et lancer le serveur de production Nitro
pnpm build && pnpm start
```

Le serveur de développement est disponible par défaut sur `http://localhost:3000`.

Les commandes `pnpm dev` et `pnpm build` compilent automatiquement les données YAML en JSON via `pnpm compile:data`.

#### node-gyp error on mac

In some case you might need to update xcode command line tools to install dependencies

```
sudo rm -rf /Library/Developer/CommandLineTools
xcode-select --install
```

### Tests

1. Linter

```bash
pnpm lint
```

2. TypeScript

```bash
pnpm typecheck
```

3. Tests unitaires Vitest

```bash
pnpm test:unit
```

4. Tests API calls

```bash
pnpm test:api-clients
```

5. Tests de génération des fixtures de recherche d'entreprise

```bash
pnpm test:e2e:api-recherche
```

Pour mettre à jour les snapshots Vitest associés :

```bash
pnpm test:api-clients:update-snapshots
pnpm test:e2e:api-recherche:update-snapshots
```

6. Tests end-to-end Playwright

```bash
pnpm test:end2end:run
```

Pour ouvrir l'interface Playwright :

```bash
pnpm test:end2end:open
```

## Deploiement

Le déploiement se fait par [Github action](https://github.com/annuaire-entreprises-data-gouv-fr/site/actions)

A chaque "merge" sur master :

- Laissez le déploiement se faire automatiquement sur [staging](https://staging.annuaire-entreprises.data.gouv.fr) via l'action [deploy-staging](https://github.com/annuaire-entreprises-data-gouv-fr/site/actions/workflows/deploy-staging.yml)
- Vérifiez vos changements sur [staging](https://staging.annuaire-entreprises.data.gouv.fr)
- Vérifiez que les tests end2end passent sur [recipe-staging](https://github.com/annuaire-entreprises-data-gouv-fr/site/actions/workflows/recipe-staging.yml)
- Lancez manuellement le déploiement sur [production](https://annuaire-entreprises.data.gouv.fr) : sur [deploy-production](https://github.com/annuaire-entreprises-data-gouv-fr/site/actions/workflows/deploy-production.yml) et cliquez sur "Run workflow" -> "Run workflow"

NB: Si plusieurs déploiements sont déclenchés en même temps, seul le premier va jusqu'au bout. Les autres sont automatiquement interrompus.

## Sitemap & scripts SEO

Les actions SEO vivent dans le dépôt dédié [annuaire-entreprises-data-gouv-fr/seo](https://github.com/annuaire-entreprises-data-gouv-fr/seo).

Le script SEO est déclenché deux fois par mois par une GitHub Action. Il génère :

- un ensemble de sitemaps listant les ~8M d'unite legales (~200 fichiers)
- un arbre de page de resultats statiques avec les ~8M d’UL (~200 000 fichiers)

Les fichiers sont compressés puis stockés dans un artifact et téléchargés lors du déploiement sur les différents environnements.

## Licence

Le code source est publié par la Direction interministérielle du numérique sous [licence MIT](LICENSE).

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
