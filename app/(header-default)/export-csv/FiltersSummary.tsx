import { categoriesJuridiques as legalCategories } from '#utils/helpers/formatting/metadata/categories-juridiques';
import { codesNAFRev2 } from '#utils/helpers/formatting/metadata/codes-NAF-rev-2';
import { codesSectionNAF } from '#utils/helpers/formatting/metadata/codes-section-NAF';
import { ExtendedExportCsvInput } from './ExportCsv';
import { selectedEffectifLabel } from './Filters';

export default function FiltersSummary({
  filters,
}: {
  filters: ExtendedExportCsvInput;
}) {
  return (
    <div>
      <h2>Récapitulatif des filtres :</h2>
      <p>
        <strong>État administratif :</strong>{' '}
        {filters.activity === 'all'
          ? 'Établissements en activité et cessés'
          : filters.activity === 'active'
          ? 'Établissements en activité'
          : 'Établissements cessés'}
      </p>

      {filters.legalUnit === 'hq' && (
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
          <strong>Catégorie :</strong> {filters.categories.join(', ')}
        </p>
      )}

      {filters.locations && filters.locations.length > 0 && (
        <div>
          <strong>Localisation :</strong>
          {(() => {
            const regions = filters.locations.filter(
              (loc) => loc.type === 'reg'
            );
            const departments = filters.locations.filter(
              (loc) => loc.type === 'dep'
            );
            const communes = filters.locations.filter(
              (loc) => loc.type === 'cp' || loc.type === 'insee'
            );

            return (
              <>
                {regions.length > 0 && (
                  <div style={{ marginLeft: '20px' }}>
                    <i>Région</i>
                    {regions.map((loc) => (
                      <div
                        key={`${loc.type}-${loc.value}`}
                        style={{ marginLeft: '20px' }}
                      >
                        {loc.label}
                      </div>
                    ))}
                  </div>
                )}
                {departments.length > 0 && (
                  <div style={{ marginLeft: '20px' }}>
                    <i>Département</i>
                    {departments.map((loc) => (
                      <div
                        key={`${loc.type}-${loc.value}`}
                        style={{ marginLeft: '20px' }}
                      >
                        {loc.label}
                      </div>
                    ))}
                  </div>
                )}
                {communes.length > 0 && (
                  <div style={{ marginLeft: '20px' }}>
                    <i>Commune</i>
                    {communes.map((loc) => (
                      <div
                        key={`${loc.type}-${loc.value}`}
                        style={{ marginLeft: '20px' }}
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
          <strong>Domaine d‘activité (Section) :</strong>{' '}
          {filters.sap
            .map(
              (code) => codesSectionNAF[code as keyof typeof codesSectionNAF]
            )
            .join(', ')}
        </p>
      )}

      {filters.naf && filters.naf.length > 0 && (
        <p>
          <strong>Code NAF/APE (Sous-classe) :</strong>{' '}
          {filters.naf
            .map(
              (code) =>
                `${code} - ${codesNAFRev2[code as keyof typeof codesNAFRev2]}`
            )
            .join(', ')}
        </p>
      )}

      {(filters.creationDate?.from || filters.creationDate?.to) && (
        <p>
          <strong>Date de création :</strong>{' '}
          {filters.creationDate?.from &&
            `Depuis le ${new Date(
              filters.creationDate.from
            ).toLocaleDateString()}`}
          {filters.creationDate?.to &&
            (filters.creationDate?.from ? ' jusqu‘au ' : 'Jusqu‘au ')}
          {filters.creationDate.to &&
            `${new Date(filters.creationDate.to).toLocaleDateString()}`}
        </p>
      )}

      {filters.legalCategories && filters.legalCategories.length > 0 && (
        <p>
          <strong>Catégorie juridique :</strong>{' '}
          {filters.legalCategories
            .map((code) => legalCategories[code] || code)
            .join(', ')}
        </p>
      )}

      {filters.siretsAndSirens && filters.siretsAndSirens.length > 0 && (
        <p>
          <strong>Nombre de SIRET / SIREN sélectionnés :</strong>{' '}
          {filters.siretsAndSirens.length}
        </p>
      )}

      {(filters.creationDate?.from || filters.creationDate?.to) && (
        <p>
          <strong>Date de création :</strong>{' '}
          {filters.creationDate?.from &&
            `Depuis le ${new Date(
              filters.creationDate.from
            ).toLocaleDateString()}`}
          {filters.creationDate?.to &&
            (filters.creationDate?.from ? ' jusqu‘au ' : 'Jusqu‘au ')}
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
            (filters.updateDate?.from ? ' jusqu‘au ' : 'Jusqu‘au ')}
          {filters.updateDate.to &&
            `${new Date(filters.updateDate.to).toLocaleDateString()}`}
        </p>
      )}
    </div>
  );
}
