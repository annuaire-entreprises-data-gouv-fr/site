import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { ISession } from '#utils/session';
import { LayoutDefault } from '#components/layouts/layout-default';
import '../frontend/src/entry-with-react';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (
    page: ReactElement,
    isBrowserOutdated: boolean,
    session?: ISession | null
  ) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const isBrowserOutdated = pageProps?.metadata?.isBrowserOutdated || false;
  const session = pageProps?.metadata?.session || null;
  // Use the layout defined at the page level, otherwise fallback on layout with default settings.
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <LayoutDefault isBrowserOutdated={isBrowserOutdated} session={session}>
        {page}
      </LayoutDefault>
    ));
  //eslint-disable-next-line react/jsx-props-no-spreading
  return getLayout(<Component {...pageProps} />, isBrowserOutdated, session);
}
