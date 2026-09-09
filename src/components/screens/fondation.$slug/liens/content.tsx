import { Link } from "#/components/link";
import NonRenseigne from "#/components/non-renseigne";
import { FullTable } from "#/components/table/full";
import type { IFondationsRestreintes } from "#/models/espace-agent/fondations-restreintes/types";
import { isIdRnf } from "#/utils/helpers/fondations";
import styles from "./styles.module.css";

type LiensEntreOrganismes = IFondationsRestreintes["liensEntreOrganismes"];
type Organisme = LiensEntreOrganismes["organismesIssusScission"][number];

export const NoLiensFondation = () => (
  <p>Aucun lien entre organismes n’a été retrouvé pour cette fondation.</p>
);

function OrganismesTable({ organismes }: { organismes: Organisme[] }) {
  return (
    <FullTable
      body={organismes.map(({ type, identifiant }) => [
        type || <NonRenseigne />,
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
      head={["Type d’organisme", "Identifiant"]}
    />
  );
}

export function LiensFondationContent({
  liensEntreOrganismes,
}: Pick<IFondationsRestreintes, "liensEntreOrganismes">) {
  const {
    organismeIssuTransformation,
    organismeIssuFusion,
    organismesIssusScission,
  } = liensEntreOrganismes;

  if (
    !(
      organismeIssuTransformation ||
      organismeIssuFusion ||
      organismesIssusScission.length
    )
  ) {
    return <NoLiensFondation />;
  }

  return (
    <>
      <p>
        Liens déclarés au Répertoire national des fondations (RNF) à la suite
        d’une transformation, d’une fusion ou d’une scission.
      </p>
      {organismeIssuTransformation && (
        <div className={styles.relation}>
          <h3>Organisme issu d’une transformation</h3>
          <OrganismesTable organismes={[organismeIssuTransformation]} />
        </div>
      )}
      {organismeIssuFusion && (
        <div className={styles.relation}>
          <h3>Organisme issu d’une fusion</h3>
          <OrganismesTable organismes={[organismeIssuFusion]} />
        </div>
      )}
      {organismesIssusScission.length > 0 && (
        <div className={styles.relation}>
          <h3>Organismes issus d’une scission</h3>
          <OrganismesTable organismes={organismesIssusScission} />
        </div>
      )}
    </>
  );
}
