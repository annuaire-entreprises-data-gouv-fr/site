import React from 'react';
import ButtonLink from '#components-ui/button';
import IsActiveTag from '#components-ui/is-active-tag';
import { Tag } from '#components-ui/tag';
import { INSEE } from '#components/administrations';
import AvisSituationLink from '#components/avis-situation-link';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import { IEtablissement, IUniteLegale } from '#models/index';
import {
  estDiffusible,
  estNonDiffusible,
  getAdresseEtablissement,
} from '#models/statut-diffusion';
import { formatSiret } from '#utils/helpers';

const AvisSituationTable: React.FC<{ etablissements: IEtablissement[] }> = ({
  etablissements,
}) => (
  <FullTable
    head={['SIRET', 'Adresse', 'Statut', 'Avis de situation']}
    body={etablissements.map((etablissement: IEtablissement) => [
      <a href={`/etablissement/${etablissement.siret}`}>
        {formatSiret(etablissement.siret)}
      </a>,
      <>
        {getAdresseEtablissement(etablissement)}
        {etablissement.estSiege && <Tag color="info">siège social</Tag>}
      </>,
      <IsActiveTag
        etatAdministratif={etablissement.etatAdministratif}
        statutDiffusion={etablissement.statutDiffusion}
        since={etablissement.dateFermeture}
      />,
      <AvisSituationLink etablissement={etablissement} label="Télécharger" />,
    ])}
  />
);

interface IProps {
  uniteLegale: IUniteLegale;
}

const AvisSituationNonDiffusible = () => (
  <>
    <div className="description">
      Bien que cette entreprise soit <b>non-diffusible</b>, l’
      <INSEE /> propose une téléprocédure qui permet{' '}
      <b>au représentant légal</b> d’une entreprise d’accéder en quelques clics
      à son avis de situation.
    </div>
    <div className="layout-center">
      <ButtonLink to="https://avis-situation-sirene.insee.fr/">
        Obtenir mon avis de situation
      </ButtonLink>
    </div>
  </>
);

const AvisSituationSection: React.FC<IProps> = ({ uniteLegale }) => (
  <Section
    id="insee"
    title="Inscription à l’Insee"
    sources={[EAdministration.INSEE]}
  >
    {estNonDiffusible(uniteLegale) ? (
      <AvisSituationNonDiffusible />
    ) : (
      <>
        <div className="description">
          Chaque établissement immatriculé par l’Insee au répertoire Sirene des
          entreprises possède un avis de situation.
        </div>
        <p>
          Si vous avez plusieurs établisements et ne savez pas quel avis de
          situation utiliser,{' '}
          <AvisSituationLink
            etablissement={uniteLegale.siege}
            label="téléchargez l’avis de situation Sirene du siège social"
          />
          .
        </p>
        {uniteLegale.etablissements.usePagination ? (
          <AvisSituationTable etablissements={uniteLegale.etablissements.all} />
        ) : (
          <>
            {uniteLegale.etablissements.open.length > 0 && (
              <>
                <h3>Etablissement(s) en activité :</h3>
                <AvisSituationTable
                  etablissements={uniteLegale.etablissements.open}
                />
              </>
            )}
            {uniteLegale.etablissements.unknown.length > 0 && (
              <>
                <h3>Etablissement(s) non-diffusible(s) :</h3>
                <AvisSituationTable
                  etablissements={uniteLegale.etablissements.unknown}
                />
              </>
            )}
            {uniteLegale.etablissements.closed.length > 0 && (
              <>
                <h3>Etablissement(s) fermé(s) :</h3>
                <AvisSituationTable
                  etablissements={uniteLegale.etablissements.closed}
                />
              </>
            )}
          </>
        )}
      </>
    )}
  </Section>
);

export default AvisSituationSection;
