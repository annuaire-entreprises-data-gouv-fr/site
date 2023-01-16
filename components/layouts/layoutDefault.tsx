import React, { PropsWithChildren } from 'react';
import { Question } from '#components-ui/question';
import { BrowserIsOutdatedBanner } from '#components/banner/browser-is-outdated';
import { NPSBanner } from '#components/banner/nps';
import Footer from '#components/footer';
import { Header, HeaderWithSearch } from '#components/header';
import { WeNeedYouModal } from '#components/modal/we-need-you';
import SocialNetworks from '#components/social-network';

interface IProps {
  isBrowserOutdated: boolean;
  searchBar?: boolean;
}

export const Layout = ({
  children,
  isBrowserOutdated,
  searchBar = true,
}: PropsWithChildren<IProps>) => {
  return (
    <div id="page-layout">
      {isBrowserOutdated && <BrowserIsOutdatedBanner />}
      <NPSBanner />
      <WeNeedYouModal />
      {searchBar ? <HeaderWithSearch /> : <Header />}
      <main className="fr-container">{children}</main>
      <SocialNetworks />
      <Question />
      <Footer />
      <style global jsx>{`
        #page-layout {
          width: 100%;
        }
      `}</style>
    </div>
  );
};
