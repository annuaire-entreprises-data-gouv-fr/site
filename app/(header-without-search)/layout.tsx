import { Metadata } from 'next';
import { Question } from '#components-ui/question';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { HeaderServer } from '#components/header/header-server';
import SocialNetworks from '#components/social-network';
import '../../style/dsfr.min.css';
import '../../style/globals.css';

export const metadata: Metadata = {
  title:
    'L’Annuaire des Entreprises françaises : les informations légales officielles de l’administration',
  description:
    'L’administration permet aux particuliers, entrepreneurs et agents publics de vérifier les informations informations légales des entreprises, associations et services publics en France.',
};

export default async function LayoutWithSearchBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <div style={{ width: '100%' }}>
          <NPSBanner />
          <HeaderServer useSearchBar={false} useAgentCTA={true} useLogo />
          <main className="fr-container">{children}</main>
          <SocialNetworks />
          <Question />
          <Footer />
        </div>
      </body>
    </html>
  );
}
