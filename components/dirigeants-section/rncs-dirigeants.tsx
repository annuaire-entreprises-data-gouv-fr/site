import React from 'react';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { EAdministration } from '../../models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import AdministrationNotResponding from '../administration-not-responding';
import { formatIntFr } from '../../utils/helpers/formatting';
import routes from '../../clients/routes';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { INPI } from '../administrations';
import {
  IEtatCivil,
  IImmatriculationRNCS,
  IPersonneMorale,
} from '../../models/immatriculation/rncs';
import InpiPartiallyDownWarning from '../../components-ui/alerts/inpi-partially-down';

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
        ['Rôle(s)', <b>{dirigeant.role}</b>],
        ['Dénomination', dirigeant.denomination],
        ['Nature Juridique', dirigeant.natureJuridique],
      ];

      const defaultDenom = dirigeant.denomination || dirigeant.siren;
      if (dirigeant.siren) {
        infos.push(['Siren', formatIntFr(dirigeant.siren)]);
        infos.push([
          '',
          <a href={`/entreprise/${dirigeant.siren}`}>
            → voir la page de {defaultDenom}
          </a>,
        ]);
        infos.push([
          '',
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
        ['Rôle', dirigeant.role && <b>{dirigeant.role}</b>],
        ['Nom', nomComplet],
        ['Mois et année de naissance', dirigeant.dateNaissancePartial],
      ];

      if (dirigeant.dateNaissanceFull) {
        infos.push([
          '',
          <a
            href={`/personne-physique?n=${dirigeant.nom}&fn=${dirigeant.prenom}&dmin=${dirigeant.dateNaissanceFull}&sirenFrom=${siren}`}
          >
            → rechercher ses entreprises
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
          <p>
            Cette entité possède {dirigeants.length} dirigeant{plural}{' '}
            enregistré{plural} au{' '}
            <b>Registre National du Commerce et des Sociétés (RNCS)</b>{' '}
            centralisé par l’
            <INPI />. Pour en savoir plus, vous pouvez consulter{' '}
            <a
              rel="noreferrer noopener nofollow"
              target="_blank"
              href={`${routes.rncs.portail.entreprise}${siren}`}
            >
              la page de cette entreprise
            </a>{' '}
            sur le site de l’INPI&nbsp;:
          </p>
          {dirigeants.map((dirigeant, idx) => (
            <React.Fragment key={'b' + idx}>
              <TwoColumnTable body={formatDirigeant(dirigeant)} />
              {dirigeants.length !== idx + 1 && <br />}
            </React.Fragment>
          ))}
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
