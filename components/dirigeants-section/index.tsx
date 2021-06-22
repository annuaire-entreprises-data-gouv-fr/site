import React from 'react';
import HorizontalSeparator from '../horizontal-separator';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { EAdministration } from '../../models/administration';
import { IEtatCivil, IPersonneMorale } from '../../models/dirigeants';
import { IAPINotRespondingError } from '../../models/api-not-responding';
import AdministrationNotResponding from '../administration-not-responding';
import { formatNumbersFr } from '../../utils/helpers/formatting';
import routes from '../../clients/routes';
import { Siren } from '../../utils/helpers/siren-and-siret';

interface IProps {
  dirigeants: (IEtatCivil & IPersonneMorale)[] & IAPINotRespondingError;
  siren: Siren;
}

/**
 * Dirigeants section
 * @param param0
 * @returns
 */
const DirigeantsSection: React.FC<IProps> = ({ dirigeants, siren }) => {
  const isAPINotResponding = dirigeants.administration;
  if (isAPINotResponding) {
    return (
      <AdministrationNotResponding
        administration={dirigeants.administration}
        type={dirigeants.type}
      />
    );
  }

  const formatDirigeant = (dirigeant: IEtatCivil & IPersonneMorale) => {
    const isPersonneMorale = dirigeant.siren;
    if (isPersonneMorale) {
      return [
        ['Rôle(s)', <b>{dirigeant.role}</b>],
        ['Dénomination', dirigeant.denomination],
        ['Nature Juridique', dirigeant.natureJuridique],
        [
          'Siren',
          <a href={`/entreprise/${dirigeant.siren}`}>
            {formatNumbersFr(dirigeant.siren)}
          </a>,
        ],
      ];
    } else {
      return [
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
            enregistré{plural} au Registre National du Commerce et des Sociétés
            (RNCS)&nbsp;:
          </p>
          {dirigeants.map((dirigeant, idx) => (
            <React.Fragment key={'b' + idx}>
              <TwoColumnTable body={formatDirigeant(dirigeant)} />
              {dirigeants.length !== idx + 1 && <br />}
            </React.Fragment>
          ))}
          <p>
            Pour en savoir plus, vous pouvez consulter{' '}
            <a
              rel="referrer noopener"
              target="_blank"
              href={`${routes.rncs.portail.entreprise}${siren}`}
            >
              la page de cette entreprise
            </a>{' '}
            sur le compte de l’INPI.
          </p>
          <div className="layout-center"></div>
        </>
      </Section>
      <HorizontalSeparator />
      <style global jsx>{`
        table > tbody > tr > td:first-of-type {
          width: 30%;
        }
      `}</style>
    </>
  );
};
export default DirigeantsSection;
