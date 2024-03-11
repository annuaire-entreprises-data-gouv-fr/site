import React from 'react';
import {
  IUniteLegale,
  isAssociation,
  isServicePublic,
} from '#models/core/types';
import { HorizontalSeparator } from 'components-ui/horizontal-separator';
import { PrintNever } from 'components-ui/print-visibility';
import styles from './styles.module.css';

const ShortcutsSection: React.FC<{
  shortcuts: {
    label: string;
    url: string;
    external?: boolean;
    hide?: boolean;
  }[];
  title: string;
  shortcutCount: number;
}> = ({ shortcuts, title, shortcutCount }) => (
  <div
    className={styles.container}
    style={{ width: `calc(${Math.round(100 / shortcutCount)}% - 15px)` }}
  >
    {title && (
      <div>
        <strong className="title">{title}</strong>
      </div>
    )}
    {shortcuts
      .filter((s) => !s.hide)
      .map((shortcut) => (
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
          url: `/entreprise/${uniteLegale.chemin}#etablissement`,
          label: 'Infos sur le siège social',
        },
        ...(uniteLegale.etablissements.nombreEtablissements > 1
          ? [
              {
                url: `/entreprise/${uniteLegale.chemin}#etablissements`,
                label: `Voir des ${uniteLegale.etablissements.nombreEtablissements} établissements`,
              },
            ]
          : []),
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
          label: 'Extrait d’immatriculation',
          hide: isServicePublic(uniteLegale) || isAssociation(uniteLegale),
        },
        {
          url: `/justificatif/${uniteLegale.siren}`,
          label: 'Annonce de création',
          hide: isServicePublic(uniteLegale) || !isAssociation(uniteLegale),
        },
        {
          url: `/justificatif/${uniteLegale.siren}#insee`,
          label: 'Avis de situation Insee',
        },
      ],
    },
    {
      title: 'Entreprise Commerciale',
      shortcuts: [
        {
          url: `/dirigeants/${uniteLegale.siren}#beneficiaires`,
          label: 'Bénéficiaires Effectifs',
        },
        {
          url: `/justificatif/${uniteLegale.siren}#rne`,
          label: 'Capital social',
        },
        {
          url: `/annonces/${uniteLegale.siren}`,
          label: 'Procédure(s) collective(s)',
        },
      ],
      hide:
        uniteLegale.complements.estEntrepreneurIndividuel ||
        isAssociation(uniteLegale) ||
        isServicePublic(uniteLegale),
    },
    {
      title: 'Liens utiles',
      shortcuts: [
        {
          url: `https://mon-entreprise.urssaf.fr/assistants/pour-mon-entreprise/${uniteLegale.siren}`,
          label: 'Simulez impôts, salaires & dividendes',
          external: true,
        },
        {
          url: `https://place-des-entreprises.beta.gouv.fr/?pk_campaign=orientation-partenaire&pk_kwd=annuaire-entreprises`,
          label: 'Besoin d’aide ? Échangez avec un conseiller',
          external: true,
        },
      ],
      hide: isServicePublic(uniteLegale),
    },
  ];

  return (
    <PrintNever>
      <div>
        <div className={styles.wrapper}>
          {data
            .filter((d) => !d.hide)
            .map((sectionData) => (
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
    </PrintNever>
  );
};

export default UsefulShortcuts;
