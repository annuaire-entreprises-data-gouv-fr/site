import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import { PrintNever } from '#components-ui/print-visibility';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { IUniteLegale } from '#models/index';
import { formatDateLong } from '#utils/helpers';
import useFetchActes from 'hooks/fetch/actes';

const ActesSection: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const actes = useFetchActes(uniteLegale);

  return (
    <PrintNever>
      <DataSection
        title="Actes juridiques et statuts"
        id="actes"
        isProtected
        sources={[EAdministration.INPI]}
        data={actes}
      >
        {(actes) => (
          <FullTable
            head={['Description', 'Lien']}
            body={actes.actes.map((a) => [
              <>
                <b>Déposé(s) le {formatDateLong(a.dateDepot)} :</b>
                <ul>
                  {(a?.acte || []).map((acteName) => (
                    <li>{acteName}</li>
                  ))}
                </ul>
              </>,
              <ButtonLink alt small to={routes.api.actes.download + a.id}>
                Télécharger
              </ButtonLink>,
            ])}
          />
        )}
      </DataSection>
    </PrintNever>
  );
};

export default ActesSection;
