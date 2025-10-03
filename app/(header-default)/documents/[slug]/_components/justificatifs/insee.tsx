import type React from "react";
import { INSEE } from "#components/administrations";
import AvisSituationLink from "#components/justificatifs/avis-situation-link";
import { Section } from "#components/section";
import { FullTable } from "#components/table/full";
import ButtonLink from "#components-ui/button";
import { Tag } from "#components-ui/tag";
import IsActiveTag from "#components-ui/tag/is-active-tag";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { estDiffusible } from "#models/core/diffusion";
import type { IEtablissement, IUniteLegale } from "#models/core/types";
import { formatSiret } from "#utils/helpers";

const AvisSituationTable: React.FC<{
  etablissements: IEtablissement[];
  session: ISession | null;
}> = ({ etablissements, session }) => (
  <FullTable
    body={etablissements.map((etablissement: IEtablissement) => [
      <a href={`/etablissement/${etablissement.siret}`}>
        {formatSiret(etablissement.siret)}
      </a>,
      <>
        {etablissement.adresse}
        {etablissement.estSiege && <Tag color="info">siège social</Tag>}
      </>,
      <IsActiveTag
        etatAdministratif={etablissement.etatAdministratif}
        since={etablissement.dateFermeture}
        statutDiffusion={etablissement.statutDiffusion}
      />,
      <AvisSituationLink
        etablissement={etablissement}
        label="Télécharger"
        session={session}
      />,
    ])}
    head={["SIRET", "Adresse", "Statut", "Avis de situation"]}
  />
);

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

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

const AvisSituationSection: React.FC<IProps> = ({ uniteLegale, session }) => (
  <Section
    id="justificatifs-insee"
    sources={[EAdministration.INSEE]}
    title="Justificatif d’inscription à l’Insee"
  >
    {!estDiffusible(uniteLegale) &&
    !hasRights(session, ApplicationRights.nonDiffusible) ? (
      <AvisSituationNonDiffusible />
    ) : (
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
            session={session}
          />
          .
        </p>
        {uniteLegale.etablissements.usePagination ? (
          <AvisSituationTable
            etablissements={uniteLegale.etablissements.all}
            session={session}
          />
        ) : (
          <>
            {uniteLegale.etablissements.open.length > 0 && (
              <>
                <h3>Etablissement(s) en activité :</h3>
                <AvisSituationTable
                  etablissements={uniteLegale.etablissements.open}
                  session={session}
                />
              </>
            )}
            {uniteLegale.etablissements.unknown.length > 0 && (
              <>
                <h3>Etablissement(s) non-diffusible(s) :</h3>
                <AvisSituationTable
                  etablissements={uniteLegale.etablissements.unknown}
                  session={session}
                />
              </>
            )}
            {uniteLegale.etablissements.closed.length > 0 && (
              <>
                <h3>Etablissement(s) fermé(s) :</h3>
                <AvisSituationTable
                  etablissements={uniteLegale.etablissements.closed}
                  session={session}
                />
              </>
            )}
          </>
        )}
      </>
    )}
  </Section>
);

export default AvisSituationSection;
