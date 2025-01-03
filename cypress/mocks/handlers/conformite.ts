import { HttpResponse, HttpResponseResolver } from 'msw';
import conformiteDgfip from '../../fixtures/conformite-dgfip.json';
import conformiteMsa from '../../fixtures/conformite-msa.json';
import conformiteUrssaf from '../../fixtures/conformite-urssaf.json';

export const conformiteHandler: HttpResponseResolver = ({ request }) => {
  let response = {};
  if (request.url.match('dgfip')) {
    response = conformiteDgfip;
  } else if (request.url.match('msa')) {
    response = conformiteMsa;
  } else if (request.url.match('urssaf')) {
    response = conformiteUrssaf;
  }
  return HttpResponse.json(response);
};
