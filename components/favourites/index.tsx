'use client';
import { useEffect, useState } from 'react';
import { Tag } from '#components-ui/tag';
import { formatIntFr } from '#utils/helpers';
import { useStorage } from 'hooks';

export default function Favourites() {
  const [shortCuts, setShortCuts] = useState([]);
  const [recentVisits] = useStorage('local', 'favourites-siren', []);

  useEffect(() => {
    setShortCuts(recentVisits);
  }, [recentVisits]);

  const plural = shortCuts.length > 1 ? 's' : '';

  return (
    shortCuts.length > 0 && (
      <>
        <small className="layout-center">
          Page{plural} récemment consultée{plural} :
        </small>
        <div className="layout-center">
          {shortCuts.map(({ siren, name, path }) => {
            const fullName = `${formatIntFr(siren)}${name ? ` - ${name}` : ''}`;

            return (
              <Tag
                link={{
                  href: path || `/entreprise/${siren}`,
                  'aria-label': `Consulter la page de ${fullName}`,
                }}
                maxWidth="300px"
                key={siren}
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
