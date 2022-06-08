import React from 'react';
import { IUniteLegale } from '../../models';
import HorizontalSeparator from '../horizontal-separator';
import { PrintNever } from '../print-visibility';
import SectionTitle from '../section-title';

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
        width: 30%;
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
          url: `https://mon-entreprise.urssaf.fr/g%C3%A9rer/${uniteLegale.siren}`,
          label: 'Besoin d’aide ? Faites-vous rappeler par un conseiller',
          external: true,
        },
      ],
    },
    // {
    //   title: 'Dirigeant uniquement',
    //   titleIcon: 'fr-fi-account-line',
    //   backgroundDark: true,
    //   shortcuts: [
    //     {
    //       url: `/connexion/dirigeant?siren=${uniteLegale.siren}&page=document`,
    //       label: 'Attestation fiscale',
    //     },
    //     {
    //       url: `/connexion/dirigeant?siren=${uniteLegale.siren}&page=document`,
    //       label: 'Attestation vigilance',
    //     },
    //     {
    //       url: `/connexion/dirigeant?siren=${uniteLegale.siren}&page=document`,
    //       label: 'Statuts',
    //     },
    //     {
    //       url: `/connexion/dirigeant?siren=${uniteLegale.siren}&page=document`,
    //       label: 'Actes juridiques',
    //     },
    //     { url: 'https://monidenum.fr/', label: 'KBIS (via MonIdenum)' },
    //   ],
    // },
  ];

  return (
    <PrintNever>
      <div>
        <div className="container">
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
        .container {
          display: flex;
          justify-content: space-between;
          gap: 15px;
        }
      `}</style>
    </PrintNever>
  );
};

export default UsefulShortcuts;
