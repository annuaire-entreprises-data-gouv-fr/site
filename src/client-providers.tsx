import { BrowserIsOutdatedBanner } from "./components/banner/browser-is-outdated";
import { MatomoInit } from "./components/matomo-event/init";
import { AuthProvider } from "./contexts/auth.context";
import type { ISession } from "./models/authentication/user/session";

export function ClientProviders({
  children,
  user,
}: {
  children: React.ReactNode;
  user: ISession["user"] | null;
}) {
  return (
    <BrowserIsOutdatedBanner>
      <AuthProvider user={user}>
        {process.env.NODE_ENV === "production" &&
          import.meta.env.VITE_MATOMO_SITE_ID && <MatomoInit />}
        {children}
      </AuthProvider>
    </BrowserIsOutdatedBanner>
  );
}
