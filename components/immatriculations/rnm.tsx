import React from 'react';
import ButtonLink from '#components-ui/button';
import { download } from '#components-ui/icon';
import BreakPageForPrint from '#components-ui/print-break-page';
import { PrintNever } from '#components-ui/print-visibility';
import { VerifiedTag } from '#components-ui/verified-tag';
import AdministrationNotResponding from '#components/administration-not-responding';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IImmatriculationRNM } from '#models/immatriculation/rnm';
import { IUniteLegale } from '#models/index';
import { formatDate, formatIntFr } from '#utils/helpers';

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
      <VerifiedTag isVerified={!immatriculation.dateRadiation}>
        {immatriculation.dateRadiation ? 'Radiée' : 'Inscrite'}
      </VerifiedTag>,
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
              Cette structure possède une fiche d’immatriculation sur le{' '}
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
