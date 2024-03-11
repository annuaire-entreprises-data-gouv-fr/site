'use client';

import React from 'react';
import { AdvancedSearch } from '#components/advanced-search';
import { IParams } from '#models/search-filter-params';
import { Header } from '.';

type IProps = {
  currentSearchTerm?: string;
  useMap?: boolean;
  searchParams?: IParams;
  useAdvancedSearch?: boolean;
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
};

export const HeaderWithAdvancedSearch: React.FC<IProps> = ({
  currentSearchTerm = '',
  searchParams = {},
  useMap = false,
  useLogo = false,
  useAdvancedSearch = false,
  useSearchBar = false,
  useAgentCTA = false,
}) => {
  const advancedSearchPlugin = useAdvancedSearch ? (
    <AdvancedSearch
      searchParams={searchParams}
      currentSearchTerm={currentSearchTerm}
      isMap={useMap}
    />
  ) : undefined;

  return (
    <Header
      useMap={useMap}
      useLogo={useLogo}
      useSearchBar={useSearchBar}
      useAgentCTA={useAgentCTA}
      plugin={advancedSearchPlugin}
    />
  );
};
