import React from 'react';
import Warning from '#components-ui/alerts/warning';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { Section } from '#components/section';
import { TwoColumnTable } from '#components/table/simple';
import { EAdministration } from '#models/administrations';
import { IAssociation } from '#models/index';
import { isTwoMonthOld } from '#utils/helpers/checks';
import { formatDate, formatIntFr } from '#utils/helpers/formatting';

const AssociationSection: React.FC<{
  uniteLegale: IAssociation;
}> = ({ uniteLegale }) => {
  const {
    association: {
      idAssociation = '',
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
      dateDissolution,
      telephone,
      mail,
      siteWeb,
      agrement = [],
      eligibiliteCEC,
    },
  } = uniteLegale;

  const data = [
    ['N° RNA (identifiant d’association)', formatIntFr(idAssociation)],
    ['Nom', nomComplet],
    ['Famille', libelleFamille],
    ['Objet', objet],
    ...(regime
      ? [
          [
            'Forme juridique',
            `${regime}, ${formeJuridique} ${
              utilPublique ? ", reconnue d'utilité publique" : ''
            }`,
          ],
        ]
      : []),
    [
      'Date de publication au journal officiel',
      formatDate(datePublicationJournalOfficiel),
    ],
    ['Date de création', formatDate(dateCreation)],
    ...(dateDissolution && dateDissolution > dateCreation
      ? [['Date dissolution', formatDate(dateDissolution)]]
      : []),
    ['Adresse du siège', adresseSiege],
    ['Adresse de gestion', adresseGestion],
    ['Téléphone', <a href={`tel:${telephone}`}>{telephone}</a>],
    ['Email', <a href={`mailto:${mail}`}>{mail}</a>],
    ['Site web', <a href={siteWeb}>{siteWeb}</a>],
    [
      'Agrement admininstratif',
      <ul>
        {agrement.map((agr) => {
          return (
            <>
              <li>
                <b>{agr.type}</b>
              </li>
              <ul>
                <li>Attributeur : {agr.attributeur}</li>
                <li>Date attribution : {formatDate(agr.dateAttribution)}</li>
              </ul>
            </>
          );
        })}
      </ul>,
    ],
    ['Eligible CEC', eligibiliteCEC ? 'Oui' : 'Non'],
  ];

  const notInRna = !nomComplet && !objet && !adresseSiege;

  return (
    <>
      <Section
        title={`Répertoire National des Associations`}
        sources={[EAdministration.MI]}
      >
        {notInRna ? (
          <Warning>
            Cette structure est une association, mais aucune information n’a été
            trouvée dans le <b>Répertoire National des Associations (RNA)</b>.
            {!isTwoMonthOld(uniteLegale.dateCreation) && (
              <>
                <br />
                Cette structure a été créée il y a moins de deux mois. Il est
                donc possible qu’elle n’ait pas encore été publiée au RNA et
                qu’elle le soit prochainement.
              </>
            )}
          </Warning>
        ) : (
          <p>
            Cette structure est inscrite au{' '}
            <b>Répertoire National des Associations (RNA)</b>, qui contient les
            informations suivantes&nbsp;:
          </p>
        )}
        <TwoColumnTable body={data} />
        <br />
        Retrouver plus d&apos;informations sur la{' '}
        <a
          target="_blank"
          href={`https://www.data-asso.fr/annuaire/association/${idAssociation}?docFields=documentsDac,documentsRna`}
          rel="noreferrer"
        >
          fiche de cette association
        </a>{' '}
        (comptes, effectifs et documents) sur{' '}
        <a
          target="_blank"
          rel="noreferrer noopener"
          href="https://www.data-asso.fr"
        >
          data-asso
        </a>
        .
      </Section>
      <HorizontalSeparator />
      <BreakPageForPrint />
    </>
  );
};

export default AssociationSection;
