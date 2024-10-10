'use client';

import FAQLink from '#components-ui/faq-link';
import InformationTooltip from '#components-ui/information-tooltip';
import { Tag } from '#components-ui/tag';
import AgentWallAssociationProtected from '#components/espace-agent-components/agent-wall/association';
import { DataSectionClient } from '#components/section/data-section';
import TableFilter from '#components/table/filter';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { isDataSuccess, isUnauthorized } from '#models/data-fetching';
import { ISession } from '#models/user/session';
import { formatSiret } from '#utils/helpers';
import { extractAssociationEtablissements } from '#utils/helpers/association';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { useMemo, useState } from 'react';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const NoDirigeants = () => (
  <>Aucun(e) dirigeant(e) n’a été retrouvé pour cette association.</>
);

/**
 * Dirigeants for agents : RNA or Le compte asso
 */
function DirigeantsAssociationSection({ uniteLegale, session }: IProps) {
  const [selectedSiret, setSelectedSiret] = useState<string[]>([]);
  const associationProtected = useAPIRouteData(
    'espace-agent/association-protected',
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
        title="Dirigeants des associations"
        id="dirigeants"
        uniteLegale={uniteLegale}
      />
    );
  }

  return (
    <DataSectionClient
      id="rna-dirigeants"
      title="Dirigeants des associations"
      isProtected
      notFoundInfo={<NoDirigeants />}
      sources={[EAdministration.MI, EAdministration.DJEPVA]}
      data={associationProtected}
    >
      {(associationProtected) => (
        <>
          {associationProtected.dirigeants.length === 0 ? (
            <NoDirigeants />
          ) : (
            <>
              Cette association possède {associationProtected.dirigeants.length}{' '}
              dirigeant(s) enregistré(s) au{' '}
              <FAQLink tooltipLabel="RNA">
                Registre National des Associations
              </FAQLink>{' '}
              :
              <TableFilter
                dataSelect={etablissementsForFilter}
                onChange={(e) => setSelectedSiret(e)}
                placeholder="Filtrer par établissement"
                fallback={
                  <>
                    <br />
                    <br />
                  </>
                }
              />
              <FullTable
                head={['Etablissement', 'Role', 'Détails']}
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
                        {fonction}{' '}
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
                        {civilite} {(nom || '').toUpperCase()} {prenom}
                        {publication_internet && courriel && (
                          <>
                            {' '}
                            (<a href={`mailto:${courriel}`}>{courriel}</a>)
                          </>
                        )}
                      </>,
                    ]
                  )}
              />
            </>
          )}
        </>
      )}
    </DataSectionClient>
  );
}

export default DirigeantsAssociationSection;
