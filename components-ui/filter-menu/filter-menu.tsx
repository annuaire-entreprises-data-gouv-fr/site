'use client';

import { PropsWithChildren, useState } from 'react';
import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import {
  IParams,
  ISearchFilter,
  buildSearchQuery,
} from '#models/search-filter-params';
import { useOutsideClick } from 'hooks';
import ActiveFilterLabel from './active-filter-label';
import styles from './style.module.css';

type FilterMenuProps = {
  label: string;
  activeFilter: ISearchFilter;
  searchParams: IParams;
  searchTerm: string;
  addSaveClearButton: boolean;
};

export const FilterMenu: React.FC<PropsWithChildren<FilterMenuProps>> = ({
  children,
  label,
  activeFilter,
  searchParams,
  searchTerm,
  addSaveClearButton = false,
}) => {
  const clearFilterLink = buildSearchQuery(
    searchTerm,
    searchParams,
    activeFilter.excludeParams
  );

  const [open, setOpen] = useState(false);

  const ref = useOutsideClick(() => {
    setOpen(false);
  });

  return (
    <>
      <div ref={ref} className={styles['search-filter-label-container']}>
        <div>
          <label>
            {activeFilter.label ? (
              <ActiveFilterLabel
                icon={activeFilter.icon}
                label={activeFilter.label}
                query={clearFilterLink}
                onClick={() => {
                  setOpen(!open);
                }}
              />
            ) : (
              <span
                className={styles['search-filter-label']}
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <Icon color={constants.colors.frBlue} slug={activeFilter.icon}>
                  {label}&nbsp;&nbsp;▾
                </Icon>
              </span>
            )}
          </label>
          {open && (
            <label
              onClick={() => setOpen(false)}
              className={styles['close-container']}
            >
              Fermer ✕
            </label>
          )}
        </div>
        <div
          className={styles['container']}
          style={{ display: open ? 'block' : 'none' }}
        >
          <div className={styles['filter-container']}>{children}</div>
          {addSaveClearButton && (
            <>
              <br />
              <div className="layout-space-between">
                <a
                  className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
                  href={clearFilterLink}
                >
                  Effacer
                </a>
                <ButtonLink type="submit" alt small>
                  Appliquer
                </ButtonLink>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
