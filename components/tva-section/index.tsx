import React from 'react';
import { IUniteLegale } from '../../models';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { EAdministration } from '../../models/administration';
import { formatIntFr } from '../../utils/helpers/formatting';

interface IProps {
  uniteLegale: IUniteLegale;
}

const TvaSection: React.FC<IProps> = ({ uniteLegale }) => (
  <Section
    title="N°TVA Intracommunautaire"
    id="etablissement"
    source={EAdministration.VIES}
  >
    {uniteLegale.numeroTva.isValid ? (
      <>
        <TwoColumnTable
          body={[
            [
              'N°TVA vérifié par le VIES',
              formatIntFr(uniteLegale.numeroTva.numero),
            ],
          ]}
        />
      </>
    ) : (
      <i>
        Le numéro de TVA calculé à partir du numéro siren (
        {formatIntFr(uniteLegale.numeroTva.numero)}) n’est pas vérifié par le
        VIES.
        <br />
      </i>
    )}
    <br />
    <i>
      Consultez la fiche explicative sur la{' '}
      <a
        target="_blank"
        rel="noreferrer noopener"
        href="https://entreprendre.service-public.fr/vosdroits/R14669"
      >
        vérification des numéro de TVA
      </a>
    </i>
  </Section>
);

export default TvaSection;
