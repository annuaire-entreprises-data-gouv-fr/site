import Conformite from '#components/espace-agent-components/conformite';
import { DataSection } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { getConformiteEntreprise } from '#models/espace-agent/conformite';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';
import { sectionInfo } from './common';

async function ConformiteSection(props: AppRouterProps) {
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);
  const session = await getSession();
  const conformite = await getConformiteEntreprise(
    uniteLegale.siren,
    uniteLegale.siege.siret,
    session?.user?.siret
  );

  return (
    <DataSection {...sectionInfo} data={conformite}>
      {(conformite) => (
        <TwoColumnTable
          body={[
            ['Conformité fiscale', <Conformite data={conformite?.fiscale} />],
            [
              'Conformité sociale',
              <>
                <Conformite
                  data={conformite?.vigilance}
                  administration="Urssaf"
                />
                <br />
                <Conformite data={conformite?.msa} administration="MSA" />
              </>,
            ],
          ]}
        />
      )}
    </DataSection>
  );
}

export default ConformiteSection;
