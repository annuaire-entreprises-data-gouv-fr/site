import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { NotASirenError, SirenNotFoundError } from '../../models';
import {
  redirectPageNotFound,
  redirectServerError,
  redirectSirenIntrouvable,
} from '../../utils/redirect';
import { Section } from '../../components/section';
import ButtonLink from '../../components/button';
import HorizontalSeparator from '../../components/horizontal-separator';
import { download } from '../../components/icon';
import { cma, inpi } from '../../public/static/logo';
import Title, { FICHE } from '../../components/title-section';
import ImmatriculationNotFound from '../../components/introuvable/immatriculation';
import { Tag } from '../../components/tag';
import Annonces from '../../components/annonces';
import { FullTable } from '../../components/table/full';
import getJustificatifs, { IJustificatifs } from '../../models/justificatifs';

interface IProps extends IJustificatifs {}

const JustificatifPage: React.FC<IProps> = ({
  uniteLegale,
  conventionCollectives,
  immatriculations,
}) => (
  <Page
    small={true}
    title={`Justificatif d’immatricuation - ${uniteLegale.nomComplet}`}
    noIndex={true}
  >
    <div className="content-container">
      <br />
      <a href={`/entreprise/${uniteLegale.siren}`}>← Fiche entité</a>
      <Title
        name={uniteLegale.nomComplet}
        siren={uniteLegale.siren}
        siret={uniteLegale.siege.siret}
        isActive={uniteLegale.siege.estActif}
        isDiffusible={uniteLegale.estDiffusible}
        ficheType={FICHE.JUSTIFICATIFS}
      />
      {immatriculations.rncsLink && (
        <Section title="Cette entité est immatriculée au RCS">
          <div className="description">
            <div>
              Cette entité possède une fiche d'immatriculation sur le{' '}
              <b>Registre National du Commerce et des Sociétés (RNCS)</b> qui
              liste les entreprises enregistrées auprès des Greffes des
              tribunaux de commerce et centralisées par l'INPI.
            </div>
            <div className="logo-wrapper">{inpi}</div>
          </div>
          <div className="layout-center">
            {/* <ButtonLink target="_blank" href={`${hrefRNCS}?format=pdf`}>
              {download} Télécharger le justificatif
            </ButtonLink> */}
            <div className="separator" />
            <ButtonLink
              target="_blank"
              href={`${immatriculations.rncsLink}`}
              alt
            >
              ⇢ Voir la fiche sur le site de l’INPI
            </ButtonLink>
          </div>
        </Section>
      )}
      {immatriculations.rncsLink && immatriculations.rnmLink && (
        <HorizontalSeparator />
      )}
      {immatriculations.rncsLink && (
        <Section title="Cette entité est immatriculée au RM">
          <div className="description">
            <div>
              Cette entité possède une fiche d'immatriculation sur le{' '}
              <b>Répertoire National des Métiers (RNM)</b> qui liste les
              entreprises artisanales enreigstrées auprès des Chambres des
              Métiers et de l'Artisanat (CMA France).
            </div>
            <div className="logo-wrapper">{cma}</div>
          </div>
          <div className="layout-center">
            <ButtonLink
              target="_blank"
              href={`${immatriculations.rncsLink}?format=pdf`}
            >
              {download} Télécharger le justificatif
            </ButtonLink>
            <div className="separator" />
            <ButtonLink
              target="_blank"
              href={`${immatriculations.rncsLink}?format=html`}
              alt
            >
              ⇢ Voir la fiche sur le site de CMA France
            </ButtonLink>
          </div>
        </Section>
      )}
      {!immatriculations.rncsLink && !immatriculations.rnmLink && (
        <ImmatriculationNotFound />
      )}
      <HorizontalSeparator />
      {uniteLegale.estDiffusible && (
        <>
          <Section title="Conventions collectives">
            {conventionCollectives.length === 0 ? (
              <div>
                Cette entité n’a aucune convention collective enregistrée
              </div>
            ) : (
              <FullTable
                head={['SIRET', 'Titre', 'N°IDCC', 'Convention']}
                body={conventionCollectives.map((convention) => [
                  <a href={`/etablissement/${convention.siret}`}>
                    {convention.siret}
                  </a>,
                  convention.title,
                  <Tag>{convention.idccNumber}</Tag>,
                  <ButtonLink target="_blank" href={convention.url} alt small>
                    ⇢&nbsp;Consulter
                  </ButtonLink>,
                ])}
              />
            )}
          </Section>
          <HorizontalSeparator />
          <Annonces siren={uniteLegale.siren} />
        </>
      )}
    </div>
    <style jsx>{`
      .separator {
        width: 10px;
        height: 10px;
      }
      .description {
        display: flex;
        margin-bottom: 20px;
        flex-direction: row;
      }
      .logo-wrapper {
        padding-left: 20px;
        width: calc(30% - 20px);
      }
      .logo-wrapper svg {
        width: 100%;
      }
      .content-container {
        margin: 20px auto 40px;
      }
      @media only screen and (min-width: 1px) and (max-width: 900px) {
        .description {
          flex-direction: column;
        }
        .logo-wrapper {
          margin: 20px auto 0;
          padding: 0;
        }
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siren = context.params.slug as string;

  try {
    const justificatifs = await getJustificatifs(siren);

    return {
      props: justificatifs,
    };
  } catch (e) {
    if (e instanceof NotASirenError) {
      redirectPageNotFound(context.res, siren);
    } else if (e instanceof SirenNotFoundError) {
      redirectSirenIntrouvable(context.res, siren);
    } else {
      redirectServerError(context.res, e.message);
    }
    return { props: {} };
  }
};

export default JustificatifPage;
