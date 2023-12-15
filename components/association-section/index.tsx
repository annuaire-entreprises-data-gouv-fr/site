import React from 'react';
import AssociationAdressAlert from '#components-ui/alerts/association-adress';
import Warning from '#components-ui/alerts/warning';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { Tag } from '#components-ui/tag';
import { Section } from '#components/section';
import { DataSection } from '#components/section/data-section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IAssociation, IDataAssociation } from '#models/index';
import { IdRna, formatDate, formatIntFr } from '#utils/helpers';
import { isTwoMonthOld } from '#utils/helpers/checks';

const AssociationNotFound: React.FC<{
  uniteLegale: IAssociation;
}> = ({ uniteLegale }) => (
  <>
    <Warning>
      Cette structure est une association, mais aucune information n’a été
      trouvée dans le <b>Répertoire National des Associations (RNA)</b>.
      {!isTwoMonthOld(uniteLegale.dateCreation) && (
        <>
          <br />
          Cette structure a été créée il y a moins de deux mois. Il est donc
          possible qu’elle n’ait pas encore été publiée au RNA et qu’elle le
          soit prochainement.
        </>
      )}
    </Warning>
    <TwoColumnTable
      body={[
        ['N°RNA', formatIntFr(uniteLegale.association.idAssociation || '')],
      ]}
    />
  </>
);

export default function AssociationSection({
  uniteLegale,
  association,
}: {
  uniteLegale: IAssociation;
  association: IDataAssociation | IAPINotRespondingError | null;
}) {
  const { idAssociation = '' } = uniteLegale.association;

  if (!association) {
    // Data can be null if the natureJuridique is an association,
    // but no idAssociation is provided by Insee API call.
    return (
      <Section
        title={`Répertoire National des Associations`}
        sources={[EAdministration.MI]}
      >
        <AssociationNotFound uniteLegale={uniteLegale} />;
      </Section>
    );
  }

  return (
    <>
      <DataSection
        title="Répertoire National des Associations"
        sources={[EAdministration.MI]}
        data={association}
        notFoundInfo={<AssociationNotFound uniteLegale={uniteLegale} />}
      >
        {(association) => (
          <>
            <AssociationAdressAlert
              uniteLegale={uniteLegale}
              association={association}
            />
            <p>
              Cette structure est inscrite au{' '}
              <b>Répertoire National des Associations (RNA)</b>, avec les
              informations suivantes&nbsp;:
            </p>
            <TwoColumnTable body={getTableData(idAssociation, association)} />
            {idAssociation && (
              <>
                <br />
                Retrouvez plus d&apos;informations (comptes, effectifs et
                documents administratifs) sur la{' '}
                <a
                  target="_blank"
                  href={`https://www.data-asso.fr/annuaire/association/${idAssociation}?docFields=documentsDac,documentsRna`}
                  rel="noreferrer"
                >
                  fiche data-asso de cette association
                </a>
                .
              </>
            )}
          </>
        )}
      </DataSection>
      <HorizontalSeparator />
      <BreakPageForPrint />
    </>
  );
}

const getTableData = (
  idAssociation: string | IdRna,
  association: IDataAssociation
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
                <b>{agr.type}&nbsp;:</b> attribué le{' '}
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
    ['Adresse du siège', adresseSiege],
    ['Adresse de gestion', adresseGestion],
    [
      'Téléphone',
      telephone ? <a href={`tel:${telephone}`}>{telephone}</a> : '',
    ],
    ['Email', mail ? <a href={`mailto:${mail}`}>{mail}</a> : ''],
    [
      'Site web',
      siteWeb ? (
        <a href={siteWeb} target="_blank" rel="noreferrer">
          {siteWeb}
        </a>
      ) : (
        ''
      ),
    ],
  ];
};
