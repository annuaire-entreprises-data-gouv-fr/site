import { HttpResponse, type HttpResponseResolver } from "msw/http";
import odsMetadata from "../../fixtures/ods-metadata.json" with {
  type: "json",
};

export const odsMetadataHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json(odsMetadata);
