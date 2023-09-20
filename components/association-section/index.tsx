import React from 'react';
import Warning from '#components-ui/alerts/warning';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { Tag } from '#components-ui/tag';
import AdministrationNotResponding from '#components/administration-not-responding';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
import { IAssociation } from '#models/index';
import { formatDate, formatIntFr } from '#utils/helpers';
import { isTwoMonthOld } from '#utils/helpers/checks';

const AssociationNotFound: React.FC<{
  uniteLegale: IAssociation;
}> = ({ uniteLegale }) => (
  <Section
    title={`Répertoire National des Associations`}
    sources={[EAdministration.MI]}
  >
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
  </Section>
);

const AssociationSection: React.FC<{
  uniteLegale: IAssociation;
}> = ({ uniteLegale }) => {
  const {
    association: { idAssociation = '', data },
  } = uniteLegale;

  if (!data) {
    return <AssociationNotFound uniteLegale={uniteLegale} />;
  }

  if (isAPINotResponding(data)) {
    if (data.errorType === 404) {
      return <AssociationNotFound uniteLegale={uniteLegale} />;
    }

    return (
      <AdministrationNotResponding
        administration={data.administration}
        errorType={data.errorType}
      />
    );
  }

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
  } = data || {};

  const lines = [
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

  return (
    <>
      <Section
        title={`Répertoire National des Associations`}
        sources={[EAdministration.MI]}
      >
        <p>
          Cette structure est inscrite au{' '}
          <b>Répertoire National des Associations (RNA)</b>, avec les
          informations suivantes&nbsp;:
        </p>
        <TwoColumnTable body={lines} />
        {idAssociation && (
          <>
            <br />
            Retrouvez plus d&apos;informations (comptes, effectifs et documents
            administratifs) sur la{' '}
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
      </Section>
      <HorizontalSeparator />
      <BreakPageForPrint />
    </>
  );
};

export default AssociationSection;
