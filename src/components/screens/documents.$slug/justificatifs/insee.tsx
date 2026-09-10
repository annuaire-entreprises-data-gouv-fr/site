import type React from "react";
import { INSEE } from "#/components/administrations";
import AvisSituationLink from "#/components/justificatifs/avis-situation-link";
import { Link } from "#/components/link";
import { Section } from "#/components/section";
import { FullTable } from "#/components/table/full";
import ButtonLink from "#/components-ui/button";
import IsActiveTag from "#/components-ui/tag/is-active-tag";
import { EAdministration } from "#/models/administrations/e-administration";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { estDiffusible } from "#/models/core/diffusion";
import type { IEtablissement, IUniteLegale } from "#/models/core/types";
import { formatSiret } from "#/utils/helpers";

const AvisSituationTable: React.FC<{
  etablissements: IEtablissement[];
  user: IAgentInfo | null;
}> = ({ etablissements, user }) => (
  <FullTable
    body={etablissements.map((etablissement: IEtablissement) => [
      <Link
        aria-label={`Voir l’établissement ${formatSiret(etablissement.siret)}`}
        params={{ slug: etablissement.siret }}
        to="/etablissement/$slug"
      >
        {formatSiret(etablissement.siret)}
      </Link>,
      etablissement.adresse,
      <IsActiveTag
        etatAdministratif={etablissement.etatAdministratif}
        since={etablissement.dateFermeture}
        statutDiffusion={etablissement.statutDiffusion}
      />,
      <AvisSituationLink
        etablissement={etablissement}
        label="Télécharger"
        user={user}
      />,
    ])}
    head={["SIRET", "Adresse", "Statut", "Avis de situation"]}
  />
);

interface IProps {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}

const AvisSituationNonDiffusible = () => (
  <>
    <div className="description">
      Bien que cette entreprise soit <strong>non-diffusible</strong>, l’
      <INSEE /> propose une téléprocédure qui permet{" "}
      <strong>au représentant légal</strong> d’une entreprise d’accéder en
      quelques clics à son avis de situation.
    </div>
    <div className="layout-center">
      <ButtonLink to="https://avis-situation-sirene.insee.fr/">
        Obtenir mon avis de situation
      </ButtonLink>
    </div>
  </>
);

const AvisSituationSection: React.FC<IProps> = ({ uniteLegale, user }) => (
  <Section
    id="justificatifs-insee"
    sources={[EAdministration.INSEE]}
    title="Justificatif d’inscription à l’Insee"
  >
    {estDiffusible(uniteLegale) ||
    hasRights({ user }, ApplicationRights.nonDiffusible) ? (
      <>
        <div className="description">
          Chaque établissement immatriculé par l’Insee au répertoire Sirene des
          entreprises possède un avis de situation.
        </div>
        <p>
          Si vous avez plusieurs établisements et ne savez pas quel avis de
          situation utiliser,{" "}
          <AvisSituationLink
            etablissement={uniteLegale.siege}
            label="téléchargez l’avis de situation Sirene du siège social"
            user={user}
          />
          .
        </p>
        <h3>Siège social</h3>
        <AvisSituationTable etablissements={[uniteLegale.siege]} user={user} />
        {uniteLegale.etablissements.usePagination ? (
          <AvisSituationTable
            etablissements={uniteLegale.etablissements.all.filter(
              (item) => !item.estSiege
            )}
            user={user}
          />
        ) : (
          <>
            {uniteLegale.etablissements.open.some((item) => !item.estSiege) && (
              <>
                <h3>Autres établissement(s) en activité :</h3>
                <AvisSituationTable
                  etablissements={uniteLegale.etablissements.open.filter(
                    (item) => !item.estSiege
                  )}
                  user={user}
                />
              </>
            )}
            {uniteLegale.etablissements.unknown.some(
              (item) => !item.estSiege
            ) && (
              <>
                <h3>Autres établissement(s) non-diffusible(s) :</h3>
                <AvisSituationTable
                  etablissements={uniteLegale.etablissements.unknown.filter(
                    (item) => !item.estSiege
                  )}
                  user={user}
                />
              </>
            )}
            {uniteLegale.etablissements.closed.some(
              (item) => !item.estSiege
            ) && (
              <>
                <h3>Autres établissement(s) fermé(s) :</h3>
                <AvisSituationTable
                  etablissements={uniteLegale.etablissements.closed.filter(
                    (item) => !item.estSiege
                  )}
                  user={user}
                />
              </>
            )}
          </>
        )}
      </>
    ) : (
      <AvisSituationNonDiffusible />
    )}
  </Section>
);

export default AvisSituationSection;
