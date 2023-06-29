import React, { PropsWithChildren } from 'react';
import { BrowserIsOutdatedBanner } from '#components/banner/browser-is-outdated';
import Footer from '#components/footer';
import { Header } from '#components/header';
import { ISession } from '#utils/session';

export const LayoutSimple: React.FC<
  PropsWithChildren<{
    isBrowserOutdated: boolean;
    session: ISession | null | undefined;
  }>
> = ({ children, isBrowserOutdated, session }) => (
  <div id="page-layout">
    {isBrowserOutdated && <BrowserIsOutdatedBanner />}
    <Header
      useSearchBar={false}
      useLogo={true}
      useAdvancedSearch={false}
      useMap={false}
      session={session}
    />
    <main className="fr-container">{children}</main>
    <Footer />
  </div>
);
