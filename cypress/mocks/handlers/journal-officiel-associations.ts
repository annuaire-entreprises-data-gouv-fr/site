import { HttpResponse, type HttpResponseResolver } from "msw";
import journalOfficielAssociations from "../../fixtures/journal-officiel-associations.json" with {
  type: "json",
};

export const journalOfficielAssociationsHandler: HttpResponseResolver = ({
  request,
}) => HttpResponse.json(journalOfficielAssociations);
