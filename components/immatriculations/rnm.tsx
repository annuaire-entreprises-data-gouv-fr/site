import React from 'react';
import { IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '../../models/api-not-responding';
import { formatDate, formatIntFr } from '../../utils/helpers/formatting';
import AdministrationNotResponding from '../administration-not-responding';
import BreakPageForPrint from '../../components-ui/print-break-page';
import ButtonLink from '../../components-ui/button';
import { closed, download, open } from '../../components-ui/icon';
import { Section } from '../section';
import { TwoColumnTable } from '../table/simple';
import { PrintNever } from '../../components-ui/print-visibility';
import { IImmatriculationRNM } from '../../models/immatriculation/rnm';

interface IProps {
  immatriculation: IImmatriculationRNM | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
}

const ImmatriculationRNM: React.FC<IProps> = ({
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
        title="Immatriculation au RNM"
      />
    );
  }

  const data = [
    [
      'Statut',
      <>
        {immatriculation.dateRadiation ? (
          <b>{closed} Radiée</b>
        ) : (
          <b>{open} Inscrite</b>
        )}
      </>,
    ],
    [
      'Date d’immatriculation au RNM',
      formatDate(immatriculation.dateImmatriculation),
    ],
    ['Code APRM', immatriculation.codeAPRM],
    ['Numéro de gestion', immatriculation.gestionId],
    ['Dénomination', immatriculation.denomination],
    ['Siren', formatIntFr(immatriculation.siren)],
    [
      'Siège social',
      <a key="siege" href={`/etablissement/${uniteLegale.siege.siret}`}>
        → voir le détail du siège social
      </a>,
    ],
    ['Nature juridique', immatriculation.libelleNatureJuridique],
    ['Date de début d’activité', formatDate(immatriculation.dateDebutActivite)],
    ['Date de dernière mise à jour', formatDate(immatriculation.dateMiseAJour)],
  ];

  if (immatriculation.dateRadiation) {
    data.push(['Date de radiation', formatDate(immatriculation.dateRadiation)]);
  }

  return (
    <>
      {immatriculation.downloadLink && (
        <>
          <Section
            id="rnm"
            title="Immatriculation au RNM"
            sources={[EAdministration.CMAFRANCE]}
          >
            <p>
              Cette entité possède une fiche d’immatriculation sur le{' '}
              <b>Répertoire National des Métiers (RNM)</b> qui liste les
              entreprises artisanales enregistrées auprès des Chambres des
              Métiers et de l’Artisanat (CMA France).
            </p>
            <TwoColumnTable body={data} />
            <PrintNever>
              <p>
                Pour accéder à l’ensemble des données contenues dans un extrait
                D1, vous pouvez télécharger le justificatif d’immatriculation.
                Si le téléchargement échoue, vous pouvez accéder aux données en
                allant sur le site de CMA France.
              </p>
              <div className="layout-center">
                <ButtonLink
                  target="_blank"
                  to={`${immatriculation.downloadLink}`}
                >
                  {download} Télécharger le justificatif
                </ButtonLink>
                <div className="separator" />
                <ButtonLink
                  target="_blank"
                  to={`${immatriculation.siteLink}`}
                  alt
                >
                  ⇢ Voir la fiche sur le site de CMA France
                </ButtonLink>
              </div>
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

export default ImmatriculationRNM;
