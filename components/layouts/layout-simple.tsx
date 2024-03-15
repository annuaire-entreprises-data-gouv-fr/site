import React, { PropsWithChildren } from 'react';
import Footer from '#components/footer';
import { HeaderWithAdvancedSearch } from '#components/header/header-advanced-search';

export const LayoutSimple: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div id="page-layout">
    <HeaderWithAdvancedSearch
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
