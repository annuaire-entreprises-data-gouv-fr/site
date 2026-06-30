import { addOverlay, mapStyles, Overlay, SearchControl } from "carte-facile";
import maplibregl, { type GeoJSONSource } from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import type { ICollectiviteTerritoriale } from "#/models/core/types";

interface ICollectiviteMapProps {
  geoCommune: GeoResponse;
  uniteLegale: ICollectiviteTerritoriale;
}

interface INavigationItem {
  children?: INavigationItem[];
  href: string;
  id: string;
  label: string;
}

export interface GeoResponse {
  centre: {
    type: "Point";
    coordinates: [number, number];
  };
  code: string;
  codesPostaux: string[];
  contour: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
  departement: {
    code: string;
    nom: string;
  };
  epci: {
    code: string;
    nom: string;
  };
  mairie: {
    type: "Point";
    coordinates: [number, number];
  };
  nom: string;
  population: number;
  region: {
    code: string;
    nom: string;
  };
  siren: string;
  surface: number;
  type: string;
}

const navigationItems: INavigationItem[] = [
  {
    href: "#identite",
    id: "identite",
    label: "Identité de la collectivité",
  },
  {
    children: [
      {
        href: "#adresses-bati",
        id: "adresses-bati",
        label: "Adresses & bâti",
      },
      { href: "#urbanisme", id: "urbanisme", label: "Urbanisme" },
    ],
    href: "#amenagement-du-territoire",
    id: "amenagement-du-territoire",
    label: "Aménagement du territoire",
  },
  { href: "#transport", id: "transport", label: "Transport" },
  { href: "#education", id: "education", label: "Éducation" },
  { href: "#environnement", id: "environnement", label: "Environnement" },
  { href: "#elections", id: "elections", label: "Élections" },
  {
    href: "#economie-locale",
    id: "economie-locale",
    label: "Économie locale",
  },
  { href: "#demographie", id: "demographie", label: "Démographie" },
  { href: "#finances", id: "finances", label: "Finances" },
];

const defaultActiveHref = navigationItems[0].href;
const defaultExpandedSectionIds = [navigationItems[0].id];
const communeFillLayerId = "collectivite-commune-fill";
const communeLineLayerId = "collectivite-commune-line";
const communeSourceId = "collectivite-commune";

interface CommuneContour {
  coordinates: [number, number][][];
  type: "Polygon";
}

function collapseClassName(isExpanded: boolean) {
  return `fr-collapse${isExpanded ? " fr-collapse--expanded" : ""}`;
}

function findParentSectionIds(
  href: string,
  items = navigationItems,
  parentIds: string[] = []
): string[] {
  for (const item of items) {
    if (item.href === href) {
      return parentIds;
    }

    if (item.children) {
      const parents = findParentSectionIds(href, item.children, [
        ...parentIds,
        item.id,
      ]);

      if (parents.length > 0) {
        return parents;
      }
    }
  }

  return [];
}

function getSidemenuItemClassName(isActive: boolean) {
  return `fr-sidemenu__item${isActive ? " fr-sidemenu__item--active" : ""}`;
}

function hasNavigationHref(href: string, items = navigationItems): boolean {
  return items.some(
    (item) =>
      item.href === href ||
      (item.children ? hasNavigationHref(href, item.children) : false)
  );
}

function buildCommuneFeature(
  contour: CommuneContour
): GeoJSON.Feature<GeoJSON.Polygon> {
  return {
    geometry: contour,
    properties: {},
    type: "Feature",
  };
}

function getCommuneBounds(contour: CommuneContour) {
  const bounds = new maplibregl.LngLatBounds();

  for (const ring of contour.coordinates) {
    for (const coordinate of ring) {
      bounds.extend(coordinate);
    }
  }

  return bounds;
}

function drawCommuneOnMap(map: maplibregl.Map, contour: CommuneContour) {
  const communeFeature = buildCommuneFeature(contour);
  const source = map.getSource(communeSourceId) as GeoJSONSource | undefined;

  if (source) {
    source.setData(communeFeature);
  } else {
    map.addSource(communeSourceId, {
      data: communeFeature,
      type: "geojson",
    });
  }

  if (!map.getLayer(communeFillLayerId)) {
    map.addLayer({
      id: communeFillLayerId,
      paint: {
        "fill-color": "#000091",
        "fill-opacity": 0.16,
      },
      source: communeSourceId,
      type: "fill",
    });
  }

  if (!map.getLayer(communeLineLayerId)) {
    map.addLayer({
      id: communeLineLayerId,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#000091",
        "line-width": 3,
      },
      source: communeSourceId,
      type: "line",
    });
  }

  const bounds = getCommuneBounds(contour);

  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, {
      duration: 0,
      maxZoom: 13,
      padding: 48,
    });
  }
}

