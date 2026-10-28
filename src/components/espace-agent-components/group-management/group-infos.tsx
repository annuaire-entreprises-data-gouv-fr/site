import { Fragment } from "react";
import NonRenseigne from "#/components/non-renseigne";
import type { IAgentsGroup } from "#/models/authentication/group";
import { formatSiret } from "#/utils/helpers";

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
  return (
    <>
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
        {group.scopes && group.scopes.length > 0 ? (
          group.scopes.map((scope) => (
            <Fragment key={scope}>
              <span className="fr-badge fr-badge--sm">{scope}</span>
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
    </>
  );
}
