'use client';

import FAQLink from '#components-ui/faq-link';
import InformationTooltip from '#components-ui/information-tooltip';
import { Tag } from '#components-ui/tag';
import AgentWallAssociationProtected from '#components/espace-agent-components/agent-wall/association';
import NonRenseigne from '#components/non-renseigne';
import { DataSectionClient } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { isUnauthorized } from '#models/data-fetching';
import { ISession } from '#models/user/session';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const NoDirigeants = () => (
  <>Aucun(e) dirigeant(e) n’a été retrouvé pour cette association.</>
);

/**
 * Dirigeants for agents : either from Infogreffe or from RNE
 */
function DirigeantsAssociationSection({ uniteLegale, session }: IProps) {
  const associationProtected = useAPIRouteData(
    'espace-agent/association-protected',
    uniteLegale.siren,
    session
  );

  if (isUnauthorized(associationProtected)) {
    <AgentWallAssociationProtected
      title="Dirigeants des associations"
      id="dirigeants"
      uniteLegale={uniteLegale}
    />;
  }

  return (
    <DataSectionClient
      id="rna-dirigeants"
      title="Dirigeants des associations"
      isProtected
      // @ts-ignore
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
              <br />
              <br />
              <FullTable
                head={['Role', 'Détails', 'Contact']}
                body={associationProtected.dirigeants.map(
                  ({
                    civilite,
                    nom,
                    prenom,
                    fonction,
                    valideur_cec,
                    publication_internet,
                    telephone,
                    courriel,
                  }) => [
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
                    </>,
                    publication_internet && courriel ? (
                      <a href={`mailto:${courriel}`}>{courriel}</a>
                    ) : (
                      <NonRenseigne />
                    ),
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
