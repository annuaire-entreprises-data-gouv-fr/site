import { useEffect, useState } from 'react';
import { Tag } from '#components-ui/tag';
import { formatIntFr } from '#utils/helpers';
import { useLocalStorage } from 'hooks';

export default function Favourites() {
  const [shortCuts, setShortCuts] = useState([]);
  const [recentVisits] = useLocalStorage('favourites-siren', []);

  useEffect(() => {
    setShortCuts(recentVisits);
  }, [recentVisits]);

  return (
    shortCuts.length > 0 && (
      <>
        <small className="layout-center">Pages récemment consultées :</small>
        <div className="layout-center">
          {shortCuts.map(({ siren, name, path }) => {
            const fullName = `${formatIntFr(siren)}${name ? ` - ${name}` : ''}`;

            return (
              <Tag
                link={{
                  href: path || `/entreprise/${siren}`,
                  'aria-label': `Consulter la page de ${fullName}`,
                }}
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
