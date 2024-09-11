import { Warning } from '#components-ui/alerts';
import IsActiveTag from '#components-ui/is-active-tag';
import { Tag } from '#components-ui/tag';
import MapEtablissements from '#components/map/map-etablissements';
import NonRenseigne from '#components/non-renseigne';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';
import { estNonDiffusibleStrict } from '#models/core/diffusion';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import { Siret, formatDate, formatSiret } from '#utils/helpers';
import styles from './style.module.css';

export const EtablissementsSection = ({
  uniteLegale,
  initialSelectedSiret,
}: {
  uniteLegale: IUniteLegale;
  initialSelectedSiret: Siret;
}) => (
  <Section
    id="etablissements"
    title={`${uniteLegale.etablissements.nombreEtablissements} établissement(s) de ${uniteLegale.nomComplet}`}
    sources={[EAdministration.INSEE]}
    lastModified={uniteLegale.dateDerniereMiseAJour}
  >
    <Warning>
      Nous n’avons pas réussi à déterminer la géolocalisation de cet
      établissement, car ses coordonnées sont invalides ou inconnues : [
      {uniteLegale.etablissements.all[0].latitude || '⎽'}°,{' '}
      {uniteLegale.etablissements.all[0].longitude || '⎽'}
      °].
    </Warning>
    <br />
    <div className={styles.etablissementListWrapper}>
      <div>
        {uniteLegale.etablissements.all.map((etablissement: IEtablissement) => (
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
      <MapEtablissements etablissements={uniteLegale.etablissements.all} />
    </div>
  </Section>
);
