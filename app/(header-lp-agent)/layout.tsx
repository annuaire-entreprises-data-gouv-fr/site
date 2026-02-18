import type { Metadata } from "next";
import Footer from "#components/footer";
import { Header } from "#components/header/header";
import { meta } from "#components/meta/meta";
import { NotificationProvider } from "#components/notification-provider";

export const metadata: Metadata = meta({});

export default function LayoutWithSearchBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <Header
        useAgentBanner={false}
        useAgentCTA={true}
        useAgentDocumentation={true}
        useSearchBar={true}
      />
      <main className="fr-container">{children}</main>
      <Footer />
    </NotificationProvider>
  );
}
