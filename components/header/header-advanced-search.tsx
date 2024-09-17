import React from 'react';
import { AdvancedSearch } from '#components/advanced-search';
import { IParams } from '#models/search/search-filter-params';
import { HeaderServer } from './header-server';

type IProps = {
  currentSearchTerm?: string;
  useMap?: boolean;
  searchParams: IParams;
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
};

export const HeaderWithAdvancedSearch: React.FC<IProps> = ({
  currentSearchTerm = '',
  searchParams,
  useMap = false,
  useLogo = false,
  useSearchBar = false,
  useAgentCTA = false,
}) => {
  return (
    <HeaderServer
      useMap={useMap}
      useLogo={useLogo}
      useSearchBar={useSearchBar}
      useAgentCTA={useAgentCTA}
      plugin={
        <AdvancedSearch
          searchParams={searchParams}
          currentSearchTerm={currentSearchTerm}
          isMap={useMap}
        />
      }
      currentSearchTerm={currentSearchTerm}
    />
  );
};
