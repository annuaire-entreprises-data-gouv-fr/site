import AssociationAdressAlert from '#components-ui/alerts-with-explanations/association-adress';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { Tag } from '#components-ui/tag';
import { AsyncDataSectionServer } from '#components/section/data-section/server';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { getAssociationFromSlug } from '#models/association';
import { IDataAssociation } from '#models/association/types';
import { getPersonnalDataAssociation } from '#models/core/statut-diffusion';
import { IAssociation, IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { IdRna, formatDate, formatIntFr } from '#utils/helpers';
import { AssociationNotFound } from './association-not-found';

const getTableData = (
  idAssociation: string | IdRna,
  association: IDataAssociation,
  uniteLegale: IUniteLegale,
  session: ISession | null
) => {
  const {
    nomComplet = '',
    objet = '',
    adresseGestion = '',
    adresseSiege = '',
    libelleFamille = '',
    formeJuridique = '',
    regime = '',
    utilPublique = false,
    datePublicationJournalOfficiel = '',
    dateCreation = '',
    dateDissolution = '',
    telephone = '',
    mail = '',
    siteWeb = '',
    agrement = [],
    eligibiliteCEC = false,
  } = association || {};

  return [
    ['N°RNA', formatIntFr(idAssociation)],
    ['Nom', nomComplet],
    ['Famille', libelleFamille],
    ['Objet', objet],
    [
      'Forme juridique',
      regime || formeJuridique || utilPublique || eligibiliteCEC ? (
        <>
          {regime ? `${regime}, ` : ''}
          {formeJuridique}
          {utilPublique && <Tag color="info">Reconnue d’utilité publique</Tag>}
          {eligibiliteCEC && <Tag color="info">Éligible CEC</Tag>}
        </>
      ) : (
        ''
      ),
    ],
    [
      'Agrément(s)',
      agrement.length > 0
        ? agrement.map((agr) => {
            return (
              <div key={agr.type}>
                <strong>{agr.type}&nbsp;:</strong> attribué le{' '}
                {formatDate(agr.dateAttribution)} ({agr.attributeur})
              </div>
            );
          })
        : '',
    ],
    ['', <br />],
    [
      'Date de publication au Journal Officiel',
      formatDate(datePublicationJournalOfficiel),
    ],
    ['Date de création', formatDate(dateCreation)],
    ...(dateDissolution && dateDissolution > dateCreation
      ? [['Date dissolution', formatDate(dateDissolution)]]
      : []),
    ['', <br />],
    [
      'Adresse du siège',
      getPersonnalDataAssociation(adresseSiege, uniteLegale, session),
    ],
    [
      'Adresse de gestion',
      getPersonnalDataAssociation(adresseGestion, uniteLegale, session),
    ],

    [
      'Téléphone',
      telephone
        ? getPersonnalDataAssociation(
            <a href={`tel:${telephone}`}>{telephone}</a>,
            uniteLegale,
            session
          )
        : '',
    ],
    [
      'Email',
      mail
        ? getPersonnalDataAssociation(
            <a href={`mailto:${mail}`}>{mail}</a>,
            uniteLegale,
            session
          )
        : '',
    ],
    [
      'Site web',
      siteWeb ? (
        <a href={siteWeb} target="_blank" rel="noopener noreferrer">
          {siteWeb}
        </a>
      ) : (
        ''
      ),
    ],
  ];
};

const AssociationSection = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IAssociation;
  session: ISession | null;
}) => {
  const { idAssociation = '' } = uniteLegale.association;

  const association = getAssociationFromSlug(uniteLegale.siren);

  return (
    <>
      <AsyncDataSectionServer
        title="Répertoire National des Associations"
        sources={[EAdministration.MI]}
        data={association}
        notFoundInfo={<AssociationNotFound uniteLegale={uniteLegale} />}
      >
        {(association) =>
          !association ? (
            <AssociationNotFound uniteLegale={uniteLegale} />
          ) : (
            <>
              <AssociationAdressAlert
                uniteLegale={uniteLegale}
                session={session}
                association={association}
              />
              <p>
                Cette structure est inscrite au{' '}
                <strong>Répertoire National des Associations (RNA)</strong>,
                avec les informations suivantes&nbsp;:
              </p>
              <TwoColumnTable
                body={getTableData(
                  idAssociation,
                  association,
                  uniteLegale,
                  session
                )}
              />
              {idAssociation && (
                <>
                  <br />
                  Retrouvez plus d&apos;informations (comptes, effectifs et
                  documents administratifs) sur la{' '}
                  <a
                    target="_blank"
                    href={`https://www.data-asso.fr/annuaire/association/${idAssociation}?docFields=documentsDac,documentsRna`}
                    rel="noopener noreferrer"
                  >
                    fiche data-asso de cette association
                  </a>
                  .
                </>
              )}
            </>
          )
        }
      </AsyncDataSectionServer>
      <HorizontalSeparator />
      <BreakPageForPrint />
    </>
  );
};

export default AssociationSection;
