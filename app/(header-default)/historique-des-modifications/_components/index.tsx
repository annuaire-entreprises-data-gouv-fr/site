"use client";

import { useMemo, useState } from "react";
import { Icon } from "#components-ui/icon/wrapper";
import { Tag } from "#components-ui/tag";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { changelogData } from "#models/historique-modifications";

export default function ChangelogWithFilters({
  session,
}: {
  session: ISession | null;
}) {
  const [showAgents, setShowAgents] = useState<boolean>(
    hasRights(session, ApplicationRights.isAgent)
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
            aria-label="Filtrer les nouveautés par périmètre"
            className="fr-fieldset__legend"
            id="sidebar_category_legend"
          >
            Filtrer par périmètre :
          </legend>
          <div className="fr-fieldset__element">
            <div className="fr-checkbox-group">
              <input
                checked={showPublic}
                id="filter-all"
                onChange={() => setShowPublic(!showPublic)}
                type="checkbox"
              />
              <label className="fr-label" htmlFor="filter-all">
                Site public
              </label>
            </div>
          </div>
          <div className="fr-fieldset__element">
            <div className="fr-checkbox-group">
              <input
                checked={showAgents}
                id="filter-agent"
                onChange={() => setShowAgents(!showAgents)}
                type="checkbox"
              />
              <label className="fr-label" htmlFor="filter-agent">
                Espace agent public
              </label>
            </div>
          </div>
          <div className="fr-fieldset__element">
            <div className="fr-checkbox-group">
              <input
                checked={showAPI}
                id="filter-api"
                onChange={() => setShowAPI(!showAPI)}
                type="checkbox"
              />
              <label className="fr-label" htmlFor="filter-api">
                API (développeurs)
              </label>
            </div>
          </div>
        </fieldset>
      </div>
      <div aria-live="polite" className="fr-col-md-9">
        {data.map((change, index) => (
          <div className="fr-mb-4w" key={`${change.date}-${index}`}>
            <h3>{change.date}</h3>
            <div
              className="fr-mb-4w fr-px-2w fr-py-2w"
              style={{ backgroundColor: "#f6f6f6", borderRadius: "3px" }}
            >
              {change.target.agent && (
                <Tag color="agent">
                  <Icon size={12} slug="lockFill">
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
