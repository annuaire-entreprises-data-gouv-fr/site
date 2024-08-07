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
import { IAPINotRespondingError } from '#models/api-not-responding';
import {
  defaultNonDiffusiblePlaceHolder,
  estDiffusible,
} from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { IImmatriculationRNE } from '#models/immatriculation';
import { formatDate, formatIntFr } from '#utils/helpers';

type IProps = {
  immatriculation: IImmatriculationRNE | IAPINotRespondingError;
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
        Le(s) dirigeant(s) se sont opposés à la diffusion de leurs données
        personnelles. Pour télécharger l’extrait d’immatriculation de cette
        entreprise, rendez-vous sur le site{' '}
        <a href="https://data.inpi.fr">data.inpi.fr</a>.
      </p>
    );
  }
  return (
    <>
      <PrintNever>
        <p>
          Pour accéder aux données contenues dans un extrait d’immatriculation
          (équivalent de{' '}
          <strong>
            <a href="/faq/extrait-kbis">l’extrait KBIS ou D1</a>
          </strong>
          ), vous pouvez soit télécharger le{' '}
          <strong>
            justificatif d’immatriculation au Registre National des Entreprises
            (RNE)
          </strong>
          , soit consulter la fiche complète sur le site de l’
          <INPI />
          &nbsp;:
        </p>
        <ul className="fr-btns-group fr-btns-group--inline-md fr-btns-group--center">
          <li>
            <ButtonLink
              nofollow={true}
              to={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
            >
              <Icon slug="download">
                Télécharger le justificatif d’immatriculation
              </Icon>
            </ButtonLink>
          </li>
          <li>
            <ButtonLink
              target="_blank"
              to={
                siteLink ||
                `${routes.rne.portail.entreprise}${uniteLegale.siren}`
              }
              alt
            >
              ⇢ Voir la fiche sur le site de l’INPI
            </ButtonLink>
          </li>
        </ul>
      </PrintNever>
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
        notFoundInfo={
          <>
            Cette structure ne possède pas de fiche d’immatriculation au{' '}
            <strong>Registre National des Entreprises (RNE)</strong>
          </>
        }
        additionalInfoOnError={
          <ImmatriculationLinks uniteLegale={uniteLegale} />
        }
      >
        {(immatriculation) => (
          <>
            <p>
              Cette structure possède une fiche d’immatriculation au{' '}
              <strong>Registre National des Entreprises (RNE)</strong> qui liste
              les entreprises de France et qui est tenu par l’
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
                  {immatriculation.observations.length} observation(s) au{' '}
                  <strong>RNE</strong>
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
