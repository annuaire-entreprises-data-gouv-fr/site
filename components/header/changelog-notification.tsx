'use client';

import { Icon } from '#components-ui/icon/wrapper';
import { changelogData } from '#models/historique-modifications';
import { AppScope, hasRights } from '#models/user/rights';
import { formatDate } from '#utils/helpers';
import { useStorage } from 'hooks';
import useSession from 'hooks/use-session';
import { useEffect } from 'react';
import style from './changelog-notification.module.css';

const NEW_SINCE_LAST_VISIT_ID = 'new-since-last-visit';
const siteChangelog = changelogData.filter(
  ({ target }) => !(target.api === true && Object.keys(target.api).length === 1)
);

function convertToISO(frenchDate: string) {
  const [day, month, year] = frenchDate.split('/');
  return `${year}-${month}-${day}`;
}

export default function ChangelogNotification() {
  const session = useSession();
  const isAgent = hasRights(session, AppScope.isAgent);

  const dateOfLastNews = siteChangelog.find(
    ({ target }) => target.site || (isAgent && target.agent)
  )?.date;

  const [previousDateOfLastNews, saveDateOfLastNews] = useStorage(
    'local',
    NEW_SINCE_LAST_VISIT_ID,
    null
  );

  useEffect(() => {
    if (window.location.pathname === '/historique-des-modifications') {
      saveDateOfLastNews(dateOfLastNews);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!previousDateOfLastNews) {
    saveDateOfLastNews(formatDate(new Date()));
  }

  if (
    !previousDateOfLastNews ||
    !dateOfLastNews ||
    convertToISO(previousDateOfLastNews) >= convertToISO(dateOfLastNews)
  ) {
    return null;
  }

  return (
    <a
      href="/historique-des-modifications"
      className={style.changelogNotification + ' fr-link'}
      title="Découvrir les dernières évolutions de l’Annuaire des Entreprises"
    >
      <Icon slug="present">
        <span className={style.notificationText}>Nouveautés</span>
      </Icon>
    </a>
  );
}
