import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { Layout as DefaultLayout } from '#components/layout';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, isBrowserOutdated: boolean) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const isBrowserOutdated = pageProps?.metadata?.isBrowserOutdated || false;
  // Use the layout defined at the page level, otherwise fallback on layout with default settings.
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <DefaultLayout isBrowserOutdated={isBrowserOutdated}>
        {page}
      </DefaultLayout>
    ));
  return getLayout(<Component {...pageProps} />, isBrowserOutdated);
}
