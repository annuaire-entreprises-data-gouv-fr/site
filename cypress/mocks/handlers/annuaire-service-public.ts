import { HttpResponse, type HttpResponseResolver } from "msw";

export const annuaireServicePublicHandler: HttpResponseResolver = ({
  request,
}) => HttpResponse.json({});
