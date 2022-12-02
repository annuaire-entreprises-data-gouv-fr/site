import React from 'react';
import { EAdministration } from '../../models/administrations';
import { ICollectiviteTerritoriale } from '../../models';
import Warning from '../../components-ui/alerts/warning';
import BreakPageForPrint from '../../components-ui/print-break-page';
import HorizontalSeparator from '../../components-ui/horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

const CollectiviteTerritorialeSection: React.FC<{
  uniteLegale: ICollectiviteTerritoriale;
}> = ({ uniteLegale }) => {
  const {
    colter: { codeColter = '', codeInsee = '', elus = [], niveau = '' },
  } = uniteLegale;

  const data = [
    ['Code Insee', codeInsee],
    ['Type', niveau],
    [
      'Élus',
      elus.length > 0 ? (
        <a href={`/elus/${uniteLegale.siren}`}>
          → voir les {elus.length} élu(s)
        </a>
      ) : (
        ''
      ),
    ],
  ];

  return (
    <>
      <Section
        title={`Collectivité territoriale`}
        sources={[EAdministration.MI]}
      >
        <p>Cette structure est une collectivite territoriale&nbsp;:</p>
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
      <BreakPageForPrint />
    </>
  );
};

export default CollectiviteTerritorialeSection;
