import React, { PropsWithChildren } from 'react';
import Footer from '#components/footer';
import { Header } from '#components/header';

export const LayoutSimple: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div id="page-layout">
    <Header
      useSearchBar={false}
      useLogo={true}
      useAdvancedSearch={false}
      useMap={false}
      useAgentCTA={true}
    />
    <main className="fr-container">{children}</main>
    <Footer />
  </div>
);
