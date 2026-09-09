import { Link } from "#/components/link";
import NonRenseigne from "#/components/non-renseigne";
import { FullTable } from "#/components/table/full";
import type { IFondationsRestreintes } from "#/models/espace-agent/fondations-restreintes/types";
import { isIdRnf } from "#/utils/helpers/fondations";

export const NoLiensFondation = () => (
  <p>Aucun lien entre organismes n’a été retrouvé pour cette fondation.</p>
);

export function LiensFondationContent({
  filiation,
}: Pick<IFondationsRestreintes, "filiation">) {
  if (filiation.length === 0) {
    return <NoLiensFondation />;
  }

  return (
    <>
      <p>
        Organismes issus d’une transformation, d’une fusion ou d’une scission,
        déclarés au Répertoire national des fondations (RNF).
      </p>
      <FullTable
        body={filiation.map(({ typeOperation, identifiant }) => [
          typeOperation || <NonRenseigne />,
          identifiant ? (
            isIdRnf(identifiant) ? (
              <Link
                params={{ slug: identifiant }}
                search={(search) => ({ from: search.from })}
                to="/fondation/$slug"
              >
                {identifiant}
              </Link>
            ) : (
              identifiant
            )
          ) : (
            <NonRenseigne />
          ),
        ])}
        head={[
          "Type d’opération",
          "Identifiant de l’organisme issu de l’opération",
        ]}
      />
    </>
  );
}
