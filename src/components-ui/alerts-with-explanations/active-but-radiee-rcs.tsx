import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { estActif } from "#/models/core/etat-administratif";
import type { IUniteLegale } from "#/models/core/types";
import { isEntrepreneurIndividuel } from "#/models/core/types";
import { Warning } from "../alerts";

const ActiveButRadieeRCSAlert: React.FC<{
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}> = ({ uniteLegale, user }) => {
  if (
    !hasRights({ user }, ApplicationRights.isAgent) ||
    !uniteLegale.bodacc?.radiation?.estRadie ||
    !estActif(uniteLegale) ||
    uniteLegale.immatriculation?.dateRadiation
  ) {
    return null;
  }

  const radieText = `radié${isEntrepreneurIndividuel(uniteLegale) ? "" : "e"} dans le RCS`;

  const RCSText = uniteLegale.bodacc?.radiation?.idAnnonce ? (
    <a
      href={`https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:${uniteLegale.bodacc?.radiation?.idAnnonce}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {radieText}
    </a>
  ) : (
    radieText
  );

  return (
    <Warning full>
      {isEntrepreneurIndividuel(uniteLegale) ? (
        <>
          Cette structure est indiquée comme étant en activité dans le RNE ainsi
          que dans la base Sirene. En revanche, l'entreprise ou l'un de ses
          établissements semble {RCSText}.
        </>
      ) : (
        <>
          Cette structure est indiquée comme étant en activité dans le RNE ainsi
          que dans la base Sirene. En revanche, elle semble être {RCSText}.
          C’est une situation inhabituelle, qui peut provenir de délais de
          traitement.
        </>
      )}
    </Warning>
  );
};

export default ActiveButRadieeRCSAlert;
