import { HttpResponse, type HttpResponseResolver } from "msw/http";
import journalOfficielAssociations from "../../fixtures/journal-officiel-associations.json" with {
  type: "json",
};

export const journalOfficielAssociationsHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(journalOfficielAssociations);
