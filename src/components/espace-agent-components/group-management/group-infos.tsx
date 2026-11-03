import { Fragment, useMemo } from "react";
import NonRenseigne from "#/components/non-renseigne";
import type { IAgentScope } from "#/models/authentication/agent/scopes/constants";
import type { IAgentsGroup } from "#/models/authentication/group";
import { formatSiret } from "#/utils/helpers";

import styles from "./styles.module.css";

function filterHiddenScopes(scopes: IAgentScope[]) {
  return scopes.filter((scope) => !["administrateur", "agent"].includes(scope));
}

function formatScope(scope: string) {
  return scope.replace(/_/g, " ").toUpperCase();
}

export function GroupInfos({
  group,
  isAdmin,
}: {
  group: Pick<
    IAgentsGroup,
    "contract_description" | "contract_url" | "organisation_siret" | "scopes"
  >;
  isAdmin: boolean;
}) {
  const visibleScopes = useMemo(
    () => filterHiddenScopes(group.scopes),
    [group.scopes]
  );
  return (
    <div className={styles.groupInfosContainer}>
      <div>
        <strong>Habilitation :</strong>{" "}
        {group.contract_description || <i>Aucune habilitation</i>}
        {group.contract_url && (
          <>
            {" "}
            (
            <a
              href={group.contract_url}
              rel="noopener noreferrer"
              target="_blank"
            >
              consulter
            </a>
            )
          </>
        )}
      </div>
      <div>
        <strong>Organisation :</strong>{" "}
        <a
          href={`/etablissement/${group.organisation_siret}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {formatSiret(group.organisation_siret)}
        </a>
      </div>
      <div>
        <strong>Données accessibles :</strong>{" "}
        {visibleScopes.length > 0 ? (
          visibleScopes.map((scope) => (
            <Fragment key={scope}>
              <span className="fr-badge fr-badge--purple-glycine fr-badge--sm">
                {formatScope(scope)}
              </span>
              &nbsp;
            </Fragment>
          ))
        ) : (
          <NonRenseigne />
        )}
      </div>
      {isAdmin && group.contract_url && (
        <p>
          Votre mission ou le cadre juridique de ce groupe est modifié ?{" "}
          <a href={group.contract_url}>
            Demandez une mise à jour de votre habilitation
          </a>{" "}
          pour accèder à des données supplémentaires.
        </p>
      )}
    </div>
  );
}
