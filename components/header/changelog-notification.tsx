'use client';

import { Icon } from '#components-ui/icon/wrapper';
import { lastDates } from '#models/historique-modifications';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { formatDate } from '#utils/helpers';
import { useStorage } from 'hooks';
import { useEffect, useState } from 'react';
import style from './changelog-notification.module.css';

const NEW_SINCE_LAST_VISIT_ID = 'new-since-last-visit';

function convertToISO(frenchDate: string) {
  const [day, month, year] = frenchDate.split('/');
  return `${year}-${month}-${day}`;
}

export default function ChangelogNotification({
  session,
}: {
  session: ISession | null;
}) {
  const isAgent = hasRights(session, ApplicationRights.isAgent);
  const lastRelevantChangelog = isAgent ? lastDates.agent : lastDates.site;
  const [shouldDisplayNotif, setShouldDisplayNotif] = useState(false);

  const [lastChangelogViewed, saveLastChangelogViewed] = useStorage(
    'local',
    NEW_SINCE_LAST_VISIT_ID,
    null
  );

  useEffect(() => {
    const pageIsChangelog =
      window.location.pathname === '/historique-des-modifications';

    if (pageIsChangelog) {
      saveLastChangelogViewed(lastRelevantChangelog);
    }

    if (!lastChangelogViewed) {
      saveLastChangelogViewed(formatDate(new Date()));
    }

    if (
      lastChangelogViewed &&
      lastRelevantChangelog &&
      convertToISO(lastChangelogViewed) < convertToISO(lastRelevantChangelog)
    ) {
      setShouldDisplayNotif(true);
    }
  }, [lastChangelogViewed, lastRelevantChangelog, saveLastChangelogViewed]);

  return shouldDisplayNotif ? (
    <a
      href="/historique-des-modifications"
      className={style.changelogNotification + ' fr-link'}
      title="Découvrir les dernières évolutions de l’Annuaire des Entreprises"
    >
      <Icon slug="present">
        <span className={style.notificationText}>Nouveautés</span>
      </Icon>
    </a>
  ) : null;
}
