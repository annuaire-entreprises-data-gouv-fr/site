import { HttpResponse, type HttpResponseResolver } from "msw";

export const annuaireServicePublicHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json({});
