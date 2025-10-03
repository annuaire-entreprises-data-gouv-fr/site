import { HttpResponse, type HttpResponseResolver } from "msw";
import apiInclusion from "../../fixtures/api-inclusion.json";
import apiInclusionMetadata from "../../fixtures/api-inclusion-metadata.json";

export const apiInclusionHandler: HttpResponseResolver = ({ request }) =>
  HttpResponse.json(apiInclusion);

export const apiInclusionMetadataHandler: HttpResponseResolver = ({
  request,
}) => HttpResponse.json(apiInclusionMetadata);
