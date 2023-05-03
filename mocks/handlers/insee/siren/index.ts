import { rest } from 'msw';
import { finassure } from './finassur';
import { ganymede } from './ganymede';
import { grandParis } from './grand-paris';
import { laPoste } from './la-poste';
import { manakinProduction } from './manakin-production';
import { raphael } from './raphael';
import { redNeedles } from './red-needles';
import { sauvage } from './sauvage';
import { severnaya } from './severnaya';
import { rge } from './solution-energie';

export const handlers = [
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${rge.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(rge));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${laPoste.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(laPoste));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${ganymede.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(ganymede));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${manakinProduction.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(manakinProduction));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${grandParis.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(grandParis));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${sauvage.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(sauvage));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${finassure.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(finassure));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${redNeedles.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(redNeedles));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${severnaya.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(severnaya));
    }
  ),
  rest.get(
    `https://api.insee.fr/entreprises/sirene/V3/siren/${raphael.uniteLegale.siren}`,
    (_req, res, ctx) => {
      return res(ctx.json(raphael));
    }
  ),
];
