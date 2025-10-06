"use client";

import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";
import { useMemo, useState } from "react";
import AgentWallAssociationProtected from "#components/espace-agent-components/agent-wall/association";
import { DataSectionClient } from "#components/section/data-section";
import TableFilter from "#components/table/filter";
import { FullTable } from "#components/table/full";
import FAQLink from "#components-ui/faq-link";
import InformationTooltip from "#components-ui/information-tooltip";
import { Tag } from "#components-ui/tag";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { isDataSuccess, isUnauthorized } from "#models/data-fetching";
import { formatSiret } from "#utils/helpers";
import { extractAssociationEtablissements } from "#utils/helpers/association";

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const NoDirigeants = () => (
  <>Aucun(e) dirigeant(e) n’a été retrouvé(e) pour cette association.</>
);

/**
 * Dirigeants for agents : RNA or Le compte asso
 */
function DirigeantsAssociationSection({ uniteLegale, session }: IProps) {
  const [selectedSiret, setSelectedSiret] = useState<string[]>([]);
  const associationProtected = useAPIRouteData(
    APIRoutesPaths.EspaceAgentAssociationProtected,
    uniteLegale.siren,
    session
  );

  const etablissementsForFilter = useMemo(() => {
    if (!isDataSuccess(associationProtected)) {
      return [];
    }
    return extractAssociationEtablissements(associationProtected.dirigeants);
  }, [associationProtected]);

  if (isUnauthorized(associationProtected)) {
    return (
      <AgentWallAssociationProtected
        id="dirigeants"
        title="Dirigeants des associations"
        uniteLegale={uniteLegale}
      />
    );
  }

  return (
    <DataSectionClient
      data={associationProtected}
      id="rna-dirigeants"
      isProtected
      notFoundInfo={<NoDirigeants />}
      sources={[EAdministration.MI, EAdministration.DJEPVA]}
      title="Dirigeants des associations"
    >
      {(associationProtected) => (
        <>
          {associationProtected.dirigeants.length === 0 ? (
            <NoDirigeants />
          ) : (
            <>
              Cette association possède {associationProtected.dirigeants.length}{" "}
              dirigeant(s) enregistré(s) au{" "}
              <FAQLink tooltipLabel="RNA">
                Répertoire National des Associations
              </FAQLink>{" "}
              :
              <TableFilter
                dataSelect={etablissementsForFilter}
                fallback={
                  <>
                    <br />
                    <br />
                  </>
                }
                onChange={(e) => setSelectedSiret(e)}
                placeholder="Filtrer par établissement"
              />
              <FullTable
                body={associationProtected.dirigeants
                  .filter((d) =>
                    selectedSiret.length > 0
                      ? selectedSiret.indexOf(d.etablissement.siret) > -1
                      : true
                  )
                  .map(
                    ({
                      etablissement,
                      civilite,
                      nom,
                      prenom,
                      fonction,
                      valideur_cec,
                      publication_internet,
                      courriel,
                    }) => [
                      <>
                        <a href={`/etablissement/${etablissement.siret}`}>
                          {formatSiret(etablissement.siret)}
                        </a>
                        {etablissement.siege && <Tag color="info">siège</Tag>}
                      </>,

                      <>
                        {fonction}{" "}
                        {valideur_cec && (
                          <InformationTooltip
                            label="Le validateur CEC est le dirigeant de l’association chargé d’attester les déclarations d’engagement des responsables associatifs dans le cadre du compte d’engagement citoyen (CEC)."
                            tabIndex={0}
                          >
                            <Tag color="info">Validateur CEC</Tag>
                          </InformationTooltip>
                        )}
                      </>,
                      <>
                        {civilite} {(nom || "").toUpperCase()} {prenom}
                        {publication_internet && courriel && (
                          <>
                            {" "}
                            (<a href={`mailto:${courriel}`}>{courriel}</a>)
                          </>
                        )}
                      </>,
                    ]
                  )}
                head={["Établissement", "Rôle", "Détails"]}
              />
            </>
          )}
        </>
      )}
    </DataSectionClient>
  );
}

export default DirigeantsAssociationSection;
