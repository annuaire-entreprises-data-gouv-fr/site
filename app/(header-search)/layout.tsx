import { Metadata } from 'next';
import { Question } from '#components-ui/question';
import { HeaderWithAdvancedSearch } from '#components/header/header-advanced-search';
import { meta } from '#components/meta/meta-server';

export const metadata: Metadata = meta({});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderWithAdvancedSearch
        useSearchBar={true}
        useAgentCTA={true}
        useMap={false}
        useAdvancedSearch={true}
      />
      <main className="fr-container">{children}</main>
      <Question />
    </>
  );
}
