"use client";

import routes from "#clients/routes";
import ButtonLink from "#components-ui/button";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { FullTable } from "#components/table/full";
import { EAdministration } from "#models/administrations/EAdministration";
import { IUniteLegale } from "#models/core/types";
import { formatDate } from "#utils/helpers";
import { useFetchBODACC } from "hooks";

export function ComptesBodaccSociete({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) {
  const bodacc = useFetchBODACC(uniteLegale);

  return (
    <AsyncDataSectionClient
      id="comptes-bodacc"
      title="Dépôts des comptes (BODACC C)"
      sources={[EAdministration.DILA]}
      data={bodacc}
    >
      {(bodacc) => (
        <>
          {bodacc.comptes.length === 0 ? (
            <div>
              Aucun dépôt de compte publié au{" "}
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={routes.bodacc.site.recherche}
                aria-label="Bulletin Officiel Des Annonces Civiles et Commerciales"
              >
                BODACC
              </a>
              .
            </div>
          ) : (
            <FullTable
              head={["Publication", "Details", "Annonce"]}
              body={bodacc.comptes.map((annonce) => [
                <strong>{formatDate(annonce.datePublication)}</strong>,
                <>
                  <div>
                    <strong>{annonce.titre}</strong>
                  </div>
                  {annonce.details}
                  <div>
                    <i className="font-small">
                      Annonce n°{annonce.numeroAnnonce}, {annonce.sousTitre}
                      {annonce.tribunal && <>, publiée au {annonce.tribunal}</>}
                    </i>
                  </div>
                </>,
                <ButtonLink target="_blank" to={annonce.path} alt small>
                  ⇢&nbsp;Consulter
                </ButtonLink>,
              ])}
            />
          )}
        </>
      )}
    </AsyncDataSectionClient>
  );
}
