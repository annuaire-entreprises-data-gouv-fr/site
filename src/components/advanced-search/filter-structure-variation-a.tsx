import { useState } from "react";
import {
  AssociationBadge,
  CollectiviteTerritorialeBadge,
  DefaultStructureBadge,
  EntrepriseIndividuelleBadge,
  ServicePublicBadge,
} from "#/components-ui/badge/frequent";

export const FilterStructureVariationA: React.FC<{
  type?: string;
}> = ({ type = "" }) => {
  const [structureType, setStructureType] = useState(type);

  return (
    <>
      <label className="fr-label" htmlFor="structure-type-input">
        Type de structure :
      </label>
      <input
        id="structure-type-input"
        name="type"
        readOnly
        type="hidden"
        value={structureType}
      />
      <div className="badge-wrapper">
        <DefaultStructureBadge
          isSelected={structureType === ""}
          label="Tous"
          onClick={() => setStructureType("")}
          small
        />

        <CollectiviteTerritorialeBadge
          isSelected={structureType === "ct"}
          onClick={() => setStructureType("ct")}
          small
        />

        <AssociationBadge
          isSelected={structureType === "asso"}
          onClick={() => setStructureType("asso")}
          small
        />

        <ServicePublicBadge
          isSelected={structureType === "sp"}
          onClick={() => setStructureType("sp")}
          small
        />

        <EntrepriseIndividuelleBadge
          isSelected={structureType === "ei"}
          onClick={() => setStructureType("ei")}
          small
        />
      </div>
      <style>{`
        .badge-wrapper {
          display: flex;
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
};
