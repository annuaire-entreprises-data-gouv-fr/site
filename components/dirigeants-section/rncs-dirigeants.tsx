import React from 'react';
import routes from '#clients/routes';
import InpiPartiallyDownWarning from '#components-ui/alerts/inpi-partially-down';
import AdministrationNotResponding from '#components/administration-not-responding';
import { INPI } from '#components/administrations';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import {
  IEtatCivil,
  IImmatriculationRNCS,
  IPersonneMorale,
} from '#models/immatriculation/rncs';
import {
  formatDate,
  formatDatePartial,
  formatIntFr,
  Siren,
} from '#utils/helpers';

/**
 * Weird bug happennig here. Webpack build fail when this function is in model/dirigeants.ts
 * @param toBeDetermined
 * @returns
 */
export const isPersonneMorale = (
  toBeDetermined: IEtatCivil | IPersonneMorale
): toBeDetermined is IPersonneMorale => {
  if (
    (toBeDetermined as IPersonneMorale).siren ||
    (toBeDetermined as IPersonneMorale).denomination
  ) {
    return true;
  }
  return false;
};

interface IProps {
  immatriculationRNCS: IImmatriculationRNCS | IAPINotRespondingError;
  siren: Siren;
}

/**
 * Dirigeants section
 * @param param0
 * @returns
 */
const DirigeantsSection: React.FC<IProps> = ({
  immatriculationRNCS,
  siren,
}) => {
  if (isAPINotResponding(immatriculationRNCS)) {
    if (immatriculationRNCS.errorType === 404) {
      return null;
    }
    return (
      <AdministrationNotResponding
        administration={immatriculationRNCS.administration}
        errorType={immatriculationRNCS.errorType}
        title="Les dirigeants"
      />
    );
  }

  const { dirigeants } = immatriculationRNCS;

  const formatDirigeant = (dirigeant: IEtatCivil | IPersonneMorale) => {
    if (isPersonneMorale(dirigeant)) {
      const infos = [
        dirigeant.role,
        <>
          <b>{dirigeant.denomination}</b>

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

      const infos = [
        dirigeant.role,
        <>
          {nomComplet}, né(e) en{' '}
          {formatDatePartial(dirigeant.dateNaissancePartial)}
        </>,
      ];

      if (dirigeant.dateNaissanceFull) {
        //@ts-ignore
        infos.push([
          <a
            href={`/personne?n=${dirigeant.nom}&fn=${dirigeant.prenom}&dmin=${dirigeant.dateNaissanceFull}&dmax=${dirigeant.dateNaissanceFull}&sirenFrom=${siren}`}
          >
            → voir ses entreprises
          </a>,
        ]);
      }
      return infos;
    }
  };

  const plural = dirigeants.length > 1 ? 's' : '';

  return (
    <>
      <Section
        id="rncs-dirigeants"
        title={`Dirigeant${plural}`}
        sources={[EAdministration.INPI]}
      >
        <>
          {immatriculationRNCS.metadata.isFallback &&
            immatriculationRNCS.dirigeants.length > 0 && (
              <InpiPartiallyDownWarning missing="la distinction entre le nom et le prénom" />
            )}
          {dirigeants.length === 0 ? (
            <p>
              Cette entreprise est enregistrée au{' '}
              <b>Registre National du Commerce et des Sociétés (RNCS)</b>, mais
              n’y possède aucun dirigeant.
            </p>
          ) : (
            <>
              <p>
                Cette entreprise possède {dirigeants.length} dirigeant{plural}{' '}
                enregistré{plural} au{' '}
                <b>Registre National du Commerce et des Sociétés (RNCS)</b>{' '}
                centralisé par l’
                <INPI />. Pour en savoir plus, vous pouvez consulter{' '}
                <a
                  rel="noreferrer noopener"
                  target="_blank"
                  href={`${routes.rncs.portail.entreprise}${siren}`}
                >
                  la page de cette entreprise
                </a>{' '}
                sur le site de l’INPI&nbsp;:
              </p>
              <FullTable
                head={['Role', 'Details', 'Action']}
                body={dirigeants.map((dirigeant) => formatDirigeant(dirigeant))}
              />
            </>
          )}
        </>
      </Section>
      <style global jsx>{`
        table > tbody > tr > td:first-of-type {
          width: 30%;
        }
      `}</style>
    </>
  );
};
export default DirigeantsSection;
