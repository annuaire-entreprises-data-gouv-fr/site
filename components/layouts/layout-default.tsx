import type { PropsWithChildren } from "react";
import { NPSBanner } from "#components/banner/nps";
import TempIncidentBanner from "#components/banner/temp-incident";
import Footer from "#components/footer";
import { HeaderPageRouter } from "#components/header/header-page-router";
import { WeNeedYouModal } from "#components/modal/we-need-you";
import { Question } from "#components/question";
import SocialNetworks from "#components/social-network";

type IProps = {
  searchBar?: boolean;
};

export const LayoutDefault = ({
  children,
  searchBar = true,
}: PropsWithChildren<IProps>) => (
  <div id="page-layout">
    <WeNeedYouModal />
    <NPSBanner />
    <TempIncidentBanner />
    <HeaderPageRouter
      useAgentCTA={true}
      useMap={false}
      useSearchBar={searchBar}
    />
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
