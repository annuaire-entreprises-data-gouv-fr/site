import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  checkHasLabelsAndCertificates,
  checkHasQuality,
} from "#/components/badges-section/labels-and-certificates";
import { LabelAchatsResponsables } from "#/components/labels-and-certificates/achats-responsables";
import AlimConfianceSection from "#/components/labels-and-certificates/alim-confiance/section";
import BilanGesSection from "#/components/labels-and-certificates/bilan-ges";
import { CertificationsBioSection } from "#/components/labels-and-certificates/bio";
import { EgaproSection } from "#/components/labels-and-certificates/egapro";
import { CertificationsEntrepreneurSpectaclesSection } from "#/components/labels-and-certificates/entrepreneur-spectacles";
import { EntrepriseInclusiveSection } from "#/components/labels-and-certificates/entreprise-inclusive";
import { CertificationESSSection } from "#/components/labels-and-certificates/ess";
import FinessSection from "#/components/labels-and-certificates/finess";
import { OrganismeDeFormationSection } from "#/components/labels-and-certificates/organismes-de-formation";
import { LabelPatrimoineVivant } from "#/components/labels-and-certificates/patrimoine-vivant";
import { CertificationsRGESection } from "#/components/labels-and-certificates/rge";
import { CertificationSocieteMission } from "#/components/labels-and-certificates/societe-mission";
import { OpqibiSection } from "#/components/protected-certificates/opqibi-section";
import { QualibatSection } from "#/components/protected-certificates/qualibat-section";
import { QualifelecSection } from "#/components/protected-certificates/qualifelec-section";
import Title from "#/components/title-section";
import { FICHE } from "#/components/title-section/tabs";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { useAuth } from "#/contexts/auth.context";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { getCertificationsFromSlug } from "#/models/certifications";
import { meta } from "#/seo";
import { getUniteLegaleFromSlugFn } from "#/server-functions/public/unite-legale";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { HeaderDefaultError } from "./-error";

const loadLabelsCertificatsPage = createServerFn()
  .inputValidator(
    z.object({ slug: z.string(), entrepreneurSpectaclesPage: z.number() })
  )
  .handler(async ({ data: { slug, entrepreneurSpectaclesPage } }) => {
    const uniteLegale = await getUniteLegaleFromSlugFn({
      data: { slug },
    });
    const certifications = await getCertificationsFromSlug(uniteLegale, {
      entrepreneurSpectaclesPage,
    });
    return { uniteLegale, certifications };
  });

export const Route = createFileRoute(
  "/_header-default/labels-certificats/$slug"
)({
  validateSearch: z.object({
    "entrepreneur-spectacles-page": z
      .number()
      .min(1)
      .optional()
      .default(1)
      .catch(1),
  }),
  search: {
    middlewares: [stripSearchParams({ "entrepreneur-spectacles-page": 1 })],
  },
  loaderDeps: ({ search }) => ({
    "entrepreneur-spectacles-page": search["entrepreneur-spectacles-page"],
  }),
  loader: async ({ params, deps }) =>
    await loadLabelsCertificatsPage({
      data: {
        slug: params.slug,
        entrepreneurSpectaclesPage: deps["entrepreneur-spectacles-page"],
      },
    }),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: meta({
          title: "Page non trouvée",
          robots: {
            follow: false,
          },
        }),
      };
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/labels-certificats/${uniteLegale.siren}`;
    return {
      meta: meta({
        title: `Qualités, labels et certificats - ${uniteLegalePageTitle(uniteLegale)}`,
        description: uniteLegalePageDescription(uniteLegale),
        robots: {
          follow: true,
          index: false,
        },
        alternates: {
          canonical,
        },
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
  const { uniteLegale, certifications } = Route.useLoaderData();

  const {
    estEss,
    estRge,
    estSocieteMission,
    estOrganismeFormation,
    egaproRenseignee,
    estBio,
    estEntrepreneurSpectacle,
    estEntrepriseInclusive,
    estAchatsResponsables,
    estPatrimoineVivant,
    estAlimConfiance,
    bilanGesRenseigne,
    estFiness,
  } = uniteLegale.complements;

  const {
    rge,
    entrepreneurSpectacles,
    egapro,
    bio,
    organismesDeFormation,
    ess,
    entrepriseInclusive,
  } = certifications;

  const { user } = useAuth();

  return (
    <div className="content-container">
      <Title
        ficheType={FICHE.CERTIFICATS}
        uniteLegale={uniteLegale}
        user={user}
      />
      {!checkHasLabelsAndCertificates(uniteLegale) &&
        !hasRights({ user }, ApplicationRights.protectedCertificats) && (
          <p>Cette structure ne possède aucun label ou certificat.</p>
        )}
      {estEss && <CertificationESSSection ess={ess} />}
      {estSocieteMission && <CertificationSocieteMission />}
      {estEntrepriseInclusive && (
        <EntrepriseInclusiveSection entrepriseInclusive={entrepriseInclusive} />
      )}
      {checkHasQuality(uniteLegale) && <HorizontalSeparator />}
      {estFiness && <FinessSection uniteLegale={uniteLegale} />}
      {estRge && (
        <CertificationsRGESection
          certificationsRGE={rge}
          uniteLegale={uniteLegale}
        />
      )}
      {hasRights({ user }, ApplicationRights.protectedCertificats) && (
        <>
          <QualibatSection uniteLegale={uniteLegale} />
          <QualifelecSection uniteLegale={uniteLegale} />
          <OpqibiSection uniteLegale={uniteLegale} />
        </>
      )}
      {estOrganismeFormation && (
        <OrganismeDeFormationSection
          organismesDeFormation={organismesDeFormation}
        />
      )}
      {egaproRenseignee && <EgaproSection egapro={egapro} />}
      {estEntrepreneurSpectacle && (
        <CertificationsEntrepreneurSpectaclesSection
          entrepreneurSpectacles={entrepreneurSpectacles}
        />
      )}
      {estBio && (
        <CertificationsBioSection bio={bio} uniteLegale={uniteLegale} />
      )}
      {estAchatsResponsables && <LabelAchatsResponsables />}
      {estPatrimoineVivant && <LabelPatrimoineVivant />}
      {estAlimConfiance && <AlimConfianceSection uniteLegale={uniteLegale} />}

      {bilanGesRenseigne && <BilanGesSection uniteLegale={uniteLegale} />}
    </div>
  );
}
