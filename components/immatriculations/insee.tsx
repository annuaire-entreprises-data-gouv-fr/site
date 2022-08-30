import React from 'react';
import { IEtablissement, IUniteLegale } from '../../models';
import { EAdministration } from '../../models/administration';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import { FullTable } from '../table/full';
import { Section } from '../section';
import { Tag } from '../../components-ui/tag';
import IsActiveTag from '../../components-ui/is-active-tag';
import AvisSituationLink from '../avis-situation-link';
import ButtonLink from '../../components-ui/button';
import { INSEE } from '../administrations';
import PageCounter from '../results-page-counter';
import constants from '../../models/constants';

const AvisSituationTable: React.FC<{ etablissements: IEtablissement[] }> = ({
  etablissements,
}) => (
  <FullTable
    head={['SIRET', 'Adresse', 'Statut', 'Avis de situation']}
    body={etablissements.map((etablissement: IEtablissement) => [
      /*eslint-disable*/
      <a href={`/etablissement/${etablissement.siret}`}>
        {formatSiret(etablissement.siret)}
      </a>,
      !etablissement.estDiffusible ? (
        <i>Non renseigné</i>
      ) : (
        <>
          {etablissement.adresse}
          {etablissement.estSiege && <Tag className="info">siège social</Tag>}
        </>
      ),
      <IsActiveTag
        state={etablissement.etatAdministratif}
        since={etablissement.dateFermeture}
      />,
      <AvisSituationLink siret={etablissement.siret} label="Télécharger" />,
      /*eslint-enable*/
    ])}
  />
);

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
  <Section
    id="insee"
    title="Inscription à l’Insee"
    source={EAdministration.INSEE}
  >
    {uniteLegale.estDiffusible ? (
      <>
        <div className="description">
          Chaque établissement immatriculé par l’Insee au répertoire Sirene des
          entreprises possède un avis de situation.
        </div>
        <p>
          Si vous avez plusieurs établisements et ne savez pas quel avis de
          situation utiliser,{' '}
          <AvisSituationLink
            siret={uniteLegale.siege.siret}
            label="téléchargez celui du siège social"
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
    ) : (
      <AvisSituationNonDiffusible />
    )}
  </Section>
);

export default AvisSituationSection;
