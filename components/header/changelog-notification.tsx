'use client';

import { useEffect } from 'react';
import FadeIn from '#components-ui/animation/fade-in';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import { changelogData } from '#models/historique-modifications';
import { EScope, hasRights } from '#models/user/rights';
import { useStorage } from 'hooks';
import useSession from 'hooks/use-session';
import style from './nouveautes-badge.module.css';

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
  const isAgent = hasRights(session, EScope.isAgent);

  const dateOfLastNews = siteChangelog.find(
    ({ target }) => target.site || (isAgent && target.agent)
  )?.date;

  const [previousDateOfLastNews, saveDateOfLastNews] = useStorage(
    'local',
    NEW_SINCE_LAST_VISIT_ID,
    dateOfLastNews
  );

  useEffect(() => {
    if (window.location.pathname === '/historique-des-modifications') {
      saveDateOfLastNews(dateOfLastNews);
    }
  }, []);

  if (
    !dateOfLastNews ||
    !previousDateOfLastNews ||
    convertToISO(previousDateOfLastNews) >= convertToISO(dateOfLastNews)
  ) {
    return null;
  }

  return (
    <li>
      <FadeIn>
        <InformationTooltip
          verticalOrientation="bottom"
          label="Découvrir les nouveautés"
          width={200}
          tabIndex={undefined}
          ariaRelation="labelledby"
        >
          <a
            href="/historique-des-modifications"
            className={style.changelogNotification + ' fr-btn  fr-btn--sm'}
          >
            <Icon slug="present" />
          </a>
        </InformationTooltip>
      </FadeIn>
    </li>
  );
}
