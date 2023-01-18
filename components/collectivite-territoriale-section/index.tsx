import React from 'react';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { EAdministration } from '#models/administrations';
import { ICollectiviteTerritoriale } from '#models/index';

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
        <a href={`/elus/${uniteLegale.siren}`} rel="nofollow">
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
        sources={[EAdministration.INSEE, EAdministration.MI]}
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
