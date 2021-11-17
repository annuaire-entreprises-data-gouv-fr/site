import React from 'react';
import { IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import { IImmatriculationRNCS } from '../../models/immatriculation';
import { formatDate, formatIntFr } from '../../utils/helpers/formatting';
import AdministrationNotResponding from '../administration-not-responding';
import { INPI } from '../administrations';
import ButtonLink from '../button';
import ButtonInpiPdf from '../button-inpi-pdf';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';

interface IProps {
  immatriculation: IImmatriculationRNCS | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
}

const ImmatriculationRNCS: React.FC<IProps> = ({
  immatriculation,
  uniteLegale,
}) => {
  if (isAPINotResponding(immatriculation)) {
    if (immatriculation.errorType === 404) {
      return null;
    }
    return (
      <AdministrationNotResponding
        {...immatriculation}
        title="Immatriculation RNCS"
      />
    );
  }

  const data = [
    ['Dénomination', immatriculation.denomination],
    ['Siren', formatIntFr(immatriculation.siren)],
    ['Numéro RCS', immatriculation.numeroRCS],
    [
      'Dirigeant(s)',
      <a key="dirigeant" href={`/dirigeants/${uniteLegale.siren}`}>
        → voir les dirigeants
      </a>,
    ],
    [
      'Siège social',
      <a key="siege" href={`/etablissement/${uniteLegale.siege.siret}`}>
        → voir le détail du siège social
      </a>,
    ],
    [
      'Date d’immatriculation au RNCS',
      formatDate(immatriculation.dateImmatriculation),
    ],
    ['Date de début d’activité', formatDate(immatriculation.dateDebutActiv)],
  ];

  if (immatriculation.isPersonneMorale) {
    data.push(
      ['Capital', immatriculation.capital],
      [
        'Date de clôture de l’exercice comptable',
        immatriculation.dateClotureExercice,
      ],
      [
        'Durée de la personne morale',
        immatriculation.dureePersonneMorale + ' ans',
      ]
    );
  }

  if (immatriculation.dateCessationActivite) {
    data.push([
      'Date de cessation d’activité',
      formatDate(immatriculation.dateCessationActivite),
    ]);
  }
  if (immatriculation.dateRadiation) {
    data.push(['Date de radiation', formatDate(immatriculation.dateRadiation)]);
  }

  return (
    <>
      {immatriculation.downloadlink && (
        <Section
          id="rncs"
          title="Immatriculation au RNCS"
          source={EAdministration.INPI}
        >
          <p>
            Cette entité possède une fiche d’immatriculation au{' '}
            <b>Registre National du Commerce et des Sociétés (RNCS)</b> qui
            liste les entreprises enregistrées auprès des Greffes des tribunaux
            de commerce et centralisées par l’
            <INPI />.
          </p>
          <TwoColumnTable body={data} />
          <p>
            Pour accéder à l’ensemble des données contenues dans un extrait
            KBIS, téléchargez le justificatif d’immatriculation via le{' '}
            <b>bouton ci-dessous</b>. Le téléchargement peut prendre quelques
            dizaines de secondes.
          </p>
          <div className="layout-center">
            <ButtonInpiPdf siren={immatriculation.siren} />
            <div className="separator" />
            <ButtonLink
              nofollow={true}
              target="_blank"
              to={`${immatriculation.downloadlink}`}
              alt
            >
              ⇢ Voir la fiche sur le site de l’INPI
            </ButtonLink>
          </div>
          <p>
            <b>NB :</b> si le téléchargement échoue, vous pouvez accéder à la
            donnée en allant sur le site de l’
            <INPI />. Pour accéder à l’ensemble de la donnée en utilisant le
            site de l’
            <INPI /> vous devrez vous créer un compte <INPI />.
          </p>
          <style jsx>{`
            .separator {
              width: 10px;
              height: 10px;
            }
          `}</style>
        </Section>
      )}
    </>
  );
};

export default ImmatriculationRNCS;
