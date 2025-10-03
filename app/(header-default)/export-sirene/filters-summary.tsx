import { categoriesJuridiquesNiveau3 } from "#utils/helpers/formatting/metadata/categories-juridiques";
import { categoriesJuridiquesNiveau1 } from "#utils/helpers/formatting/metadata/categories-juridiques-niveau-1";
import { categoriesJuridiquesNiveau2 } from "#utils/helpers/formatting/metadata/categories-juridiques-niveau-2";
import { codesNAFRev2 } from "#utils/helpers/formatting/metadata/codes-NAF-rev-2";
import { codesSectionNAF } from "#utils/helpers/formatting/metadata/codes-section-NAF";
import type { ExtendedExportCsvInput } from "./export-csv";
import { selectedEffectifLabel } from "./filters";

export default function FiltersSummary({
  filters,
}: {
  filters: ExtendedExportCsvInput;
}) {
  return (
    <div>
      <h2>Récapitulatif des filtres :</h2>
      <p>
        <strong>État administratif :</strong>{" "}
        {filters.activity === "all"
          ? "Établissements en activité et cessés"
          : filters.activity === "active"
            ? "Établissements en activité"
            : "Établissements cessés"}
      </p>

      {filters.legalUnit === "hq" && (
        <p>
          <strong>Type d‘établissement :</strong> L‘établissement siège
          seulement
        </p>
      )}

      {filters.headcountEnabled && (
        <p>
          <strong>Effectifs :</strong> {selectedEffectifLabel(filters)}
        </p>
      )}

      {filters.categories && filters.categories.length > 0 && (
        <p>
          <strong>Catégories :</strong> {filters.categories.join(", ")}
        </p>
      )}

      {filters.locations && filters.locations.length > 0 && (
        <div>
          <strong>Localisation :</strong>
          {(() => {
            const regions = filters.locations.filter(
              (loc) => loc.type === "reg"
            );
            const departments = filters.locations.filter(
              (loc) => loc.type === "dep"
            );
            const communes = filters.locations.filter(
              (loc) => loc.type === "cp" || loc.type === "insee"
            );

            return (
              <>
                {regions.length > 0 && (
                  <div style={{ marginLeft: "20px" }}>
                    <i>Régions</i>
                    {regions.map((loc) => (
                      <div
                        key={`${loc.type}-${loc.value}`}
                        style={{ marginLeft: "20px" }}
                      >
                        {loc.label}
                      </div>
                    ))}
                  </div>
                )}
                {departments.length > 0 && (
                  <div style={{ marginLeft: "20px" }}>
                    <i>Départements</i>
                    {departments.map((loc) => (
                      <div
                        key={`${loc.type}-${loc.value}`}
                        style={{ marginLeft: "20px" }}
                      >
                        {loc.label}
                      </div>
                    ))}
                  </div>
                )}
                {communes.length > 0 && (
                  <div style={{ marginLeft: "20px" }}>
                    <i>Communes</i>
                    {communes.map((loc) => (
                      <div
                        key={`${loc.type}-${loc.value}`}
                        style={{ marginLeft: "20px" }}
                      >
                        {loc.label}
                      </div>
                    ))}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
      {filters.sap && filters.sap.length > 0 && (
        <p>
          <strong>Domaines d‘activité (Section) :</strong>{" "}
          {filters.sap.map((code) => codesSectionNAF[code]).join(", ")}
        </p>
      )}

      {filters.naf && filters.naf.length > 0 && (
        <p>
          <strong>Codes NAF/APE (Sous-classe) :</strong>{" "}
          {filters.naf
            .map((code) => `${code} - ${codesNAFRev2[code]}`)
            .join(", ")}
        </p>
      )}

      {((filters.legalCategoriesNiveau1 &&
        filters.legalCategoriesNiveau1.length > 0) ||
        (filters.legalCategoriesNiveau2 &&
          filters.legalCategoriesNiveau2.length > 0) ||
        (filters.legalCategoriesNiveau3 &&
          filters.legalCategoriesNiveau3.length > 0)) && (
        <div>
          <strong>Catégories juridiques :</strong>
          <ul>
            {[
              ...filters.legalCategoriesNiveau1.map(
                (code) => `${code} - ${categoriesJuridiquesNiveau1[code]}`
              ),
              ...filters.legalCategoriesNiveau2.map(
                (code) => `${code} - ${categoriesJuridiquesNiveau2[code]}`
              ),
              ...filters.legalCategoriesNiveau3.map(
                (code) => `${code} - ${categoriesJuridiquesNiveau3[code]}`
              ),
            ].map((code) => (
              <li key={code}>{code}</li>
            ))}
          </ul>
        </div>
      )}

      {(filters.creationDate?.from || filters.creationDate?.to) && (
        <p>
          <strong>Date de création :</strong>{" "}
          {filters.creationDate?.from &&
            `Depuis le ${new Date(
              filters.creationDate.from
            ).toLocaleDateString()}`}
          {filters.creationDate?.to &&
            (filters.creationDate?.from ? " jusqu‘au " : "Jusqu‘au ")}
          {filters.creationDate.to &&
            `${new Date(filters.creationDate.to).toLocaleDateString()}`}
        </p>
      )}

      {(filters.updateDate?.from || filters.updateDate?.to) && (
        <p>
          <strong>Date de mise à jour :</strong>
          {filters.updateDate.from &&
            ` Depuis le ${new Date(
              filters.updateDate.from
            ).toLocaleDateString()}`}
          {filters.updateDate?.to &&
            (filters.updateDate?.from ? " jusqu‘au " : "Jusqu‘au ")}
          {filters.updateDate.to &&
            `${new Date(filters.updateDate.to).toLocaleDateString()}`}
        </p>
      )}

      {filters.ess && (
        <p>
          <strong>
            Appartenance au champ de l‘économie sociale et solidaire :
          </strong>{" "}
          {(() => {
            const { inclure, inclureNo, inclureNonRenseigne } = filters.ess;
            const options = [];
            if (inclure) options.push("Oui");
            if (inclureNo) options.push("Non");
            if (inclureNonRenseigne) options.push("Non renseignées");
            return options.length > 0 ? options.join(", ") : "Aucune sélection";
          })()}
        </p>
      )}

      {filters.mission && (
        <p>
          <strong>Appartenance au champ des sociétés à mission :</strong>{" "}
          {(() => {
            const { inclure, inclureNo, inclureNonRenseigne } = filters.mission;
            const options = [];
            if (inclure) options.push("Oui");
            if (inclureNo) options.push("Non");
            if (inclureNonRenseigne) options.push("Non renseignées");
            return options.length > 0 ? options.join(", ") : "Aucune sélection";
          })()}
        </p>
      )}
    </div>
  );
}
