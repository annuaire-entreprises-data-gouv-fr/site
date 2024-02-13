'use client';
import React from 'react';
import { AdvancedSearch } from '#components/advanced-search';
import { IParams } from '#models/search-filter-params';
import { HeaderSimple } from './header-simple';

type IProps = {
  currentSearchTerm?: string;
  useMap?: boolean;
  searchParams?: IParams;
  useAdvancedSearch?: boolean;
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
};

export const Header: React.FC<IProps> = ({
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
    <HeaderSimple
      useMap={useMap}
      useLogo={useLogo}
      useSearchBar={useSearchBar}
      useAgentCTA={useAgentCTA}
      plugin={advancedSearchPlugin}
    />
  );
};
