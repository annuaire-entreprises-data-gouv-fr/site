import IsActiveTag from '#components-ui/is-active-tag';
import { Tag } from '#components-ui/tag';
import MapEtablissements from '#components/map/map-etablissements';
import NonRenseigne from '#components/non-renseigne';
import { estNonDiffusibleStrict } from '#models/core/diffusion';
import { IEtablissement } from '#models/core/types';
import { formatDate, formatSiret } from '#utils/helpers';
import styles from './style.module.css';

export const EtablissementsList = ({
  etablissements,
}: {
  etablissements: IEtablissement[];
}) => (
  <>
    <br />
    <div className={styles.etablissementListWrapper}>
      <div>
        {etablissements.map((etablissement: IEtablissement) => (
          <div className={styles.etablissementListAtom}>
            <div>
              {(etablissement.enseigne || etablissement.denomination) && (
                <strong>
                  {etablissement.enseigne || etablissement.denomination}
                  <br />
                </strong>
              )}
              <a href={`/etablissements/${etablissement.siret}`}>
                {formatSiret(etablissement.siret)}
              </a>
              {estNonDiffusibleStrict(etablissement) ? (
                <NonRenseigne />
              ) : (
                <>
                  {etablissement.estSiege ? (
                    <Tag color="info">siège social</Tag>
                  ) : etablissement.ancienSiege ? (
                    <Tag>ancien siège social</Tag>
                  ) : null}
                </>
              )}
              <IsActiveTag
                etatAdministratif={etablissement.etatAdministratif}
                statutDiffusion={etablissement.statutDiffusion}
                since={etablissement.dateFermeture}
              />
            </div>
            <div>
              <strong>Adresse :</strong> {etablissement.adresse}
            </div>
            {!estNonDiffusibleStrict(etablissement) && (
              <div>
                <strong>Date de création :</strong>{' '}
                {formatDate(etablissement.dateCreation)}
              </div>
            )}
            {!estNonDiffusibleStrict(etablissement) && (
              <div>
                <strong>NAF/APE :</strong>{' '}
                {etablissement.libelleActivitePrincipale}
              </div>
            )}
          </div>
        ))}
      </div>
      <MapEtablissements etablissements={etablissements} />
    </div>
  </>
);
