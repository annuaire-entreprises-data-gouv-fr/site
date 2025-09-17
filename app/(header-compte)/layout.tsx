import Footer from '#components/footer';
import { HeaderAppRouter } from '#components/header/header-app-router';
import { NotificationProvider } from '#components/notification-center';

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
