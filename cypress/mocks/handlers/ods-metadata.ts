import { HttpResponse, type HttpResponseResolver } from "msw";
import odsMetadata from "../../fixtures/ods-metadata.json" with {
  type: "json",
};

export const odsMetadataHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(odsMetadata);
