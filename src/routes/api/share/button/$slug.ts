import { createFileRoute } from "@tanstack/react-router";
import constants from "#/models/constants";
import { Exception } from "#/models/exceptions";
import { isSiren, isSiret } from "#/utils/helpers";
import logErrorInSentry from "#/utils/sentry";
import { defaultHeadersMiddleware } from "../../-middlewares";

export const Route = createFileRoute("/api/share/button/$slug")({
  server: {
    middleware: [
      defaultHeadersMiddleware({
        "Access-Control-Allow-Origin": "*",
      }),
    ],
    handlers: {
      GET: async ({ request, params }) => {
        const { slug } = params;
        const light = new URL(request.url).searchParams.get("light");

        const isSirenOrSiret =
          typeof slug === "string" && (isSiren(slug) || isSiret(slug));
        if (!isSirenOrSiret) {
          return Response.json(
            { message: "Slug must be a siren or a siret" },
            { status: 403 }
          );
        }

        const path = `${isSiren(slug) ? "entreprise" : "etablissement"}/${slug}`;
        const uri = encodeURI(
          `https://annuaire-entreprises.data.gouv.fr/${path}?mtm_campaign=button-iframe`
        );

        const fontColor = light ? constants.colors.frBlue : "#fff";
        const backgroundColor = light ? "#fff" : constants.colors.frBlue;
        const hoverBackgroundColor = light ? "#f0f0ff" : "#000060";

        const html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <style>
      html { font-size: 18px; line-height: 25px; font-family: Marianne, arial, sans-serif; }
      body { margin: 0; padding: 0; }
      .btn-wrapper { display: flex; align-items: center; justify-content: center; }
      .btn-container {
        width: 100%;
        text-decoration: none;
        border-radius: 4px;
        border: 1px solid ${fontColor};
        background-color: ${backgroundColor};
        color: ${fontColor};
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        padding: 15px;
      }
      .btn-container:hover { background-color: ${hoverBackgroundColor}; }
      .img {
        width: 40px;
        height: 40px;
        border-radius: 2px;
        background: #fff;
        color: ${constants.colors.frBlue};
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
      }
      .label { flex-grow: 1; }
      @media only screen and (max-width: 355px) {
        html { font-size: 14px; line-height: 21px; }
        .btn-container { padding: 3px; }
      }
      @media only screen and (min-width: 355px) and (max-width: 450px) {
        html { font-size: 15px; line-height: 23px; }
        .btn-container { padding: 5px; }
      }
    </style>
  </head>
  <body>
    <div class="btn-wrapper">
      <a href="${uri}" target="_blank" rel="noopener" class="btn-container">
        <div class="img">AE</div>
        <div class="label">
          Voir les <strong>informations légales</strong> sur
          <div>l'<strong>Annuaire</strong> des <strong>Entreprises</strong></div>
        </div>
      </a>
    </div>
  </body>
</html>`;

        try {
          return new Response(html, {
            status: 200,
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "X-Robots-Tag": "noindex, nofollow",
            },
          });
        } catch (e) {
          logErrorInSentry(
            new Exception({
              name: "ShareButtonGenerationException",
              cause: e,
              context: {
                slug,
              },
            })
          );
          return Response.json(
            { message: "Une erreur est survenue." },
            { status: 500 }
          );
        }
      },
    },
  },
});
