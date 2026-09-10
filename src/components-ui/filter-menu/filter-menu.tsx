import {
  type PropsWithChildren,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import ButtonLink from "#/components-ui/button";
import ButtonClose from "#/components-ui/button/button-close";
import { Icon } from "#/components-ui/icon/wrapper";
import constants from "#/models/constants";
import {
  buildSearchQuery,
  type IParams,
  type ISearchFilter,
} from "#/models/search/search-filter-params";
import ActiveFilterLabel from "./active-filter-label";
import styles from "./style.module.css";

interface FilterMenuProps {
  activeFilter: ISearchFilter;
  addSaveClearButton: boolean;
  label: string;
  searchParams: IParams;
  searchTerm: string;
}

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

  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  }, [open]);
  const id = useId();

  return (
    <div className={styles["search-filter-label-container"]}>
      <div>
        <div>
          {activeFilter.label ? (
            <ActiveFilterLabel
              controls={id}
              expanded={open}
              icon={activeFilter.icon}
              label={activeFilter.label}
              onClick={() => {
                setOpen(!open);
              }}
              query={clearFilterLink}
            />
          ) : (
            <button
              aria-controls={id}
              aria-describedby={`${id}-description`}
              aria-expanded={open}
              aria-haspopup="dialog"
              className={styles["search-filter-label"]}
              onClick={() => {
                setOpen(!open);
              }}
              type="button"
            >
              <Icon color={constants.colors.frBlue} slug={activeFilter.icon}>
                {label}&nbsp;&nbsp;▾
              </Icon>
            </button>
          )}
        </div>
      </div>
      <span className="fr-sr-only" id={`${id}-description`}>
        Affiner la recherche par {label.toLowerCase()}.
      </span>
      <dialog
        aria-label={`Filtres : ${label}`}
        className={styles.container}
        id={id}
        onClose={() => setOpen(false)}
        ref={dialogRef}
      >
        <ButtonClose
          ariaControls={id}
          ariaLabel="Fermer les filtres"
          onClick={() => setOpen(false)}
        />
        <div className={styles["filter-container"]}>{children}</div>
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
              <ButtonLink alt small type="submit">
                Appliquer
              </ButtonLink>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
};
