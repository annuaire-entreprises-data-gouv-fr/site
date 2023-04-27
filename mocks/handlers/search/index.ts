import { rest } from 'msw';
import { resultFinassure } from './result-finassure';
import { resultGrandParis } from './result-grand-paris';
import { resultLaPoste } from './result-la-poste';
import { resultManakinProduction } from './result-manakin-production';
import { resultRaphael } from './result-raphael';
import { resultRedNeedles } from './result-red-needles';
import { resultSauvage } from './result-sauvage';
import { resultSevernaya } from './result-severnaya';
import { resultSolutionEnergie } from './result-solution-energie';
import { results } from './results';

export const handlers = [
  rest.get(
    'https://recherche-entreprises.api.gouv.fr/search',
    (_req, res, ctx) => {
      if (
        _req.url.searchParams.get('q') ===
        resultSolutionEnergie.results[0].siren
      ) {
        return res(ctx.json(resultSolutionEnergie));
      }
      if (
        _req.url.searchParams.get('q') ===
        resultManakinProduction.results[0].siren
      ) {
        return res(ctx.json(resultManakinProduction));
      }
      if (
        _req.url.searchParams.get('q') === resultGrandParis.results[0].siren
      ) {
        return res(ctx.json(resultGrandParis));
      }
      if (_req.url.searchParams.get('q') === resultSauvage.results[0].siren) {
        return res(ctx.json(resultSauvage));
      }
      if (_req.url.searchParams.get('q') === resultSevernaya.results[0].siren) {
        return res(ctx.json(resultSevernaya));
      }
      if (_req.url.searchParams.get('q') === resultFinassure.results[0].siren) {
        return res(ctx.json(resultFinassure));
      }
      if (
        _req.url.searchParams.get('q') === resultRedNeedles.results[0].siren
      ) {
        return res(ctx.json(resultRedNeedles));
      }
      if (_req.url.searchParams.get('q') === resultLaPoste.results[0].siren) {
        return res(ctx.json(resultLaPoste));
      }
      if (_req.url.searchParams.get('q') === resultRaphael.results[0].siren) {
        return res(ctx.json(resultRaphael));
      }
      return res(ctx.json(results));
    }
  ),
];
