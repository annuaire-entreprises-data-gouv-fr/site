"use client";

import { useFetchComptesAssociation } from "hooks";
import routes from "#clients/routes";
import { DILA } from "#components/administrations";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { FullTable } from "#components/table/full";
import { UniteLegalePageLink } from "#components/unite-legale-page-link";
import ButtonLink from "#components-ui/button";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IAssociation } from "#models/core/types";
import { formatDate } from "#utils/helpers";

export default function ComptesAssociationSection({
  uniteLegale,
}: {
  uniteLegale: IAssociation;
}) {
  const comptes = useFetchComptesAssociation(uniteLegale);
  return (
    <AsyncDataSectionClient
      data={comptes}
      id="comptes-association"
      sources={[EAdministration.DILA]}
      title="Dépôts des Comptes des Associations"
    >
      {(comptes) =>
        comptes.annonces.length === 0 ? (
          <div>
            Cette association n’a aucun compte déposé au{" "}
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
              Cette structure possède {comptes.annonces.length} comptes publiés
              au <strong>Journal Officiel des Associations (JOAFE)</strong>,
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
              body={comptes.annonces.map((annonce) => [
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
              head={["Publication", "Type d’annonce", "Consulter les comptes"]}
            />
          </>
        )
      }
    </AsyncDataSectionClient>
  );
}
