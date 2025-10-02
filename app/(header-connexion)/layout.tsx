import { HeaderAppRouter } from '#components/header/header-app-router';

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
