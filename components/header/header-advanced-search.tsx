import type React from "react";
import { AdvancedSearch } from "#components/advanced-search";
import type { IParams } from "#models/search/search-filter-params";
import { Header } from "./header";

type IProps = {
  currentSearchTerm?: string;
  useMap?: boolean;
  searchParams: IParams;
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
};

export const HeaderWithAdvancedSearch: React.FC<IProps> = ({
  currentSearchTerm = "",
  searchParams,
  useMap = false,
  useLogo = false,
  useSearchBar = false,
  useAgentCTA = false,
}) => (
  <Header
    currentSearchTerm={currentSearchTerm}
    plugin={
      <AdvancedSearch
        currentSearchTerm={currentSearchTerm}
        isMap={useMap}
        searchParams={searchParams}
      />
    }
    useAgentBanner={false}
    useAgentCTA={useAgentCTA}
    useLogo={useLogo}
    useMap={useMap}
    useSearchBar={useSearchBar}
  />
);
