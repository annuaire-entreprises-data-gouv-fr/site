import { PrintNever } from '#components-ui/print-visibility';
import { DataSectionServer } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { getConformiteEntreprise } from '#models/espace-agent/conformite';
import { ISession } from '#models/user/session';
import Conformite from './conformite';

interface IProps {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}
async function ConformiteSection({ uniteLegale, session }: IProps) {
  const conformite = getConformiteEntreprise(
    uniteLegale.siren,
    uniteLegale.siege.siret,
    session?.user?.siret
  );

  return (
    <PrintNever>
      <DataSectionServer
        title="Conformité"
        id="conformite"
        isProtected
        data={conformite}
        sources={[
          EAdministration.DGFIP,
          EAdministration.URSSAF,
          EAdministration.MSA,
        ]}
      >
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
      </DataSectionServer>
    </PrintNever>
  );
}

export default ConformiteSection;
