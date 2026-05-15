import { HttpResponse, type HttpResponseResolver } from "msw";
import effectifs from "../../fixtures/rcd-effectifs-annuels.json" with {
  type: "json",
};

export const effectifsAnnuelsHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(effectifs);
