import { HttpResponse, HttpResponseResolver } from "msw";

export const annuaireServicePublicHandler: HttpResponseResolver = ({
  request,
}) => {
  return HttpResponse.json({});
};
