"use client";

import { useState } from "react";
import {
  AssociationBadge,
  CollectiviteTerritorialeBadge,
  DefaultStructureBadge,
  EntrepriseIndividuelleBadge,
  LabelAndCertificateBadge,
  ServicePublicBadge,
} from "#components-ui/badge/frequent";
import { SimpleSeparator } from "#components-ui/horizontal-separator";

export const FilterStructure: React.FC<{
  type?: string;
  label?: string;
}> = ({ type = "", label = "" }) => {
  const [structureType, setStructureType] = useState(type);
  const [labelsSelected, setLabelsSelected] = useState<string[]>(
    label ? label.split(",") : []
  );

  const toggleLabel = (labelValue: string) => {
    setLabelsSelected((prev) => {
      if (labelValue === "") {
        return [];
      }
      if (prev.includes(labelValue)) {
        return prev.filter((l) => l !== labelValue);
      }
      return [...prev, labelValue];
    });
  };

  return (
    <>
      <label className="fr-label" htmlFor="structure-type-input">
        Type de structure :
      </label>
      <input
        id="structure-type-input"
        name="type"
        onChange={() => {}}
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
      <SimpleSeparator />
      <label className="fr-label" htmlFor="structure-label-input">
        Qualités, labels et certificats :
      </label>
      <input
        id="structure-label-input"
        name="label"
        onChange={() => {}}
        type="hidden"
        value={labelsSelected.join(",")}
      />
      <div className="badge-wrapper">
        <LabelAndCertificateBadge
          isSelected={labelsSelected.length === 0}
          label="Tous"
          onClick={() => setLabelsSelected([])}
          small
        />

        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("ess")}
          label="ESS - Économie Sociale et Solidaire"
          onClick={() => toggleLabel("ess")}
          small
        />

        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("sm")}
          label="Société à mission"
          onClick={() => toggleLabel("sm")}
          small
        />

        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("siae")}
          label="Entreprise Inclusive"
          onClick={() => toggleLabel("siae")}
          small
        />

        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("finess")}
          label="Établissements sanitaires et sociaux (Finess)"
          onClick={() => toggleLabel("finess")}
          small
        />

        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("bio")}
          label="Professionnels du Bio"
          onClick={() => toggleLabel("bio")}
          small
        />

        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("egapro")}
          label="Égalité professionnelle"
          onClick={() => toggleLabel("egapro")}
          small
        />

        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("rge")}
          label="RGE - Reconnu Garant de l'Environnement"
          onClick={() => toggleLabel("rge")}
          small
        />

        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("of")}
          label="Organisme de formation"
          onClick={() => toggleLabel("of")}
          small
        />

        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("qualiopi")}
          label="Qualiopi"
          onClick={() => toggleLabel("qualiopi")}
          small
        />

        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("esv")}
          label="Entrepreneur de spectacles vivants"
          onClick={() => toggleLabel("esv")}
          small
        />
        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("achats_responsables")}
          label="Achats Responsables"
          onClick={() => toggleLabel("achats_responsables")}
          small
        />

        <LabelAndCertificateBadge
          isSelected={labelsSelected.includes("patrimoine_vivant")}
          label="Entreprise du Patrimoine Vivant"
          onClick={() => toggleLabel("patrimoine_vivant")}
          small
        />
      </div>
      <style jsx>{`
        .badge-wrapper {
          display: flex;
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
};
