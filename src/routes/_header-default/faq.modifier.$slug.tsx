import { createFileRoute } from "@tanstack/react-router";
import Breadcrumb from "#/components-ui/breadcrumb";
import ButtonLink from "#/components-ui/button";
import TextWrapper from "#/components-ui/text-wrapper";
import { getDataToModify } from "#/models/administrations/data-to-modify";
import { meta } from "#/seo";
import { redirectFAQPageNotFound } from "#/utils/server-side-helper/redirect-faq-not-found";
import { HeaderDefaultError } from "./-error";

export const Route = createFileRoute("/_header-default/faq/modifier/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;

    const dataToModify = getDataToModify(slug);
    if (!dataToModify) {
      return redirectFAQPageNotFound(slug);
    }

    return { dataToModify };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: meta({
          title: "Page non trouvée",
        }),
      };
    }
    const { dataToModify } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/faq/modifier/${dataToModify.slug}`;
    return {
      meta: meta({
        title: dataToModify.label,
      }),
      links: [
        {
          rel: "canonical",
          href: canonical,
        },
      ],
    };
  },
  component: RouteComponent,
  errorComponent: HeaderDefaultError,
});

function RouteComponent() {
  const { dataToModify } = Route.useLoaderData();

  return (
    <TextWrapper>
      <Breadcrumb
        links={[
          { href: "/faq", label: "Questions fréquentes" },
          {
            href: "/faq/modifier",
            label: "Comment modifier ces informations",
          },
          { href: "", label: dataToModify.label },
        ]}
      />
      <h1>
        Comment modifier : “<strong>{dataToModify.label}</strong>” ?
      </h1>
      <p />
      <p>Ces informations proviennent de :</p>
      <ul>
        <li>
          Source de la donnée :{" "}
          <a href={dataToModify.datagouvLink}>{dataToModify.dataSource}</a>
        </li>
        <li>
          Service responsable :{" "}
          <a href={dataToModify.site}>{dataToModify.long}</a>.
        </li>
      </ul>
      {dataToModify.form ? (
        <>
          <p>Cette administration propose une démarche en ligne&nbsp;:</p>
          <ButtonLink to={dataToModify.form}>
            Accéder à la démarche en ligne
          </ButtonLink>
        </>
      ) : (
        <>
          <br />
          <ButtonLink to={dataToModify.contact}>
            Contacter le service ({dataToModify.short})
          </ButtonLink>
        </>
      )}

      <h2>Vous ne trouvez pas votre réponse ?</h2>
      <div className="layout-left">
        <ButtonLink alt small to="/faq">
          Consultez notre FAQ
        </ButtonLink>
      </div>
    </TextWrapper>
  );
}
