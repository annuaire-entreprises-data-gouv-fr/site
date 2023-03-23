import React from 'react';
import InpiPartiallyDownWarning from '#components-ui/alerts/inpi-partially-down';
import { OpenClosedTag } from '#components-ui/badge/frequent';
import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import BreakPageForPrint from '#components-ui/print-break-page';
import { PrintNever } from '#components-ui/print-visibility';
import { INPI } from '#components/administrations';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IImmatriculationRNCS } from '#models/immatriculation/rncs';
import { IUniteLegale } from '#models/index';
import { formatDate, formatIntFr } from '#utils/helpers';
import AdministrationNotResponding from '../administration-not-responding';
import { RnmRncsEOLWarning } from './end-of-life-warning';

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

  return (
    <>
      {immatriculation.downloadLink && (
        <>
          <Section
            id="rncs"
            title="Immatriculation au RNCS"
            sources={[EAdministration.INPI]}
          >
            <RnmRncsEOLWarning />
            <p>
              Cette structure possède une fiche d’immatriculation au{' '}
              <b>Registre National du Commerce et des Sociétés (RNCS)</b> qui
              liste les entreprises enregistrées auprès des Greffes des
              tribunaux de commerce et centralisées par l’
              <INPI />.
            </p>
            <ImmatriculationRNCSTable
              immatriculation={immatriculation}
              uniteLegale={uniteLegale}
            />
            <PrintNever>
              <>
                <p>
                  Pour accéder aux données contenues dans un extrait
                  d’immatriculation (équivalent de l’extrait KBIS),{' '}
                  <b>téléchargez le justificatif d’immatriculation</b> ou
                  consultez la fiche complète sur le site de l’
                  <INPI />
                  &nbsp;:
                </p>
                <div className="layout-center">
                  <ButtonLink
                    nofollow={true}
                    to={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
                  >
                    <Icon slug="download">
                      Télécharger le justificatif d’immatriculation
                    </Icon>
                  </ButtonLink>
                  <div className="separator" />
                  <ButtonLink
                    nofollow={true}
                    target="_blank"
                    to={`${immatriculation.siteLink}`}
                    alt
                  >
                    ⇢ Voir la fiche sur le site de l’INPI
                  </ButtonLink>
                </div>
              </>
            </PrintNever>
            <style jsx>{`
              .separator {
                width: 10px;
                height: 10px;
              }
            `}</style>
          </Section>
          <BreakPageForPrint />
        </>
      )}
    </>
  );
};

const ImmatriculationRNCSTable: React.FC<{
  immatriculation: IImmatriculationRNCS;
  uniteLegale: IUniteLegale;
}> = ({ immatriculation, uniteLegale }) => {
  const { dateRadiation, dateCessationActivite, isPersonneMorale } =
    immatriculation.identite;

  const data = [
    [
      'Statut',
      <OpenClosedTag
        isVerified={!dateRadiation}
        label={dateRadiation ? 'Radiée' : 'Inscrite'}
      />,
    ],
    [
      'Date d’immatriculation au RNCS',
      formatDate(immatriculation.identite.dateImmatriculation),
    ],
    ['Dénomination', immatriculation.identite.denomination],
    ['Siren', formatIntFr(uniteLegale.siren)],
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
    ['Nature juridique', immatriculation.identite.libelleNatureJuridique],
    [
      'Date de début d’activité',
      formatDate(immatriculation.identite.dateDebutActiv),
    ],
    ...(isPersonneMorale
      ? [
          ['Capital', immatriculation.identite.capital],
          [
            'Date de clôture de l’exercice comptable',
            immatriculation.identite.dateClotureExercice,
          ],
          [
            'Durée de la personne morale',
            immatriculation.identite.dureePersonneMorale,
          ],
        ]
      : []),
    ...(dateCessationActivite
      ? [['Date de cessation d’activité', formatDate(dateCessationActivite)]]
      : []),
    ...(dateRadiation
      ? [['Date de radiation', formatDate(dateRadiation)]]
      : []),
  ];

  return <TwoColumnTable body={data} />;
};

export default ImmatriculationRNCS;
