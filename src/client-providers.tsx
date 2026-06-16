import { BrowserIsOutdatedBanner } from "./components/banner/browser-is-outdated";
import { AuthProvider } from "./contexts/auth.context";
import { useMatomoInit } from "./matomo-init";
import type { ISession } from "./models/authentication/user/session";

export function ClientProviders({
  children,
  user,
}: {
  children: React.ReactNode;
  user: ISession["user"] | null;
}) {
  useMatomoInit({ user });

  return (
    <BrowserIsOutdatedBanner>
      <AuthProvider user={user}>{children}</AuthProvider>
    </BrowserIsOutdatedBanner>
  );
}
