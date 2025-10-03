import { HttpResponse, HttpResponseResolver } from "msw";
import apiInclusionMetadata from "../../fixtures/api-inclusion-metadata.json";
import apiInclusion from "../../fixtures/api-inclusion.json";

export const apiInclusionHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json(apiInclusion);
};

export const apiInclusionMetadataHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json(apiInclusionMetadata);
};
