"use client";

import { useFetchBODACC } from "hooks";
import type React from "react";
import routes from "#clients/routes";
import { DILA } from "#components/administrations";
import { AsyncDataSectionClient } from "#components/section/data-section/client";
import { FullTable } from "#components/table/full";
import { UniteLegalePageLink } from "#components/unite-legale-page-link";
import { Info } from "#components-ui/alerts";
import ButtonLink from "#components-ui/button";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import { formatDate } from "#utils/helpers";

const AnnoncesBodacc: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const bodacc = useFetchBODACC(uniteLegale);

  return (
    <AsyncDataSectionClient
      data={bodacc}
      id="annonces-bodacc"
      sources={[EAdministration.DILA]}
      title="Annonces BODACC"
    >
      {(bodacc) => (
        <>
          {bodacc.procedures.length > 0 ? (
            <Info>
              Cette structure a une procédure collective (en cours ou cloturée).
              <ul>
                {bodacc.procedures.map((procedure) => (
                  <li key={procedure.details}>
                    le {formatDate(procedure.date)} : {procedure.details}
                  </li>
                ))}
              </ul>
            </Info>
          ) : (
            <p>
              Cette structure n’a pas fait l’objet d’une procédure collective
              (en cours ou clôturée).
            </p>
          )}
          {bodacc.annonces.length === 0 ? (
            <div>
              Elle n’a aucune annonce publiée au{" "}
              <a
                href={routes.bodacc.site.recherche}
                rel="noreferrer noopener"
                target="_blank"
              >
                Bulletin Officiel Des Annonces Civiles et Commerciales (BODACC)
              </a>
              .
            </div>
          ) : (
            <>
              <p>
                Elle possède {bodacc.annonces.length} annonces publiées au{" "}
                <strong>
                  Bulletin Officiel Des Annonces Civiles et Commerciales
                  (BODACC)
                </strong>
                , consolidé par la <DILA />. Pour en savoir plus, vous pouvez
                consulter{" "}
                <UniteLegalePageLink
                  href={routes.bodacc.site.rechercheBySiren(uniteLegale.siren)}
                  siteName="le site du BODACC"
                  uniteLegale={uniteLegale}
                />
                &nbsp;:
              </p>
              <FullTable
                body={bodacc.annonces.map((annonce) => [
                  <strong>{formatDate(annonce.datePublication)}</strong>,
                  <>
                    <div>
                      <strong>{annonce.titre}</strong>
                    </div>
                    {annonce.details}
                    <div>
                      <i className="font-small">
                        Annonce n°{annonce.numeroAnnonce}, {annonce.sousTitre}
                        {annonce.tribunal && (
                          <>, publiée au {annonce.tribunal}</>
                        )}
                      </i>
                    </div>
                  </>,
                  <ButtonLink alt small target="_blank" to={annonce.path}>
                    ⇢&nbsp;Consulter
                  </ButtonLink>,
                ])}
                head={["Publication", "Details", "Lien"]}
              />
            </>
          )}
        </>
      )}
    </AsyncDataSectionClient>
  );
};
export default AnnoncesBodacc;
