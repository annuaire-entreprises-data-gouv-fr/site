import type { PropsWithChildren } from "react";
import { EAdministration } from "#models/administrations/EAdministration";
import type { IUniteLegale } from "#models/core/types";
import AgentWall from ".";

const AgentWallAssociationProtected: React.FC<
  PropsWithChildren<{
    title: string;
    id: string;
    uniteLegale: IUniteLegale;
  }>
> = ({ uniteLegale, id, title }) => (
  <AgentWall
    id={id}
    modalFooter={
      <>
        Les <strong>particuliers, salariés</strong> et{" "}
        <strong>entrepreneurs</strong>, peuvent consulter cette donnée sur{" "}
        <a
          href={`https://www.data-asso.fr/annuaire/association/${uniteLegale.association.idAssociation}?docFields=documentsDac,documentsRna`}
          rel="noopener noreferrer"
          target="_blank"
        >
          la fiche data-asso
        </a>{" "}
        de cette association.
      </>
    }
    sources={[EAdministration.MI, EAdministration.DJEPVA]}
    title={title}
  />
);

export default AgentWallAssociationProtected;
