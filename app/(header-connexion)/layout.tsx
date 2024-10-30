import { HeaderAppRouter } from '#components/header/header-app-router';
import { meta } from '#components/meta/meta-server';
import { Metadata } from 'next';

export const metadata: Metadata = meta({});

export default async function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderAppRouter
        useSearchBar={false}
        useLogo={true}
        useMap={false}
        useAgentCTA={false}
      />
      <div>{children}</div>
    </>
  );
}
