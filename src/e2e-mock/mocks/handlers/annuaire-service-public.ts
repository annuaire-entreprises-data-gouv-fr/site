import { HttpResponse, type HttpResponseResolver } from "msw/http";

export const annuaireServicePublicHandler: HttpResponseResolver = ({
  request: _request,
}) => HttpResponse.json({});
