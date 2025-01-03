import { HttpResponse, HttpResponseResolver } from 'msw';
import carteProfessionnelleTravauxPublics from '../../fixtures/carte-professionnelle-travaux-publics.json';

export const carteProfessionnelleTravauxPublicsHandler: HttpResponseResolver =
  ({ request }) => {
    return HttpResponse.json(carteProfessionnelleTravauxPublics);
  };
