import { rest } from 'msw';
// Siren
import { finassure as sirenFinassure } from './siren/finassur';
import { ganymede as sirenGanymede } from './siren/ganymede';
import { grandParis as sirenGrandParis } from './siren/grand-paris';
import { laPoste as sirenLaposte } from './siren/la-poste';
import { manakinProduction as sirenManakinProduction } from './siren/manakin-production';
import { raphael as sirenRaphael } from './siren/raphael';
import { redNeedles as sirenRedNeedles } from './siren/red-needles';
import { sauvage as sirenSauvage } from './siren/sauvage';
import { severnaya as sirenSevernaya } from './siren/severnaya';
import { rge as sirenRge } from './siren/solution-energie';
// Sirets
import { finassur as siretsFinassur } from './siret-by-siren/finassure';
import { ganymede as siretsGanymede } from './siret-by-siren/ganymede';
import { grandParis as siretsGrandParis } from './siret-by-siren/grand-paris';
import { laPoste as siretLaPoste } from './siret-by-siren/la-poste';
import { essSpectacle as siretsEssSpectacle } from './siret-by-siren/manakin-production';
import { raphael as siretRaphael } from './siret-by-siren/raphael';
import { redNeedles as siretsRedNeedles } from './siret-by-siren/red-needles';
import { sauvage as siretsSauvage } from './siret-by-siren/sauvage';
import { severnaya as siretSevernaya } from './siret-by-siren/severnaya';
import { rge as siretsRge } from './siret-by-siren/solution-energie';
// Siret
import { ganymede as siretGanymede } from './siret/ganymede';
// Token
import { token } from './token';

export const handlers = [
  // Token handler
  rest.post('https://api.insee.fr/token', (_req, res, ctx) => {
    return res(ctx.json(token));
  }),
  // Siren handlers
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenRge.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(sirenRge));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenLaposte.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(sirenLaposte));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenGanymede.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(sirenGanymede));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenManakinProduction.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(sirenManakinProduction));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenGrandParis.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(sirenGrandParis));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenSauvage.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(sirenSauvage));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenFinassure.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(sirenFinassure));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenRedNeedles.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(sirenRedNeedles));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenSevernaya.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(sirenSevernaya));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sirenRaphael.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(sirenRaphael));
    }
  ),
  // Siret handler
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siret/${siretGanymede.etablissement.siret}`,
    (_req, res, ctx) => {
      return res(ctx.json(siretGanymede));
    }
  ),
  // Sirets handlers
  rest.get(
    'https://api.insee.fr/entreprises/sirene/V3/siret',
    (_req, res, ctx) => {
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(siretsRge.etablissements[0].siren)
      ) {
        return res(ctx.json(siretsRge));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(siretsEssSpectacle.etablissements[0].siren)
      ) {
        return res(ctx.json(siretsEssSpectacle));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(siretsGanymede.etablissements[0].siren)
      ) {
        return res(ctx.json(siretsEssSpectacle));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(siretsGrandParis.etablissements[0].siren)
      ) {
        return res(ctx.json(siretsGrandParis));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(siretsGrandParis.etablissements[0].siren)
      ) {
        return res(ctx.json(siretsGrandParis));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(siretsSauvage.etablissements[0].siren)
      ) {
        return res(ctx.json(siretsSauvage));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(siretsFinassur.etablissements[0].siren)
      ) {
        return res(ctx.json(siretsFinassur));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(siretsRedNeedles.etablissements[0].siren)
      ) {
        return res(ctx.json(siretsRedNeedles));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(siretSevernaya.etablissements[0].siren)
      ) {
        return res(ctx.json(siretSevernaya));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(siretLaPoste.etablissements[0].siren)
      ) {
        return res(ctx.json(siretLaPoste));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(siretRaphael.etablissements[0].siren)
      ) {
        return res(ctx.json(siretRaphael));
      }
      return;
    }
  ),
];
