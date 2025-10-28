import type { Metadata } from "next";
import { Header } from "#components/header/header";
import { meta } from "#components/meta/meta";
import { Question } from "#components/question";

export const metadata: Metadata = meta({});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header useAgentBanner={false} useAgentCTA={false} useSearchBar={false} />
      <main className="fr-container">{children}</main>
      <Question />
    </>
  );
}
