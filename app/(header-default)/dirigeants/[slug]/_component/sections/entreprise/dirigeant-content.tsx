import { SeePersonPageLink } from '#components-ui/see-personn-page-link';
import { FullTable } from '#components/table/full';
import { IUniteLegale } from '#models/core/types';
import { IDirigeants, IEtatCivil, IPersonneMorale } from '#models/rne/types';
import { formatDateLong, formatDatePartial, formatIntFr } from '#utils/helpers';
import { isPersonneMorale } from '../is-personne-morale';

type IDirigeantContentProps = {
  dirigeants: IDirigeants;
  uniteLegale: IUniteLegale;
};

export function DirigeantContent({
  dirigeants,
  uniteLegale,
}: IDirigeantContentProps) {
  const formatDirigeant = (dirigeant: IEtatCivil | IPersonneMorale) => {
    if (isPersonneMorale(dirigeant)) {
      const infos = [
        dirigeant.role,
        <>
          <strong>{dirigeant.denomination}</strong>
          {dirigeant.siren ? (
            <>
              {' - '}
              <a href={`/entreprise/${dirigeant.siren}`}>
                {formatIntFr(dirigeant.siren)}
              </a>
            </>
          ) : (
            ''
          )}
          <br />
          {dirigeant.natureJuridique}
        </>,
      ];

      if (dirigeant.siren) {
        const defaultDenom = dirigeant.denomination || dirigeant.siren;
        //@ts-ignore
        infos.push([
          <a key={dirigeant.siren} href={`/dirigeants/${dirigeant.siren}`}>
            → voir les dirigeants de {defaultDenom}
          </a>,
        ]);
      }
      return infos;
    } else {
      const nomComplet = `${dirigeant.prenom || ''}${
        dirigeant.prenom && dirigeant.nom ? ' ' : ''
      }${(dirigeant.nom || '').toUpperCase()}`;

      return [
        dirigeant.role,
        <>
          {nomComplet}
          {dirigeant.dateNaissance || dirigeant.dateNaissancePartial
            ? `, né(e) ${
                dirigeant.dateNaissance
                  ? 'le ' + formatDateLong(dirigeant.dateNaissance)
                  : 'en ' + formatDatePartial(dirigeant.dateNaissancePartial)
              }${
                dirigeant.lieuNaissance ? `, à ${dirigeant.lieuNaissance}` : ''
              }`
            : ''}
        </>,
        ...(dirigeant.dateNaissancePartial
          ? [
              <SeePersonPageLink
                person={dirigeant}
                sirenFrom={uniteLegale.siren}
              />,
            ]
          : []),
      ];
    }
  };

  return (
    <>
      <FullTable
        head={['Role', 'Details', 'Action']}
        body={dirigeants.data.map((dirigeant) => formatDirigeant(dirigeant))}
      />
    </>
  );
}
