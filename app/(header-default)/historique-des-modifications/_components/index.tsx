'use client';

import { useEffect, useState } from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import { Tag } from '#components-ui/tag';
import { IChangelog, changelogData } from '#models/historique-modifications';

/**
 * Full client changelog (no server rendering as it triggers hydration errors)
 */
export default function ChangelogWithFilters() {
  const [showAgents, setShowAgents] = useState<boolean>(true);
  const [showPublic, setShowPublic] = useState<boolean>(true);

  const [data, setData] = useState<IChangelog[]>([]);

  /** render empty list to avoid hydration errors */
  useEffect(() => {
    setData(changelogData);
  }, []);

  useEffect(() => {
    setData(
      changelogData
        .filter((c) => showAgents || !c.isProtected)
        .filter((c) => showPublic || c.isProtected)
    );
  }, [showAgents, showPublic]);

  return (
    <div className="fr-grid-row fr-grid-row--gutters">
      <div className="fr-col-md-3">
        <br />
        <fieldset
          aria-labelledby="sidebar_category_legend"
          className="fr-fieldset"
        >
          <legend className="fr-fieldset__legend" id="sidebar_category_legend">
            Filtres
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
                Accessible à tous
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
        </fieldset>
      </div>
      <div className="fr-col-md-9">
        {data.map((change, index) => (
          <div key={`${change.date}-${index}`} className="fr-mb-4w">
            <h3>{change.date}</h3>
            <div
              className="fr-mb-4w fr-px-2w fr-py-2w"
              style={{ backgroundColor: '#f6f6f6', borderRadius: '3px' }}
            >
              {change.isProtected ? (
                <Tag color="agent">
                  <Icon slug="lockFill" size={12}>
                    espace Agent public
                  </Icon>
                </Tag>
              ) : (
                <Tag color="info">accessible à tous</Tag>
              )}
              {change.htmlBody && (
                <p dangerouslySetInnerHTML={{ __html: change.htmlBody }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
