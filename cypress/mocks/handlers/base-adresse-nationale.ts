import { HttpResponse, HttpResponseResolver } from 'msw';
import baseAdresseNationale from '../../fixtures/base-adresse-nationale.json';

export const baseAdresseNationaleHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json(baseAdresseNationale);
};
