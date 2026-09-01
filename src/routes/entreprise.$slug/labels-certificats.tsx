import {
  createFileRoute,
  notFound,
  stripSearchParams,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
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
import { NotFound } from "#/components/screens/not-found";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import { useAuth } from "#/contexts/auth.context";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { getCertificationsFromSlug } from "#/models/certifications";
import {
  uniteLegalePageDescription,
  uniteLegalePageTitle,
} from "#/utils/helpers";
import { verifySiren } from "#/utils/helpers/siren-and-siret";
import { meta } from "#/utils/seo";
import { HeaderDefaultError } from "../_header-default/-error";

const loadLabelsCertificatsPage = createServerFn()
  .validator(
    z.object({
      siren: z.string().transform(verifySiren),
      complements: z.object({
        egaproRenseignee: z.boolean(),
        estBio: z.boolean(),
        estEntrepreneurSpectacle: z.boolean(),
        estEntrepriseInclusive: z.boolean(),
        estEss: z.boolean(),
        estOrganismeFormation: z.boolean(),
        estRge: z.boolean(),
      }),
      entrepreneurSpectaclesPage: z.number().min(1),
    })
  )
  .handler(
    async ({ data: { siren, complements, entrepreneurSpectaclesPage } }) => {
      const certifications = await getCertificationsFromSlug(
        siren,
        complements,
        { entrepreneurSpectaclesPage }
      );
      return { certifications };
    }
  );

export const Route = createFileRoute("/entreprise/$slug/labels-certificats")({
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
    entrepreneurSpectaclesPage: search["entrepreneur-spectacles-page"],
  }),
  loader: async ({ parentMatchPromise, deps }) => {
    const { loaderData } = await parentMatchPromise;

    if (!loaderData) {
      throw notFound();
    }

    const { uniteLegale } = loaderData;

    const pageData = await loadLabelsCertificatsPage({
      data: {
        siren: uniteLegale.siren,
        complements: {
          egaproRenseignee: uniteLegale.complements.egaproRenseignee,
          estBio: uniteLegale.complements.estBio,
          estEntrepreneurSpectacle:
            uniteLegale.complements.estEntrepreneurSpectacle,
          estEntrepriseInclusive:
            uniteLegale.complements.estEntrepriseInclusive,
          estEss: uniteLegale.complements.estEss,
          estOrganismeFormation: uniteLegale.complements.estOrganismeFormation,
          estRge: uniteLegale.complements.estRge,
        },
        entrepreneurSpectaclesPage: deps.entrepreneurSpectaclesPage,
      },
    });

    return { ...pageData, uniteLegale };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return meta.notFound();
    }

    const { uniteLegale } = loaderData;
    const canonical = `https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.siren}/labels-certificats`;
    return {
      meta: meta({
        title: `Qualités, labels et certificats - ${uniteLegalePageTitle(uniteLegale)}`,
        description: uniteLegalePageDescription(uniteLegale),
        robots: "noindex",
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
  notFoundComponent: () => <NotFound withWrapper={false} />,
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
    <>
      {!(
        checkHasLabelsAndCertificates(uniteLegale) ||
        hasRights({ user }, ApplicationRights.protectedCertificats)
      ) && <p>Cette structure ne possède aucun label ou certificat.</p>}
      {estEss && <CertificationESSSection ess={ess} />}
      {estSocieteMission && <CertificationSocieteMission />}
      {estEntrepriseInclusive && (
        <EntrepriseInclusiveSection entrepriseInclusive={entrepriseInclusive} />
      )}
      {checkHasQuality(uniteLegale) && <HorizontalSeparator />}
      {estFiness && <FinessSection uniteLegale={uniteLegale} />}
      {estRge && <CertificationsRGESection certificationsRGE={rge} />}
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
    </>
  );
}
