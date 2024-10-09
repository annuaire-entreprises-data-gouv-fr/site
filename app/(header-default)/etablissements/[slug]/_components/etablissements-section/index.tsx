'use client';

import { Warning } from '#components-ui/alerts';
import ButtonLink from '#components-ui/button';
import { MultiSelect } from '#components-ui/select/multi-select';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
import { useEffect, useMemo, useState } from 'react';
import { EtablissementsList } from './list';

export const EtablissementsSection = ({
  uniteLegale,
  session,
  slug,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  slug: string;
}) => {
  const etablissements = useAPIRouteData('etablissements', slug, session);

  const [selectedSiret, setSelectedSiret] = useState<string>('');
  const [selectedEtablissements, setSelectedEtablissements] =
    useState<IEtablissement[]>();

  const etablissementsForFilter = useMemo(() => {
    return etablissements.map((e) => {
      return {
        value: e.siret,
        label: `${e.siret} - ${e.codePostal} ${e.commune}`,
      };
    });
  }, [etablissements]);

  useEffect(() => {
    if (selectedSiret) {
      setSelectedEtablissements(
        etablissements.filter((e) => e.siret === selectedSiret)
      );
    } else {
      setSelectedEtablissements(etablissements);
    }
  }, [selectedSiret]);

  return (
    <Section
      id="etablissements"
      title={`${uniteLegale.etablissements.nombreEtablissements} établissement(s) de ${uniteLegale.nomComplet}`}
      sources={[EAdministration.INSEE]}
      lastModified={uniteLegale.dateDerniereMiseAJour}
    >
      <Warning>
        Nous n’avons pas réussi à déterminer la géolocalisation de cet
        établissement, car ses coordonnées sont invalides ou inconnues : [
        {etablissements[0].latitude || '⎽'}°,{' '}
        {etablissements[0].longitude || '⎽'}
        °].
      </Warning>

      <div className="layout-right">
        <ButtonLink onClick={() => {}}>Ouverts</ButtonLink>
        <ButtonLink onClick={() => {}}>Fermés</ButtonLink>
        <MultiSelect
          placeholder="Rechercher un établissement"
          instanceId="table-filter"
          id="table-filter"
          onChange={(e) => setSelectedSiret(e?.join(''))}
          options={etablissementsForFilter}
          maxWidth="375px"
          menuPosition="absolute"
        />
      </div>
      <EtablissementsList etablissements={selectedEtablissements} />
    </Section>
  );
};
