import React from 'react';
import HorizontalSeparator from '../../components-ui/horizontal-separator';
import { PrintNever } from '../../components-ui/print-visibility';
import { IUniteLegale } from '../../models';

const ShortcutsSection: React.FC<{
  shortcuts: { label: string; url: string; external?: boolean }[];
  title: string;
  titleIcon?: string;
  backgroundDark?: boolean;
}> = ({ shortcuts, title, titleIcon, backgroundDark = false }) => (
  <div className={`container ${backgroundDark ? 'dark' : ''}`}>
    {title && (
      <div>
        <b className="title">
          {titleIcon && <span className={titleIcon}>&nbsp;</span>}
          {title}
        </b>
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
          <a href={shortcut.url}>{shortcut.label}</a>
        )}
      </div>
    ))}
    <style jsx>{`
      .container {
        border: 2px solid #dfdff1;
        padding: 15px;
        min-width: 200px;
        max-width: 300px;
      }
      .container.dark {
        background-color: #dfdff1;
      }
      .container.dark > div > b {
        color: #000091;
      }
      .container > div {
        margin-bottom: 10px;
      }

      @media only screen and (min-width: 1px) and (max-width: 1100px) {
        .container {
          max-width: 100%;
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
          label: 'Infos du siège social',
        },
        {
          url: `/entreprise/${uniteLegale.siren}#etablissements`,
          label: 'Liste des établissements',
        },
        {
          url: `/divers/${uniteLegale.siren}`,
          label: 'Convention(s) collective(s)',
        },
      ],
    },
    {
      title: 'Justificatifs d’existence',
      shortcuts: [
        {
          url: `/justificatif/${uniteLegale.siren}`,
          label: 'Extrait d’immatriculation ou annonce de création',
        },
        {
          url: `/justificatif/${uniteLegale.siren}#insee`,
          label: 'Avis de situation Insee',
        },
      ],
    },
    {
      title: 'Tribunaux de commerce (si applicable)',
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
    },
    {
      title: 'Liens utiles',
      titleIcon: 'fr-fi-account-line',
      backgroundDark: true,
      shortcuts: [
        {
          url: `https://mon-entreprise.urssaf.fr/g%C3%A9rer/${uniteLegale.siren}`,
          label: 'Simulez impôts, salaires & dividendes',
          external: true,
        },
        {
          url: `https://place-des-entreprises.beta.gouv.fr/`,
          label: 'Besoin d’aide ? Faites-vous rappeler par un conseiller',
          external: true,
        },
      ],
    },
  ];

  return (
    <PrintNever>
      <div>
        <div className="wrapper">
          {data.map((sectionData) => (
            <ShortcutsSection
              key={sectionData.title}
              title={sectionData.title}
              // titleIcon={sectionData.titleIcon}
              shortcuts={sectionData.shortcuts}
              // backgroundDark={sectionData.backgroundDark}
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
          flex-wrap: wrap;
        }
      `}</style>
    </PrintNever>
  );
};

export default UsefulShortcuts;
