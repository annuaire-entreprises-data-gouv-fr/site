import { HttpResponse, HttpResponseResolver } from "msw";
import odsMetadata from "../../fixtures/ods-metadata.json";

export const odsMetadataHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(odsMetadata);
};
