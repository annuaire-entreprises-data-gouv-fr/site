import { HttpResponse, HttpResponseResolver } from 'msw';
import liensCapitalistiques from '../../fixtures/dgfip-liens-capitalistiques.json';

export const liensCapitalistiquesHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json(liensCapitalistiques);
};
