import { Suspense } from 'react';
import { OpqibiSection } from '#components/espace-agent-components/certifications/opqibi-section';
import { QualibatSection } from '#components/espace-agent-components/certifications/qualibat-section';
import { QualifelecSection } from '#components/espace-agent-components/certifications/qualifelec-section';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { getOpqibi } from '#models/espace-agent/certificats/opqibi';
import { getQualibat } from '#models/espace-agent/certificats/qualibat';
import { getQualifelec } from '#models/espace-agent/certificats/qualifelec';
import { ISession } from '#models/user/session';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  hasOtherCertificates: boolean;
};

export async function ProtectedCertificats({
  uniteLegale,
  session,
  hasOtherCertificates,
}: IProps) {
  const opqibi = getOpqibi(uniteLegale.siren, session?.user?.siret);
  const qualifelec = getQualifelec(
    uniteLegale.siege.siret,
    session?.user?.siret
  );
  const qualibat = getQualibat(uniteLegale.siege.siret, session?.user?.siret);

  return (
    <>
      {!hasOtherCertificates && (
        <Suspense>
          <NoCertificatsWarning certificats={[opqibi, qualifelec, qualibat]} />
        </Suspense>
      )}
      <QualibatSection qualibat={qualibat} />
      <QualifelecSection qualifelec={qualifelec} />
      <OpqibiSection opqibi={opqibi} />
    </>
  );
}

async function NoCertificatsWarning({
  certificats: certificatsPromise,
}: {
  certificats: Promise<IAPINotRespondingError | unknown>[];
}) {
  const certificats = await Promise.all(certificatsPromise);
  if (certificats.every((certificat) => isAPINotResponding(certificat))) {
    return <p>Aucun certificat n’a été trouvé pour cette entreprise.</p>;
  }
  return null;
}
