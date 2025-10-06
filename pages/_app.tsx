import { marianne } from "app/fonts";
import { SessionProvider } from "hooks/use-page-router-session";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import { BrowserIsOutdatedBanner } from "#components/banner/browser-is-outdated";
import ErrorBoundary from "#components/error-boundary/index";
import { LayoutDefault } from "#components/layouts/layout-default";
import type { ISession } from "#models/authentication/user/session";
import "../style/dsfr.min.css";
import "../style/globals.css";

export type NextPageWithLayout<P = Record<never, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const session: ISession | null = pageProps?.metadata?.session || null;
  // Use the layout defined at the page level, otherwise fallback on layout with default settings.
  const getLayout =
    Component.getLayout ?? ((page) => <LayoutDefault>{page}</LayoutDefault>);

  const layout = getLayout(<Component {...pageProps} />);
  return (
    <ErrorBoundary>
      <style global jsx>{`
        html {
          font-family: ${marianne.style.fontFamily};
        }
      `}</style>
      <SessionProvider value={session}>
        <BrowserIsOutdatedBanner>{layout}</BrowserIsOutdatedBanner>
      </SessionProvider>
    </ErrorBoundary>
  );
}
