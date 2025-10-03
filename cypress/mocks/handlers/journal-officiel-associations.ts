import { HttpResponse, HttpResponseResolver } from "msw";
import journalOfficielAssociations from "../../fixtures/journal-officiel-associations.json";

export const journalOfficielAssociationsHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json(journalOfficielAssociations);
};
