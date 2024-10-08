import { Metadata } from 'next';
import TextWrapper from '#components-ui/text-wrapper';
import getSession from '#utils/server-side-helper/app/get-session';
import HidePersonalDataPageClient from './_components';

export const metadata: Metadata = {
  title: 'Demande de suppression de données personnelles',
  description:
    'Demande de suppression de données personnelles de dirigeant d’entreprise sur l’Annuaire des Entreprises',
  robots: 'index, follow',
};

export default async function HidePersonalDataPage() {
  const session = await getSession();

  const title = 'Demande de suppression de données personnelles';
  return (
    <>
      <TextWrapper>
        <h1>{title}</h1>
        <HidePersonalDataPageClient session={session} />
      </TextWrapper>
    </>
  );
}
