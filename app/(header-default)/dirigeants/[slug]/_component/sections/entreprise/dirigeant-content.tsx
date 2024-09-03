import { FullTable } from '#components/table/full';
import { IUniteLegale } from '#models/core/types';
import {
  IDirigeant,
  IEtatCivil,
  IPersonneMorale,
} from '#models/immatriculation';
import { formatDateLong, formatDatePartial, formatIntFr } from '#utils/helpers';
import { isPersonneMorale } from '../is-personne-morale';

type IDirigeantContentProps = {
  dirigeants: IDirigeant[];
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
          <a href={`/dirigeants/${dirigeant.siren}`}>
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
              }`
            : ''}
        </>,
        ...(dirigeant.dateNaissancePartial
          ? [
              <a
                href={`/personne?n=${dirigeant.nom}&fn=${dirigeant.prenom}&partialDate=${dirigeant.dateNaissancePartial}&sirenFrom=${uniteLegale.siren}`}
              >
                → voir ses entreprises
              </a>,
            ]
          : []),
      ];
    }
  };

  return (
    <>
      <FullTable
        head={['Role', 'Details', 'Action']}
        body={dirigeants.map((dirigeant) => formatDirigeant(dirigeant))}
      />
    </>
  );
}
