import type { Metadata } from "next";
import { HeaderAppRouter } from "#components/header/header-app-router";
import { meta } from "#components/meta/meta-server";

export const metadata: Metadata = meta({});

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
