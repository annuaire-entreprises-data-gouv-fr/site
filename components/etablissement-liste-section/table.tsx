import FAQLink from '#components-ui/faq-link';
import { Tag } from '#components-ui/tag';
import IsActiveTag from '#components-ui/tag/is-active-tag';
import { NonDiffusibleTag } from '#components-ui/tag/non-diffusible-tag';
import { FullTable } from '#components/table/full';
import { estNonDiffusibleStrict } from '#models/core/diffusion';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import {
  formatDate,
  formatSiret,
  uniteLegaleLabelWithPronounContracted,
} from '#utils/helpers';

export const EtablissementTable: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const etablissements = uniteLegale.etablissements;
  return (
    <FullTable
      head={['Établissement', 'Création', 'État']}
      body={etablissements.map((etablissement: IEtablissement) => [
        <>
          {estNonDiffusibleStrict(etablissement) ? (
            <>
              <a href="#">{formatSiret(etablissement.siret)} </a>
              <NonDiffusibleTag etablissementOrUniteLegale={etablissement} />
            </>
          ) : (
            <>
              <div>
                <a href="#">{formatSiret(etablissement.siret)}</a>
              </div>
              <div>
                {etablissement.adressePostale}
                {etablissement.estSiege ? (
                  <Tag color="info">siège social</Tag>
                ) : etablissement.ancienSiege ? (
                  <Tag>ancien siège social</Tag>
                ) : null}
              </div>
              {etablissement.activitePrincipale !==
                uniteLegale.activitePrincipale && (
                <div>
                  <FAQLink tooltipLabel={<strong>Activité spécifique</strong>}>
                    Cet établissement a une activité différente de celui{' '}
                    {uniteLegaleLabelWithPronounContracted(uniteLegale)}{' '}
                    {uniteLegale.nomComplet}
                  </FAQLink>
                  {' : '}
                  {etablissement.libelleActivitePrincipale}
                </div>
              )}
            </>
          )}
        </>,
        (!estNonDiffusibleStrict(etablissement) &&
          formatDate(etablissement.dateCreation)) ||
          '',
        <>
          <IsActiveTag
            etatAdministratif={etablissement.etatAdministratif}
            statutDiffusion={etablissement.statutDiffusion}
            since={etablissement.dateFermeture}
          />
        </>,
      ])}
    />
  );
};
