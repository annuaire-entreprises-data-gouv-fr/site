import { HeaderAppRouter } from "#components/header/header-app-router";

export default async function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderAppRouter
        useAgentCTA={false}
        useLogo={true}
        useMap={false}
        useSearchBar={false}
      />
      <div>{children}</div>
    </>
  );
}
