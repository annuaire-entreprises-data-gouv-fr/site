import React from 'react';
import HorizontalSeparator from '../../components-ui/horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { EAdministration } from '../../models/administrations';
import { INSEE } from '../administrations';
import { IEtatCivil } from '../../models/immatriculation/rncs';

interface IProps {
  dirigeant: IEtatCivil;
}

/**
 * Specific section for EI
 * @param param0
 * @returns
 */
const DirigeantsEntrepriseIndividuelleSection: React.FC<IProps> = ({
  dirigeant,
}) => {
  const femininMasculin = dirigeant.sexe === 'M' ? '' : 'e';

  return (
    <>
      <Section
        id="insee-dirigeant"
        title={'Dirigeant'}
        sources={[EAdministration.INSEE]}
      >
        <p>
          Cette entité est l’entreprise individuelle de{' '}
          <b>
            {dirigeant.prenom} {dirigeant.nom}
          </b>
          .
        </p>
        Nous ne connaissant pas son âge, donc nous ne pouvons pas distinguer
        cette personne de ses homonymes éventuels.
        <br />
        Mais vous pouvez{' '}
        <a href={`/rechercher?fn=${dirigeant.prenom}&n=${dirigeant.nom}`}>
          rechercher toutes les entreprises dirigées par une personne appelée «{' '}
          {dirigeant.prenom} {dirigeant.nom} »
        </a>
        .
      </Section>
      <HorizontalSeparator />
    </>
  );
};
export default DirigeantsEntrepriseIndividuelleSection;
