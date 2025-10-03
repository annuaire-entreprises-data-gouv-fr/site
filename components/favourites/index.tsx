"use client";
import { useStorage } from "hooks";
import { useEffect, useState } from "react";
import { Tag } from "#components-ui/tag";
import { formatIntFr, pluralize } from "#utils/helpers";

export default function Favourites() {
  const [shortCuts, setShortCuts] = useState([]);
  const [recentVisits] = useStorage("local", "favourites-siren", []);

  useEffect(() => {
    setShortCuts(recentVisits);
  }, [recentVisits]);

  const plural = pluralize(shortCuts);

  return (
    shortCuts.length > 0 && (
      <>
        <small className="layout-center">
          Page{plural} récemment consultée{plural} :
        </small>
        <div className="layout-center">
          {shortCuts.map(({ siren, name, path }) => {
            const fullName = `${formatIntFr(siren)}${name ? ` - ${name}` : ""}`;

            return (
              <Tag
                key={siren}
                link={{
                  href: path || `/entreprise/${siren}`,
                  "aria-label": `Consulter la page de ${fullName}`,
                }}
                maxWidth="300px"
              >
                {fullName}
              </Tag>
            );
          })}
        </div>
      </>
    )
  );
}
