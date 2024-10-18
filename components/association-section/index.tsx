'use client';

import AssociationAdressAlert from '#components-ui/alerts-with-explanations/association-adress';
import FAQLink from '#components-ui/faq-link';
import BreakPageForPrint from '#components-ui/print-break-page';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IDataAssociation } from '#models/association/types';
import { getPersonnalDataAssociation } from '#models/core/diffusion';
import { IAssociation, IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import { IdRna, formatDate, formatIntFr } from '#utils/helpers';
import { APIRoutesPaths } from 'app/api/data-fetching/routes-paths';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';
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
    impotCommerciaux = false,
  } = association || {};

  return [
    ['N°RNA', formatIntFr(idAssociation)],
    ['Nom', nomComplet],
    ['Famille', libelleFamille],
    ['Objet', objet],
    [
      <FAQLink tooltipLabel="Regime">
        Les deux régimes possibles sont “Loi 1901” (cas général des associations
        établies en France) et “Alsace-Moselle” (associations dont le siège se
        trouve en Alsace et en Moselle, régies par un droit local)
      </FAQLink>,
      regime,
    ],
    ['Forme juridique', formeJuridique],
    ['Reconnue d’utilité publique', utilPublique ? 'Oui' : 'Non'],
    [
      <FAQLink tooltipLabel="Éligible CEC">
        Compte d’Engagement Citoyen
      </FAQLink>,
      eligibiliteCEC ? 'Oui' : 'Non',
    ],
    [
      <FAQLink tooltipLabel="Assujettie aux impôts commerciaux">
        Indique si l’association est soumise aux impôts commerciaux (à la TVA ou
        à l’impôt sur les sociétés). Cela concerne notamment les associations
        exerçant une activité lucrative.
      </FAQLink>,
      impotCommerciaux ? 'Oui' : 'Non',
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

  const association = useAPIRouteData(
    APIRoutesPaths.Association,
    uniteLegale.siren,
    session
  );

  return (
    <>
      <AsyncDataSectionClient
        title="Répertoire National des Associations"
        sources={[EAdministration.MI]}
        id="association-section"
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
      </AsyncDataSectionClient>
      <BreakPageForPrint />
    </>
  );
};

export default AssociationSection;
