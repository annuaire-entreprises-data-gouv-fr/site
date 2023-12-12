import React from 'react';
import routes from '#clients/routes';
import { OpenClosedTag } from '#components-ui/badge/frequent';
import ButtonLink from '#components-ui/button';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { Tag } from '#components-ui/tag';
import { INPI } from '#components/administrations';
import { DataSection } from '#components/section/data-section';
import { FullTable } from '#components/table/full';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPILoading } from '#models/api-loading';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IImmatriculationRNE } from '#models/immatriculation';
import { IUniteLegale } from '#models/index';
import {
  defaultNonDiffusiblePlaceHolder,
  estDiffusible,
} from '#models/statut-diffusion';
import { formatDate, formatIntFr } from '#utils/helpers';

type IProps = {
  immatriculation: IImmatriculationRNE | IAPINotRespondingError | IAPILoading;
  uniteLegale: IUniteLegale;
};

const ImmatriculationLinks = ({
  uniteLegale,
  siteLink,
}: {
  uniteLegale: IUniteLegale;
  siteLink?: string;
}) => {
  if (!estDiffusible(uniteLegale)) {
    return (
      <p>
        Le(s) dirigeant(s) se sont opposés à la diffusion de leur données sur
        cette page. Pour télécharger son extrait d’immatriculation, rendez-vous
        sur le site <a href="https://data.inpi.fr">data.inpi.fr</a>.
      </p>
    );
  }
  return (
    <>
      <PrintNever>
        <p>
          Pour accéder aux données contenues dans un extrait d’immatriculation
          (équivalent de <b>l’extrait KBIS ou D1</b>), vous pouvez soit
          télécharger le{' '}
          <b>
            justificatif d’immatriculation au Registre National des Entreprises
            (RNE)
          </b>
          , soit consulter la fiche complète sur le site de l’
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
            target="_blank"
            to={
              siteLink || `${routes.rne.portail.entreprise}${uniteLegale.siren}`
            }
            alt
          >
            ⇢ Voir la fiche sur le site de l’INPI
          </ButtonLink>
        </div>
      </PrintNever>
      <style jsx>{`
        .separator {
          width: 10px;
          height: 10px;
        }
      `}</style>
    </>
  );
};

const ImmatriculationRNE: React.FC<IProps> = ({
  immatriculation,
  uniteLegale,
}) => {
  return (
    <>
      <DataSection
        id="rne"
        title="Inscription au RNE"
        sources={[EAdministration.INPI]}
        data={immatriculation}
        notFoundInfo={null}
        additionalInfoOnError={
          <ImmatriculationLinks uniteLegale={uniteLegale} />
        }
      >
        {(immatriculation) => (
          <>
            <p>
              Cette structure possède une fiche d’immatriculation au{' '}
              <b>Registre National des Entreprises (RNE)</b> qui liste les
              entreprises de France et qui est tenu par l’
              <INPI />.
            </p>

            <ImmatriculationRNETable
              immatriculation={immatriculation}
              uniteLegale={uniteLegale}
            />
            <ImmatriculationLinks
              uniteLegale={uniteLegale}
              siteLink={immatriculation.siteLink}
            />

            {immatriculation.observations &&
            immatriculation.observations.length > 0 ? (
              <>
                <br />
                <p>
                  Cette structure possède également{' '}
                  {immatriculation.observations.length} observation au{' '}
                  <b>RNE</b>
                  &nbsp;:
                </p>
                <FullTable
                  head={['Date d’ajout', 'Numéro d’observation', 'Description']}
                  body={immatriculation.observations.map((o) => [
                    o.dateAjout,
                    o.numObservation ? <Tag>{o.numObservation}</Tag> : '',
                    o.description,
                  ])}
                />
              </>
            ) : null}
          </>
        )}
      </DataSection>
      <HorizontalSeparator />
    </>
  );
};

const ImmatriculationRNETable: React.FC<{
  immatriculation: IImmatriculationRNE;
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
      'Date d’immatriculation au RNE',
      formatDate(immatriculation.identite.dateImmatriculation),
    ],
    [
      'Dénomination',
      estDiffusible(uniteLegale)
        ? immatriculation.identite.denomination
        : defaultNonDiffusiblePlaceHolder,
    ],
    ['Siren', formatIntFr(uniteLegale.siren)],
    ['Nature de l’entreprise', immatriculation.identite.natureEntreprise],
    ['Forme juridique', immatriculation.identite.libelleNatureJuridique],
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

export default ImmatriculationRNE;
