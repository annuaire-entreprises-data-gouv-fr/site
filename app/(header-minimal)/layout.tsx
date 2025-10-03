import type { Metadata } from "next";
import { HeaderAppRouter } from "#components/header/header-app-router";
import { meta } from "#components/meta/meta-server";
import { Question } from "#components/question";

export const metadata: Metadata = meta({});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderAppRouter
        useAgentBanner={false}
        useAgentCTA={false}
        useSearchBar={false}
      />
      <main className="fr-container">{children}</main>
      <Question />
    </>
  );
}
