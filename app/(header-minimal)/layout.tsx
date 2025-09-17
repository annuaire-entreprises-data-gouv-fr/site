import { HeaderAppRouter } from '#components/header/header-app-router';
import { Question } from '#components/question';

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
