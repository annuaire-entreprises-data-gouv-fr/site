import { rest } from 'msw';
import { finassur } from './finassure';
import { ganymede } from './ganymede';
import { grandParis } from './grand-paris';
import { laPoste } from './la-poste';
import { essSpectacle } from './manakin-production';
import { raphael } from './raphael';
import { redNeedles } from './red-needles';
import { sauvage } from './sauvage';
import { severnaya } from './severnaya';
import { rge } from './solution-energie';

export const handlers = [
  rest.get(
    'https://api.insee.fr/entreprises/sirene/V3/siret',
    (_req, res, ctx) => {
      if (
        _req.url.searchParams.get('q')?.includes(rge.etablissements[0].siren)
      ) {
        return res(ctx.json(rge));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(essSpectacle.etablissements[0].siren)
      ) {
        return res(ctx.json(essSpectacle));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(ganymede.etablissements[0].siren)
      ) {
        return res(ctx.json(essSpectacle));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(grandParis.etablissements[0].siren)
      ) {
        return res(ctx.json(grandParis));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(grandParis.etablissements[0].siren)
      ) {
        return res(ctx.json(grandParis));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(sauvage.etablissements[0].siren)
      ) {
        return res(ctx.json(sauvage));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(finassur.etablissements[0].siren)
      ) {
        return res(ctx.json(finassur));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(redNeedles.etablissements[0].siren)
      ) {
        return res(ctx.json(redNeedles));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(severnaya.etablissements[0].siren)
      ) {
        return res(ctx.json(severnaya));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(laPoste.etablissements[0].siren)
      ) {
        return res(ctx.json(laPoste));
      }
      if (
        _req.url.searchParams
          .get('q')
          ?.includes(raphael.etablissements[0].siren)
      ) {
        return res(ctx.json(raphael));
      }
      return;
    }
  ),
];
