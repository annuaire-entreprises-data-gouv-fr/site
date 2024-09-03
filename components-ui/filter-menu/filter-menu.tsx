'use client';
import ButtonLink from '#components-ui/button';
import ButtonClose from '#components-ui/button/button-close';
import FloatingModal from '#components-ui/floating-modal';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import {
  IParams,
  ISearchFilter,
  buildSearchQuery,
} from '#models/search/search-filter-params';
import { useOutsideClick } from 'hooks';
import { PropsWithChildren, useId, useState } from 'react';
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
  const id = useId();

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
            <ButtonClose
              onClick={() => setOpen(false)}
              className={styles['close-container']}
              ariaControls={id}
              ariaLabel="Fermer les filtres"
            />
          )}
        </div>
        <FloatingModal
          className={styles['container']}
          style={{ display: open ? 'block' : 'none' }}
          aria-label={'Les filtres de ' + activeFilter.label}
          aria-modal={false}
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
        </FloatingModal>
      </div>
    </>
  );
};
