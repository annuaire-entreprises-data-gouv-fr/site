import { Metadata } from 'next';
import { Question } from '#components-ui/question';
import { HeaderServer } from '#components/header/header-server';
import { meta } from '#components/meta/meta-server';

export const metadata: Metadata = meta({});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderServer useSearchBar={false} useAgentCTA={false} />
      <main className="fr-container">{children}</main>
      <Question />
    </>
  );
}
