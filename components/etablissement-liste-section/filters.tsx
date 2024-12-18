'use client';

import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import { Select } from '#components-ui/select';
import { estActif } from '#models/core/etat-administratif';
import { IEtablissement } from '#models/core/types';
import { extractSirenOrSiretSlugFromUrl, isLikelyASiret } from '#utils/helpers';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export const EtablissementFilters: React.FC<{
  allEtablissements: IEtablissement[];
  setFilteredEtablissements: (etablissements: IEtablissement[]) => void;
}> = ({ allEtablissements, setFilteredEtablissements }) => {
  const [etatAdministratifFilter, setEtatAdministratifFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    let newFiltered = allEtablissements;

    console.log(etatAdministratifFilter, searchFilter);

    if (etatAdministratifFilter) {
      newFiltered = newFiltered.filter((e) => {
        if (etatAdministratifFilter === 'A') {
          return estActif(e);
        }
        if (etatAdministratifFilter === 'F') {
          return !estActif(e);
        }
      });
    }
    if (searchFilter) {
      const slug = extractSirenOrSiretSlugFromUrl(searchFilter);
      if (isLikelyASiret(slug)) {
        newFiltered = newFiltered.filter((e) => e.siret === slug);
      } else {
        newFiltered = newFiltered.filter((e) => {
          return (
            (e.adressePostale || '').toLowerCase().indexOf(searchFilter) > -1 ||
            e.siret.indexOf(searchFilter.replaceAll(' ', '')) > -1
          );
        });
      }
    }
    setFilteredEtablissements(newFiltered);
  }, [etatAdministratifFilter, searchFilter]);

  return (
    <div className={styles.filterBar}>
      <ButtonLink alt>
        <Icon slug="mapPin">Afficher la carte</Icon>
      </ButtonLink>
      <div style={{ flexGrow: 1 }} />

      <div>
        <input
          className="fr-input"
          placeholder={'Siret, code postal'}
          type="search"
          id="search-input-input"
          name="terme"
          autoComplete="off"
          onChange={(e) =>
            setSearchFilter((e.target.value || '').toLowerCase())
          }
        />
      </div>
      <Select
        options={[
          { value: 'A', label: 'En activité' },
          { value: 'F', label: 'Fermé' },
        ]}
        name="etat"
        defaultValue={null}
        placeholder="Choisir un état administratif"
        onChange={(e) => setEtatAdministratifFilter(e.target.value)}
      />
    </div>
  );
};
