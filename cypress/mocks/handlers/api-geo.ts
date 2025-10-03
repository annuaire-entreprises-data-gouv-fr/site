import { HttpResponse, HttpResponseResolver } from "msw";

export const apiGeoCommunesHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json({});
};

export const apiGeoDepartementsHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json({});
};

export const apiGeoRegionsHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json({});
};

export const apiGeoEpcisHandler: HttpResponseResolver = ({ request }) => {
  return HttpResponse.json({});
};
