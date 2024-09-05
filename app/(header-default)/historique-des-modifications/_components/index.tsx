'use client';

import { Icon } from '#components-ui/icon/wrapper';
import { Tag } from '#components-ui/tag';
import { changelogData } from '#models/historique-modifications';
import { AppScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { useMemo, useState } from 'react';

export default function ChangelogWithFilters({
  session,
}: {
  session: ISession | null;
}) {
  const [showAgents, setShowAgents] = useState<boolean>(
    hasRights(session, AppScope.isAgent)
  );
  const [showPublic, setShowPublic] = useState<boolean>(true);
  const [showAPI, setShowAPI] = useState<boolean>(false);

  const data = useMemo(
    () =>
      changelogData.filter(
        ({ target }) =>
          (target.api && showAPI) ||
          (target.site && showPublic) ||
          (target.agent && showAgents)
      ),
    [showAgents, showPublic, showAPI]
  );

  return (
    <div className="fr-grid-row fr-grid-row--gutters">
      <div className="fr-col-md-3">
        <br />
        <fieldset
          aria-labelledby="sidebar_category_legend"
          className="fr-fieldset"
        >
          <legend
            className="fr-fieldset__legend"
            id="sidebar_category_legend"
            aria-label="Filtrer les nouveautés par périmètre"
          >
            Filtrer par périmètre :
          </legend>
          <div className="fr-fieldset__element">
            <div className="fr-checkbox-group">
              <input
                onChange={() => setShowPublic(!showPublic)}
                id="filter-all"
                type="checkbox"
                checked={showPublic}
              />
              <label className="fr-label" htmlFor="filter-all">
                Site public
              </label>
            </div>
          </div>
          <div className="fr-fieldset__element">
            <div className="fr-checkbox-group">
              <input
                onChange={() => setShowAgents(!showAgents)}
                id="filter-agent"
                type="checkbox"
                checked={showAgents}
              />
              <label className="fr-label" htmlFor="filter-agent">
                Espace agent public
              </label>
            </div>
          </div>
          <div className="fr-fieldset__element">
            <div className="fr-checkbox-group">
              <input
                onChange={() => setShowAPI(!showAPI)}
                id="filter-api"
                type="checkbox"
                checked={showAPI}
              />
              <label className="fr-label" htmlFor="filter-api">
                API (développeurs)
              </label>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="fr-col-md-9" aria-live="polite">
        {data.map((change, index) => (
          <div key={`${change.date}-${index}`} className="fr-mb-4w">
            <h3>{change.date}</h3>
            <div
              className="fr-mb-4w fr-px-2w fr-py-2w"
              style={{ backgroundColor: '#f6f6f6', borderRadius: '3px' }}
            >
              {change.target.agent && (
                <Tag color="agent">
                  <Icon slug="lockFill" size={12}>
                    Espace Agent public
                  </Icon>
                </Tag>
              )}
              {change.target.site && <Tag color="info">Site public</Tag>}
              {change.target.api && <Tag color="new">API (développeurs)</Tag>}
              {change.htmlBody && (
                <div dangerouslySetInnerHTML={{ __html: change.htmlBody }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
