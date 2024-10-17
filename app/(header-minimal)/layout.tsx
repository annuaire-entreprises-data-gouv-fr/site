import { HeaderAppRouter } from '#components/header/header-app-router';
import { meta } from '#components/meta/meta-server';
import { Question } from '#components/question';
import { Metadata } from 'next';

export const metadata: Metadata = meta({});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderAppRouter
        useSearchBar={false}
        useAgentCTA={false}
        useAgentBanner={false}
      />
      <main className="fr-container">{children}</main>
      <Question />
    </>
  );
}
