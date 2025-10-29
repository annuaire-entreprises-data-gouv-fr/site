import type { Metadata } from "next";
import { Header } from "#components/header/header";
import { meta } from "#components/meta/meta";

export const metadata: Metadata = meta({});

export default async function ConnexionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header
        useAgentCTA={false}
        useLogo={true}
        useMap={false}
        useSearchBar={false}
      />
      <div>{children}</div>
    </>
  );
}
