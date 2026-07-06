import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { BrowserIsOutdatedBanner } from "./components/banner/browser-is-outdated";
import { AuthProvider } from "./contexts/auth.context";
import { useMatomoInit } from "./matomo-init";
import type { ISession } from "./models/authentication/user/session";

const HASH_SCROLL_RETRY_DELAYS_MS = [0, 50, 150, 350];

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
      <AuthProvider user={user}>
        <HashScrollRestoration />
        {children}
      </AuthProvider>
    </BrowserIsOutdatedBanner>
  );
}

function HashScrollRestoration() {
  const hash = useLocation({
    select: (location) => location.hash,
  });

  useEffect(() => {
    if (!hash) {
      return;
    }

    const timeoutIds = HASH_SCROLL_RETRY_DELAYS_MS.map((delay) =>
      window.setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({
          block: "start",
          inline: "nearest",
        });
      }, delay)
    );

    return () => {
      for (const timeoutId of timeoutIds) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [hash]);

  return null;
}
