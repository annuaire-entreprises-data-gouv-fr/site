import React, { PropsWithChildren } from 'react';
import Footer from '#components/footer';
import { Header } from '#components/header';
import { ISession } from '#utils/session';

export const LayoutSimple: React.FC<
  PropsWithChildren<{
    session: ISession | null | undefined;
  }>
> = ({ children, session }) => (
  <div id="page-layout">
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
