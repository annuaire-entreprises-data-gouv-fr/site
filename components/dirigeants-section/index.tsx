import React from 'react';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { EAdministration } from '../../models/administration';
import { IEtatCivil, IPersonneMorale } from '../../models/dirigeants';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import AdministrationNotResponding from '../administration-not-responding';
import { formatNumbersFr } from '../../utils/helpers/formatting';
import routes from '../../clients/routes';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { INPI } from '../administrations';

/**
 * Weird bug happennig here. Webpack build fail when this function is in model/dirigeants.ts
 * @param toBeDetermined
 * @returns
 */
const isPersonneMorale = (
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
  dirigeants: (IEtatCivil | IPersonneMorale)[] | IAPINotRespondingError;
  siren: Siren;
}

/**
 * Dirigeants section
 * @param param0
 * @returns
 */
const DirigeantsSection: React.FC<IProps> = ({ dirigeants, siren }) => {
  if (isAPINotResponding(dirigeants)) {
    if (dirigeants.errorType === 404) {
      return null;
    }
    return (
      <AdministrationNotResponding
        administration={dirigeants.administration}
        errorType={dirigeants.errorType}
        title="Les informations sur les dirigeants"
      />
    );
  }

  const formatDirigeant = (dirigeant: IEtatCivil | IPersonneMorale) => {
    if (isPersonneMorale(dirigeant)) {
      const infos = [
        //eslint-disable-next-line
        ['Rôle(s)', <b>{dirigeant.role}</b>],
        ['Dénomination', dirigeant.denomination],
        ['Nature Juridique', dirigeant.natureJuridique],
      ];
      if (dirigeant.siren) {
        infos.push([
          'Siren',
          //eslint-disable-next-line
          <a href={`/entreprise/${dirigeant.siren}`}>
            {formatNumbersFr(dirigeant.siren)}
          </a>,
        ]);
      }
      return infos;
    } else {
      return [
        //eslint-disable-next-line
        ['Rôle', <b>{dirigeant.role}</b>],
        ['Nom', dirigeant.nom],
        ['Prénom', dirigeant.prenom],
        ['Année de naissance', dirigeant.dateNaissance],
        ['Lieu de naissance', dirigeant.lieuNaissance],
      ];
    }
  };

  const plural = dirigeants.length > 1 ? 's' : '';

  return (
    <>
      <Section
        title={`Les informations sur le${plural} dirigeant${plural}`}
        source={EAdministration.INPI}
      >
        <>
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
