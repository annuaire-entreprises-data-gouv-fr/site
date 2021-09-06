import React from 'react';
import { IEtablissement, IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import { FullTable } from '../table/full';
import { Section } from '../section';
import { Tag } from '../tag';
import IsActiveTag from '../is-active-tag';
import AvisSituationLink from '../avis-situation-link';
import ButtonLink from '../button';
import { INSEE } from '../administrations';

interface IProps {
  uniteLegale: IUniteLegale;
}

const AvisSituationNonDiffusible = () => (
  <>
    <div className="description">
      Bien que cette entité soit <b>non-diffusible</b>, l’
      <INSEE /> propose une téléprocédure qui permet{' '}
      <b>au représentant légal</b> d’une entité, d’accéder en quelques clics à
      son avis de situation.
    </div>
    <div className="layout-center">
      <ButtonLink to="https://avis-situation-sirene.insee.fr/">
        Obtenir mon avis de situation
      </ButtonLink>
    </div>
  </>
);

const AvisSituationSection: React.FC<IProps> = ({ uniteLegale }) => (
  <Section title="Avis de situation INSEE" source={EAdministration.INSEE}>
    {uniteLegale.estDiffusible ? (
      <>
        <div className="description">
          Chaque établissement immatriculé par l'INSEE au répertoire Sirene des
          entreprises possède un avis de situation.
        </div>
        <FullTable
          head={['SIRET', 'Adresse', 'Statut', 'Avis de situation']}
          body={uniteLegale.etablissements.map(
            (etablissement: IEtablissement) => [
              <a href={`/etablissement/${etablissement.siret}`}>
                {formatSiret(etablissement.siret)}
              </a>,
              etablissement.adresse,
              <>
                {!uniteLegale.estDiffusible ? (
                  <Tag>non-diffusible</Tag>
                ) : (
                  <>
                    {etablissement.estSiege && <Tag>siège social</Tag>}
                    {!etablissement.estActif && (
                      <IsActiveTag isActive={etablissement.estActif} />
                    )}
                  </>
                )}
              </>,
              <AvisSituationLink
                siret={uniteLegale.siege.siret}
                label="Télécharger"
              />,
            ]
          )}
        />
      </>
    ) : (
      <AvisSituationNonDiffusible />
    )}
  </Section>
);

export default AvisSituationSection;
