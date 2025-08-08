import Footer from '#components/footer';
import { HeaderAppRouter } from '#components/header/header-app-router';
import { meta } from '#components/meta/meta-server';
import { NotificationProvider } from '#components/notification-center';
import { Metadata } from 'next';

export const metadata: Metadata = meta({});

export default function LayoutWithSearchBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderAppRouter
        useSearchBar={true}
        useAgentCTA={true}
        useAgentBanner={false}
      />
      <main className="fr-container">{children}</main>
      <NotificationProvider />
      <Footer />
    </>
  );
}
