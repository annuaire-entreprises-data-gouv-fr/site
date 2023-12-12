import React from 'react';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IEtatCivil } from '#models/immatriculation';

type IProps = {
  dirigeant: IEtatCivil;
};

/**
 * Specific section for EI
 * @param param0
 * @returns
 */
const DirigeantsEntrepriseIndividuelleSection: React.FC<IProps> = ({
  dirigeant,
}) => {
  return (
    <>
      <Section
        id="insee-dirigeant"
        title={'Dirigeant'}
        sources={[EAdministration.INSEE]}
      >
        <p>
          Cette structure est l’entreprise individuelle de{' '}
          <b>
            {dirigeant.prenom} {dirigeant.nom}
          </b>
          .
        </p>
        Ne connaissant pas son âge, nous ne pouvons pas distinguer cette
        personne de ses homonymes éventuels.
        <br />
        Mais vous pouvez{' '}
        <a href={`/rechercher?fn=${dirigeant.prenom}&n=${dirigeant.nom}`}>
          rechercher toutes les structures liées à une personne appelée «{' '}
          {dirigeant.prenom} {dirigeant.nom} »
        </a>
        .
      </Section>
      <HorizontalSeparator />
    </>
  );
};
export default DirigeantsEntrepriseIndividuelleSection;
