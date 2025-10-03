"use client";

import { useFetchBODACC } from "hooks";
import routes from "#clients/routes";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { FullTable } from "#components/table/full";
import ButtonLink from "#components-ui/button";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import { formatDate } from "#utils/helpers";

export function ComptesBodaccSociete({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) {
  const bodacc = useFetchBODACC(uniteLegale);

  return (
    <AsyncDataSectionClient
      data={bodacc}
      id="comptes-bodacc"
      sources={[EAdministration.DILA]}
      title="Dépôts des comptes (BODACC C)"
    >
      {(bodacc) => (
        <>
          {bodacc.comptes.length === 0 ? (
            <div>
              Aucun dépôt de compte publié au{" "}
              <a
                aria-label="Bulletin Officiel Des Annonces Civiles et Commerciales"
                href={routes.bodacc.site.recherche}
                rel="noreferrer noopener"
                target="_blank"
              >
                BODACC
              </a>
              .
            </div>
          ) : (
            <FullTable
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
                <ButtonLink alt small target="_blank" to={annonce.path}>
                  ⇢&nbsp;Consulter
                </ButtonLink>,
              ])}
              head={["Publication", "Details", "Annonce"]}
            />
          )}
        </>
      )}
    </AsyncDataSectionClient>
  );
}
