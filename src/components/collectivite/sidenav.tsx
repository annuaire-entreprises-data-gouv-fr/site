import { useMatchRoute } from "@tanstack/react-router";
import { type ComponentProps, useState } from "react";
import { Link } from "../link";

interface INavigationItem
  extends Omit<ComponentProps<typeof Link>, "children"> {
  children?: INavigationItem[];
  id: string;
  label: string;
}
const navigationItems: INavigationItem[] = [
  {
    to: "/collectivite/$slug/identite",
    id: "identite",
    label: "Identité de la collectivité",
  },
  {
    children: [
      {
        to: "/collectivite/$slug/amenagement-et-batiment",
        id: "amenagement-et-batiment",
        label: "Aménagement et bâtiment",
      },
      {
        to: "/collectivite/$slug/urbanisme" as any,
        id: "urbanisme",
        label: "Urbanisme",
      },
    ],
    id: "amenagement-du-territoire",
    label: "Aménagement du territoire",
  },
  {
    to: "/collectivite/$slug/transport" as any,
    id: "transport",
    label: "Transport",
  },
  {
    to: "/collectivite/$slug/education" as any,
    id: "education",
    label: "Éducation",
  },
  {
    to: "/collectivite/$slug/environnement" as any,
    id: "environnement",
    label: "Environnement",
  },
  {
    to: "/collectivite/$slug/elections" as any,
    id: "elections",
    label: "Élections",
  },
  {
    to: "/collectivite/$slug/economie-locale",
    id: "economie-locale",
    label: "Économie locale",
  },
  {
    to: "/collectivite/$slug/demographie" as any,
    id: "demographie",
    label: "Démographie",
  },
  {
    to: "/collectivite/$slug/finances",
    id: "finances",
    label: "Finances",
  },
];

function collapseClassName(isExpanded: boolean) {
  return `fr-collapse${isExpanded ? " fr-collapse--expanded" : ""}`;
}

function getSidemenuItemClassName(isActive: boolean) {
  return `fr-sidemenu__item${isActive ? " fr-sidemenu__item--active" : ""}`;
}

interface CollectiviteSidenavProps {
  slug: string;
}

export function CollectiviteSidenav(props: CollectiviteSidenavProps) {
  const { slug } = props;
  const [expandedSectionIds, setExpandedSectionIds] = useState(() => new Set());
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const matchRoute = useMatchRoute();

  const handleSectionClick = (item: INavigationItem) => {
    setExpandedSectionIds((currentExpandedSectionIds) => {
      const nextExpandedSectionIds = new Set(currentExpandedSectionIds);

      if (nextExpandedSectionIds.has(item.id)) {
        nextExpandedSectionIds.delete(item.id);
      } else {
        nextExpandedSectionIds.add(item.id);
      }

      return nextExpandedSectionIds;
    });
  };

  return (
    <nav
      aria-labelledby="sidemenu-title"
      className="fr-sidemenu fr-sidemenu--right fr-sidemenu--sticky"
    >
      <div className="fr-sidemenu__inner">
        <button
          aria-controls="sidemenu"
          aria-expanded={isMenuExpanded}
          className="fr-sidemenu__btn"
          onClick={() => setIsMenuExpanded((isExpanded) => !isExpanded)}
          type="button"
        >
          Dans cette rubrique
        </button>
        <div className={collapseClassName(isMenuExpanded)} id="sidemenu">
          <p className="fr-sidemenu__title" id="sidemenu-title">
            Données de la collectivité
          </p>
          <ul className="fr-sidemenu__list">
            {navigationItems.map((item) => {
              const hasChildren = !!item.children?.length;
              const isActive = !!(item.to && matchRoute({ to: item.to }));
              const hasActiveChildren = !!item.children?.some(
                (child) => child.to && matchRoute({ to: child.to })
              );
              const isExpanded =
                expandedSectionIds.has(item.id) ||
                isActive ||
                hasActiveChildren;
              const submenuId = `sidemenu-${item.id}`;

              return (
                <li
                  className={getSidemenuItemClassName(isActive)}
                  key={item.id}
                >
                  {hasChildren ? (
                    <>
                      <button
                        aria-controls={submenuId}
                        aria-current={isActive ? "true" : undefined}
                        aria-expanded={isExpanded}
                        className="fr-sidemenu__btn"
                        onClick={() => handleSectionClick(item)}
                        type="button"
                      >
                        {item.label}
                      </button>
                      <div
                        className={collapseClassName(isExpanded)}
                        id={submenuId}
                      >
                        <ul className="fr-sidemenu__list">
                          {item.children?.map((child) => (
                            <li
                              className={getSidemenuItemClassName(
                                child.to
                                  ? !!matchRoute({ to: child.to })
                                  : false
                              )}
                              key={child.id}
                            >
                              <Link
                                aria-current={
                                  child.to && matchRoute({ to: child.to })
                                    ? "page"
                                    : undefined
                                }
                                className="fr-sidemenu__link"
                                params={{ slug }}
                                resetScroll={false}
                                to={child.to}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className="fr-sidemenu__link"
                      params={{ slug }}
                      resetScroll={false}
                      to={item.to}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
