import { HttpResponse, type HttpResponseResolver } from "msw";

export const annuaireServicePublicHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json({});
};
