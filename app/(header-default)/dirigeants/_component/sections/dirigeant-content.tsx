import routes from '#clients/routes';
import InpiPartiallyDownWarning from '#components-ui/alerts-with-explanations/inpi-partially-down';
import { INPI } from '#components/administrations';
import { FullTable } from '#components/table/full';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { IUniteLegale } from '#models/core/types';
import {
  IDirigeant,
  IEtatCivil,
  IPersonneMorale,
} from '#models/immatriculation';
import { formatDate, formatDatePartial, formatIntFr } from '#utils/helpers';
import { isPersonneMorale } from './is-personne-morale';

export function DirigeantContent({
  dirigeants,
  uniteLegale,
  isFallback,
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

      const firstName = (dirigeant.prenom || '').split(',')[0];

      return [
        dirigeant.role,
        <>
          {nomComplet}
          {dirigeant.dateNaissance || dirigeant.dateNaissancePartial
            ? `, né(e) ${
                dirigeant.dateNaissance
                  ? 'le ' + formatDate(dirigeant.dateNaissance)
                  : 'en ' + formatDatePartial(dirigeant.dateNaissancePartial)
              }`
            : ''}
        </>,
        ...(dirigeant.dateNaissancePartial
          ? [
              <a
                href={`/personne?n=${dirigeant.nom}&fn=${firstName}&partialDate=${dirigeant.dateNaissancePartial}&sirenFrom=${uniteLegale.siren}`}
              >
                → voir ses entreprises
              </a>,
            ]
          : []),
      ];
    }
  };

  const plural = dirigeants.length > 1 ? 's' : '';
  return (
    <>
      {isFallback && dirigeants.length > 0 && <InpiPartiallyDownWarning />}
      {dirigeants.length === 0 ? (
        <p>
          Cette entreprise est enregistrée au{' '}
          <strong>Registre National des Entreprises (RNE)</strong>, mais n’y
          possède aucun dirigeant.
        </p>
      ) : (
        <>
          <p>
            Cette entreprise possède {dirigeants.length} dirigeant{plural}{' '}
            enregistré{plural} au{' '}
            <strong>Registre National des Entreprises (RNE)</strong> tenu par l’
            <INPI />. Pour en savoir plus, vous pouvez consulter{' '}
            <UniteLegalePageLink
              href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
              uniteLegale={uniteLegale}
              siteName="le site de l’INPI"
            />
            &nbsp;:
          </p>
          <FullTable
            head={['Role', 'Details', 'Action']}
            body={dirigeants.map((dirigeant) => formatDirigeant(dirigeant))}
          />
        </>
      )}
    </>
  );
}

type IDirigeantContentProps = {
  dirigeants: IDirigeant[];
  uniteLegale: IUniteLegale;
  isFallback: boolean;
};
