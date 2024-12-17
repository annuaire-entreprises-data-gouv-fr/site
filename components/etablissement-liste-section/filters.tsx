import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import { MultiSelect } from '#components-ui/select/multi-select';
import SearchBar from '#components/search-bar';
import { IUniteLegale } from '#models/core/types';

export const EtablissementFilters: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const etablissements = uniteLegale.etablissements;
  return (
    <div>
      <MultiSelect />
      <MultiSelect />
      <SearchBar />
      <ButtonLink>
        <Icon slug="mapPin">Afficher sur la carte</Icon>
      </ButtonLink>
    </div>
  );
};
