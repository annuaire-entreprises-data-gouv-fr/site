import React from 'react';
import HorizontalSeparator from '../../components-ui/horizontal-separator';
import { PrintNever } from '../../components-ui/print-visibility';
import { IUniteLegale } from '../../models';
import { isAssociation } from '../../models';

const ShortcutsSection: React.FC<{
  shortcuts: { label: string; url: string; external?: boolean }[];
  title: string;
  shortcutCount: number;
}> = ({ shortcuts, title, shortcutCount }) => (
  <div className="container">
    {title && (
      <div>
        <b className="title">{title}</b>
      </div>
    )}
    {shortcuts.map((shortcut) => (
      <div key={shortcut.label}>
        →{' '}
        {shortcut.external ? (
          <a href={shortcut.url} target="_blank" rel="noreferrer noopener">
            {shortcut.label}
          </a>
        ) : (
          <a href={shortcut.url} rel="nofollow">
            {shortcut.label}
          </a>
        )}
      </div>
    ))}
    <style jsx>{`
      .container {
        border: 2px solid #dfdff1;
        padding: 15px;
        flex-grow: 0;
        flex-shrink: 0;
        width: calc(${Math.round(100 / shortcutCount)}% - 15px);
      }

      .container > div {
        margin-bottom: 10px;
      }

      @media only screen and (min-width: 1px) and (max-width: 1100px) {
        .container {
          max-width: 100%;
          min-width: 250px;
          flex-grow: 1;
        }
      }
    `}</style>
  </div>
);

const UsefulShortcuts: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  const data = [
    {
      title: 'Général',
      shortcuts: [
        {
          url: `/entreprise/${uniteLegale.siren}#etablissement`,
          label: 'Infos sur le siège social',
        },
        {
          url: `/entreprise/${uniteLegale.siren}#etablissements`,
          label: `Liste des ${uniteLegale.etablissements.nombreEtablissements} établissements`,
        },
        {
          url: `/carte/${uniteLegale.siege.siret}`,
          label: `Voir le siège sur la carte`,
        },
      ],
    },
    {
      title: 'Justificatifs d’existence',
      shortcuts: [
        {
          url: `/justificatif/${uniteLegale.siren}`,
          label: isAssociation(uniteLegale)
            ? 'Annonce de création'
            : 'Extrait d’immatriculation',
        },
        {
          url: `/justificatif/${uniteLegale.siren}#insee`,
          label: 'Avis de situation Insee',
        },
      ],
    },
    {
      title: 'Liens utiles',
      shortcuts: [
        {
          url: `https://mon-entreprise.urssaf.fr/g%C3%A9rer/${uniteLegale.siren}`,
          label: 'Simulez impôts, salaires & dividendes',
          external: true,
        },
        {
          url: `https://place-des-entreprises.beta.gouv.fr/?pk_campaign=orientation-partenaire&pk_kwd=annuaire-entreprises`,
          label: 'Besoin d’aide ? Échangez avec un conseiller',
          external: true,
        },
      ],
    },
  ];

  if (
    !uniteLegale.complements.estEntrepreneurIndividuel &&
    !isAssociation(uniteLegale)
  ) {
    data.splice(2, 0, {
      title: 'Tribunaux de commerce',
      shortcuts: [
        {
          url: `/dirigeants/${uniteLegale.siren}#beneficiaires`,
          label: 'Bénéficiaires Effectifs',
        },
        {
          url: `/justificatif/${uniteLegale.siren}#rncs`,
          label: 'Capital social',
        },
        {
          url: `/annonces/${uniteLegale.siren}`,
          label: 'Procédure(s) collective(s)',
        },
      ],
    });
  }

  return (
    <PrintNever>
      <div>
        <div className="wrapper">
          {data.map((sectionData) => (
            <ShortcutsSection
              key={sectionData.title}
              title={sectionData.title}
              shortcuts={sectionData.shortcuts}
              shortcutCount={data.length}
            />
          ))}
        </div>
        <HorizontalSeparator />
      </div>
      <style jsx>{`
        .wrapper {
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }

        @media only screen and (min-width: 1px) and (max-width: 1100px) {
          .wrapper {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </PrintNever>
  );
};

export default UsefulShortcuts;