export function CollectiviteMap({
  uniteLegale,
  geoCommune,
}: ICollectiviteMapProps) {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [activeHref, setActiveHref] = useState(defaultActiveHref);
  const [expandedSectionIds, setExpandedSectionIds] = useState(
    () => new Set(defaultExpandedSectionIds)
  );
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  useEffect(() => {
    if (uniteLegale.colter) {
      // Création la carte
      const map = new maplibregl.Map({
        container: "collectivite-map", // id du conteneur de la carte
        style: mapStyles.simple, // style de carte
        maxZoom: 18.9, // niveau de zoom maximum, adapté aux cartes utilisant les données IGN
      });

      mapRef.current = map;

      map.addControl(
        new SearchControl({
          placeholder: "Rechercher une adresse…",
          debounceMs: 300, // Délai avant déclenchement (ms)
          minChars: 3, // Nombre minimum de caractères
          maxResults: 5, // Nombre maximum de résultats affichés
        }),
        "top-right"
      );

      addOverlay(map, Overlay.administrativeBoundaries);

      return () => {
        mapRef.current = null;
        map.remove();
      };
    }
  }, [uniteLegale.colter]);

  useEffect(() => {
    if (!(geoCommune.contour && mapRef.current)) {
      return;
    }

    const map = mapRef.current;
    const drawCommune = () => {
      drawCommuneOnMap(map, geoCommune.contour);
    };

    if (map.isStyleLoaded()) {
      drawCommune();
    } else {
      map.once("load", drawCommune);
    }

    return () => {
      map.off("load", drawCommune);
    };
  }, [geoCommune]);

  useEffect(() => {
    const updateActiveHrefFromHash = () => {
      const hash = window.location.hash;

      if (!hasNavigationHref(hash)) {
        return;
      }

      setActiveHref(hash);
      setExpandedSectionIds((currentExpandedSectionIds) => {
        const nextExpandedSectionIds = new Set(currentExpandedSectionIds);

        for (const sectionId of findParentSectionIds(hash)) {
          nextExpandedSectionIds.add(sectionId);
        }

        return nextExpandedSectionIds;
      });
    };

    updateActiveHrefFromHash();
    window.addEventListener("hashchange", updateActiveHrefFromHash);

    return () => {
      window.removeEventListener("hashchange", updateActiveHrefFromHash);
    };
  }, []);

  const handleLinkClick = (href: string) => {
    setActiveHref(href);
    setExpandedSectionIds((currentExpandedSectionIds) => {
      const nextExpandedSectionIds = new Set(currentExpandedSectionIds);

      for (const sectionId of findParentSectionIds(href)) {
        nextExpandedSectionIds.add(sectionId);
      }

      return nextExpandedSectionIds;
    });
  };

  const handleSectionClick = (item: INavigationItem) => {
    setActiveHref(item.href);
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
    <div className="fr-grid-row fr-grid-row--gutters fr-mt-4w">
      <div
        className="fr-col-12 fr-col-md-8"
        id="collectivite-map"
        style={{ height: "500px" }}
      />
      <div className="fr-col-12 fr-col-md-4">
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
                  const isActive =
                    activeHref === item.href ||
                    !!item.children?.some((child) => child.href === activeHref);
                  const isExpanded = expandedSectionIds.has(item.id);
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
                                    activeHref === child.href
                                  )}
                                  key={child.id}
                                >
                                  <a
                                    aria-current={
                                      activeHref === child.href
                                        ? "page"
                                        : undefined
                                    }
                                    className="fr-sidemenu__link"
                                    href={child.href}
                                    onClick={() => handleLinkClick(child.href)}
                                  >
                                    {child.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      ) : (
                        <a
                          aria-current={
                            activeHref === item.href ? "page" : undefined
                          }
                          className="fr-sidemenu__link"
                          href={item.href}
                          onClick={() => handleLinkClick(item.href)}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
