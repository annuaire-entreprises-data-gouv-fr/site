import NonRenseigne from '#components/non-renseigne';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations/EAdministration';
import { isCollectiviteTerritoriale, IUniteLegale } from '#models/core/types';
import { IEtatCivil } from '#models/rne/types';
import { capitalize, formatDatePartial } from '#utils/helpers';
import React from 'react';

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
      elu.role ?? <NonRenseigne />,
      <>{nomComplet}</>,
      <span>
        {capitalize(formatDatePartial(elu.dateNaissancePartial) ?? '') || (
          <NonRenseigne />
        )}
      </span>,
    ];

    return infos;
  };

  const plural = elus.length > 1 ? 's' : '';

  return (
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
            head={['Role', 'Élu(e)', 'Date de naissance']}
            body={elus.sort(sortByRole).map((elu) => formatElus(elu))}
          />
        </>
      ) : (
        <p>
          Cette collectivité ne possède aucun élu enregistré au Répertoire
          National des Élus
        </p>
      )}
    </Section>
  );
};
export default ElusSection;

type IElu = {
  role?: string;
};
function sortByRole(a: IElu, b: IElu): -1 | 1 | 0 {
  const roleA = a.role;
  const roleB = b.role;
  if (roleA === roleB) {
    return 0;
  }
  if (roleA === 'Maire') {
    return -1;
  }
  if (roleB === 'Maire') {
    return 1;
  }
  if (roleA == null) {
    return 1;
  }
  if (roleB == null) {
    return -1;
  }
  if (roleA.match(/^[\d]+/) && roleB.match(/^[\d]+/)) {
    return parseInt(roleA, 10) < parseInt(roleB, 10) ? -1 : 1;
  }
  return roleA < roleB ? -1 : 1;
}
