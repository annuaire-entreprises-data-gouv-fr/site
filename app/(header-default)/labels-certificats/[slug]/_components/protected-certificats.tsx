import { OpqibiSection } from '#components/espace-agent-components/certifications/opqibi-section';
import { QualibatSection } from '#components/espace-agent-components/certifications/qualibat-section';
import { QualifelecSection } from '#components/espace-agent-components/certifications/qualifelec-section';
import { IUniteLegale } from '#models/core/types';
import { getOpqibi } from '#models/espace-agent/certificats/opqibi';
import { getQualibat } from '#models/espace-agent/certificats/qualibat';
import { getQualifelec } from '#models/espace-agent/certificats/qualifelec';
import { ISession } from '#models/user/session';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

export async function ProtectedCertificats({ uniteLegale, session }: IProps) {
  const opqibi = getOpqibi(uniteLegale.siren, session?.user?.siret);
  const qualifelec = getQualifelec(
    uniteLegale.siege.siret,
    session?.user?.siret
  );
  const qualibat = getQualibat(uniteLegale.siege.siret, session?.user?.siret);

  return (
    <>
      <QualibatSection qualibat={qualibat} />
      <QualifelecSection qualifelec={qualifelec} />
      <OpqibiSection opqibi={opqibi} />
    </>
  );
}
