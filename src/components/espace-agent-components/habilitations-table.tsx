import FAQLink from "#/components-ui/faq-link";
import { Icon } from "#/components-ui/icon/wrapper";
import { Tag } from "#/components-ui/tag";
import { useAuth } from "#/contexts/auth.context";
import type { IAgentsGroup } from "#/models/authentication/group";
import {
  ApplicationRights,
  getGroupsGrantingRights,
  hasRights,
} from "#/models/authentication/user/rights";

interface IHabilitationsTableProps {
  groups: IAgentsGroup[];
}

export function HabilitationsTable({ groups }: IHabilitationsTableProps) {
  const { user } = useAuth();

  const appRights = Object.values(ApplicationRights)
    .filter(
      (scope) =>
        scope !== ApplicationRights.isAgent &&
        scope !== ApplicationRights.opendata &&
        scope !== ApplicationRights.administrateur
    )
    .map((scope) => {
      const hasRight = hasRights({ user }, scope);
      let habilitation: React.ReactNode;
      if (hasRight) {
        const groupsGrantingRight = getGroupsGrantingRights(groups, scope);
        if (groupsGrantingRight.length > 0) {
          habilitation = (
            <div className="fr-grid-row">
              {groupsGrantingRight.map((group) => (
                <Tag
                  color="success"
                  key={group.id}
                  link={{
                    href: `/compte/mes-groupes#group-${group.id}`,
                    "aria-label": `Voir le groupe ${group.name}`,
                  }}
                >
                  <Icon slug="groupFill">{group.name}</Icon>
                </Tag>
              ))}
            </div>
          );
        } else {
          habilitation = (
            <Tag color="info">
              <Icon slug="checkLine">Agent Public</Icon>
            </Tag>
          );
        }
      } else {
        habilitation = (
          <Tag color="error">
            <Icon slug="closeCircleFill">Non Habilité</Icon>
          </Tag>
        );
      }

      return [
        tooltipContent[scope] ? (
          <FAQLink tooltipLabel={scope} width={320}>
            {tooltipContent[scope]}
          </FAQLink>
        ) : (
          scope
        ),
        habilitation,
      ];
    }) as [ApplicationRights, React.ReactNode][];

  return (
    <div className="fr-table fr-table--no-scroll">
      <div className="fr-table__wrapper">
        <div className="fr-table__container">
          <div className="fr-table__content">
            <table>
              <caption>Vos accès</caption>
              <thead>
                <tr>
                  <th scope="col">Nom de la donnée</th>
                  <th scope="col">Vos habilitations</th>
                </tr>
              </thead>
              <tbody>
                {appRights.map(([a, b]) => (
                  <tr key={a}>
                    <td>{a}</td>
                    <td>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const tooltipContent: Partial<
  Record<
    Exclude<
      ApplicationRights,
      | ApplicationRights.administrateur
      | ApplicationRights.isAgent
      | ApplicationRights.opendata
    >,
    React.ReactNode
  >
> = {
  [ApplicationRights.nonDiffusible]:
    "Entreprises non-diffusibles auprès de l’Insee",
  [ApplicationRights.beneficiaires]:
    "Liste des bénéficiaires effectifs d'une unité légale inscrite au répertoire national des entreprises (RNE)",
  [ApplicationRights.conformiteFiscale]: (
    <span>
      Attestation fiscale délivrée par la Direction générale des finances
      publiques (DGFIP), indiquant que l’entreprise est à jour de ses
      obligations fiscales (
      <a
        href="https://entreprise.api.gouv.fr/files/exemple-dgfip-attestation-fiscale.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        exemple.pdf
      </a>
      )
    </span>
  ),
  [ApplicationRights.conformiteSociale]: (
    <div>
      1. Statut des cotisations sociales d'une entreprise indiquant si elle est
      en règle auprès de la sécurité sociale agricole (MSA). <br />
      <br />
      2. Attestation sociale délivrée à une entreprise acquittée de ses
      obligations de cotisations et contributions sociales auprès de l'URSSAF
      Caisse nationale.
      <br />
      <a
        href="https://entreprise.api.gouv.fr/files/exemple-urssaf-attestation-sociale.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        exemple.pdf
      </a>
    </div>
  ),
  [ApplicationRights.effectifs]: (
    <div>
      Effectifs annuels et mensuels des régimes général et agricole d'une unité
      légale et d'un établissement, issus de l'Urssaf et de la MSA depuis le
      répertoire commun des déclarants opéré par le GIP-MDS.
      <br />
      Inclut l'effectif moyen et les effectifs liés à l'obligation d'emploi des
      travailleurs handicapés.
    </div>
  ),
  [ApplicationRights.bilansBDF]:
    "Obtenir les trois derniers bilans d’une entreprise détenus par la Banque de France.",
  [ApplicationRights.chiffreAffaires]:
    "Déclarations de chiffre d’affaires, des trois derniers exercices, faites auprès de la Direction générale des finances publiques (DGFIP).",
  [ApplicationRights.liensCapitalistiques]: (
    <span>
      Actionnaires et filiales de l'entreprise déclarés dans les CERFA 2059F et
      2059G des liasses fiscales de la DGFIP. (
      <a
        href="https://entreprise.api.gouv.fr/files/cerfa-2059f-2059g.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        cerfa-2059f-2059g.pdf
      </a>
      )
    </span>
  ),
  [ApplicationRights.travauxPublics]: (
    <div>
      Certificats de cotisation aux congés payés, chômage et intempéries dans le
      bâtiment (CIBTP, CNETP), carte professionnelle de travaux publics (FNTP)
      et cotisation retraite dans le bâtiment (ProBTP).
      <br />
      <a
        href="https://entreprise.api.gouv.fr/files/exemple-fntp-carte-professionnelle-travaux-publics.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        FNTP.pdf
      </a>
      <br />
      <a
        href="https://entreprise.api.gouv.fr/files/exemple-cibtp-attestations_cotisations_conges_payes_chomage_intemperies.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        CIBTP.pdf
      </a>
      <br />
      <a
        href="https://entreprise.api.gouv.fr/files/exemple-cnetp-attestations_cotisations_conges_payes_chomage_intemperies.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        CNETP.pdf
      </a>
      <br />
      <a
        href="https://entreprise.api.gouv.fr/files/exemple-probtp-conformites_cotisations_retraite.pdf"
        rel="noopener noreferrer"
        target="_blank"
      >
        ProBTP.pdf
      </a>
    </div>
  ),
  [ApplicationRights.liassesFiscales]: (
    <span>
      Informations renseignées dans les liasses fiscales, issues des
      déclarations de résultat d’une entreprise auprès de la Direction générale
      des finances publiques (DGFIP). (Télécharger la liste des données
      possibles par imprimé :{" "}
      <a
        href="https://entreprise.api.gouv.fr/files/api-entreprise_liasses_fiscales_liste-des-champs-par-imprime.xls"
        rel="noopener noreferrer"
        target="_blank"
      >
        exemple.xls
      </a>
      )
    </span>
  ),
};
