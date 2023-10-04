import React from 'react';
import routes from '#clients/routes';
import InpiPartiallyDownWarning from '#components-ui/alerts/inpi-partially-down';
import AdministrationNotResponding from '#components/administration-not-responding';
import { INPI } from '#components/administrations';
import { Section } from '#components/section';
import { LoadingSection } from '#components/section/loading';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { IAPILoading, isAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import {
  IEtatCivil,
  IImmatriculationRNE,
  IPersonneMorale,
} from '#models/immatriculation';
import { Siren, formatDatePartial, formatIntFr } from '#utils/helpers';

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

type IProps = {
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IAPILoading;
  siren: Siren;
};

/**
 * Dirigeants section
 */
const DirigeantsSection: React.FC<IProps> = ({ immatriculationRNE, siren }) => {
  if (isAPILoading(immatriculationRNE)) {
    return (
      <LoadingSection
        id="rne-dirigeants"
        title={`Dirigeant`}
        sources={[EAdministration.INPI]}
        description="Nous récupérons les informations sur les dirigeants dans le Registre National des Entreprises…"
      />
    );
  }
  if (isAPINotResponding(immatriculationRNE)) {
    if (immatriculationRNE.errorType === 404) {
      return null;
    }
    return (
      <AdministrationNotResponding
        administration={immatriculationRNE.administration}
        errorType={immatriculationRNE.errorType}
        title="Les dirigeants"
      />
    );
  }

  const { dirigeants } = immatriculationRNE;

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

      return [
        dirigeant.role,
        <>
          {nomComplet}, né(e) en{' '}
          {formatDatePartial(dirigeant.dateNaissancePartial)}
        </>,
        ...(dirigeant.dateNaissancePartial
          ? [
              <a
                href={`/personne?n=${dirigeant.nom}&fn=${dirigeant.prenom}&partialDate=${dirigeant.dateNaissancePartial}&sirenFrom=${siren}`}
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
      <Section
        id="rne-dirigeants"
        title={`Dirigeant${plural}`}
        sources={[EAdministration.INPI]}
      >
        <>
          {immatriculationRNE.metadata.isFallback &&
            immatriculationRNE.dirigeants.length > 0 && (
              <InpiPartiallyDownWarning missing="la distinction entre le nom et le prénom" />
            )}
          {dirigeants.length === 0 ? (
            <p>
              Cette entreprise est enregistrée au{' '}
              <b>Registre National des Entreprises (RNE)</b>, mais n’y possède
              aucun dirigeant.
            </p>
          ) : (
            <>
              <p>
                Cette entreprise possède {dirigeants.length} dirigeant{plural}{' '}
                enregistré{plural} au{' '}
                <b>Registre National des Entreprises (RNE)</b> tenu par l’
                <INPI />. Pour en savoir plus, vous pouvez consulter{' '}
                <a
                  rel="noreferrer noopener"
                  target="_blank"
                  href={`${routes.rne.portail.entreprise}${siren}`}
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
