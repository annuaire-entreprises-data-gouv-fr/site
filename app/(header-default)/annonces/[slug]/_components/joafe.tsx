"use client";

import { useFetchJOAFE } from "hooks";
import type React from "react";
import routes from "#clients/routes";
import { DILA } from "#components/administrations";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { FullTable } from "#components/table/full";
import { UniteLegalePageLink } from "#components/unite-legale-page-link";
import AssociationCreationNotFoundAlert from "#components-ui/alerts-with-explanations/association-creation-not-found-alert";
import ButtonLink from "#components-ui/button";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IAssociation } from "#models/core/types";
import { formatDate } from "#utils/helpers";

const AnnoncesJOAFESection: React.FC<{
  uniteLegale: IAssociation;
}> = ({ uniteLegale }) => {
  const annoncesAssociation = useFetchJOAFE(uniteLegale);
  return (
    <AsyncDataSectionClient
      data={annoncesAssociation}
      id="annonces-joafe"
      sources={[EAdministration.DILA]}
      title="Annonces Journal Officiel des Associations"
    >
      {(annoncesAssociation) => (
        <>
          {annoncesAssociation.annonces.filter(
            (annonce) => annonce.typeAvisLibelle === "Création"
          ).length === 0 && (
            <AssociationCreationNotFoundAlert uniteLegale={uniteLegale} />
          )}
          {annoncesAssociation.annonces.length === 0 ? (
            <div>
              Cette structure n’a aucune annonce publiée au{" "}
              <a
                href={routes.journalOfficielAssociations.site.recherche}
                rel="noreferrer noopener"
                target="_blank"
              >
                Journal Officiel des Associations (JOAFE)
              </a>
              .
            </div>
          ) : (
            <>
              <p>
                Cette structure possède {annoncesAssociation.annonces.length}{" "}
                annonces publiées au{" "}
                <strong>Journal Officiel des Associations (JOAFE)</strong>,
                consolidé par la <DILA />. Pour en savoir plus, vous pouvez
                consulter{" "}
                <UniteLegalePageLink
                  href={`${routes.journalOfficielAssociations.site.recherche}?q=${uniteLegale.siren}`}
                  siteName="le site du JOAFE"
                  uniteLegale={uniteLegale}
                />
                &nbsp;:
              </p>
              <FullTable
                body={annoncesAssociation.annonces.map((annonce) => [
                  <strong>{formatDate(annonce.datePublication)}</strong>,
                  <>
                    <div>
                      <strong>{annonce.typeAvisLibelle}</strong>
                    </div>
                    {annonce.details}
                    <div>
                      <i className="font-small">
                        Annonce n°{annonce.numeroParution}
                      </i>
                    </div>
                  </>,
                  <ButtonLink alt small target="_blank" to={annonce.path}>
                    ⇢&nbsp;Consulter
                  </ButtonLink>,
                ])}
                head={[
                  "Publication",
                  "Type d’annonce",
                  "Justificatif de parution",
                ]}
              />
            </>
          )}
        </>
      )}
    </AsyncDataSectionClient>
  );
};

export default AnnoncesJOAFESection;
