import React from 'react';
import { EAdministration } from '#models/administrations/EAdministration';
import { IEtatCivil } from '#models/immatriculation';
import { isCollectiviteTerritoriale, IUniteLegale } from '#models/index';
import { Section } from '../section';
import { FullTable } from '../table/full';

/**
 * Elus section
 * @param param0
 * @returns
 */
const ElusSection: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  let elus = [] as IEtatCivil[];

  if (isCollectiviteTerritoriale(uniteLegale)) {
    elus = uniteLegale?.colter?.elus || [];
  }

  const formatElus = (elu: IEtatCivil) => {
    const nomComplet = `${elu.prenom || ''}${
      elu.prenom && elu.nom ? ' ' : ''
    }${(elu.nom || '').toUpperCase()}`;

    const infos = [
      elu.role,
      <>
        {nomComplet}, né(e) en {elu.dateNaissancePartial}
      </>,
    ];

    return infos;
  };

  const plural = elus.length > 1 ? 's' : '';

  return (
    <>
      <Section
        id="collectivite-elus"
        title={`Élu${plural}`}
        sources={[EAdministration.MI, EAdministration.DINUM]}
      >
        {elus.length > 0 ? (
          <>
            <p>
              Cette collectivité possède {elus.length} élu{plural} enregistré
              {plural} au Répertoire National des Élus&nbsp;:
            </p>
            <FullTable
              head={['Role', 'Details']}
              body={elus.map((elu) => formatElus(elu))}
            />
          </>
        ) : (
          <p>
            Cette collectivité ne possède aucun élu enregistré au Répertoire
            National des Élus
          </p>
        )}
      </Section>
      <style global jsx>{`
        table > tbody > tr > td:first-of-type {
          width: 30%;
        }
      `}</style>
    </>
  );
};
export default ElusSection;
