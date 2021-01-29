import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { isSirenOrSiret } from '../../utils/helper';
import { getUniteLegale, UniteLegale } from '../../model';
import redirect, {
  redirectPageNotFound,
  redirectSirenIntrouvable,
} from '../../utils/redirect';
import { Section } from '../../components/section';
import ButtonLink from '../../components/button';
import HorizontalSeparator from '../../components/horizontalSeparator';
import { download } from '../../public/static/icon';
import { cma, inpi } from '../../public/static/logo';
import { TitleImmatriculation } from '../../components/titleSection';
import routes from '../../model/routes';
import getConventionCollective, {
  IConventions,
} from '../../model/conventionCollective';
import ImmatriculationNotFound from '../../components/introuvable/immatriculation';
import { Tag } from '../../components/tag';
import Annonces from '../../components/annonces';
import { FullTable } from '../../components/table/full';

interface IProps {
  uniteLegale: UniteLegale;
  hrefRNCS: string;
  hrefRNM: string;
  conventionCollectives: IConventions[];
}

const EtablissementPage: React.FC<IProps> = ({
  uniteLegale,
  conventionCollectives,
  hrefRNCS,
  hrefRNM,
}) => (
  <Page
    small={true}
    title={`Justificatif d’immatricuation - ${uniteLegale.nom_complet}`}
    noIndex={true}
  >
    <div className="content-container">
      <br />
      <a href={`/entreprise/${uniteLegale.siren}`}>← Fiche entité</a>
      <TitleImmatriculation
        siren={uniteLegale.siren}
        name={uniteLegale.nom_complet}
      />
      {hrefRNCS && (
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
            <ButtonLink target="_blank" href={`${hrefRNCS}`} alt>
              ⇢ Voir la fiche sur le site de l’INPI
            </ButtonLink>
          </div>
        </Section>
      )}
      {hrefRNCS && hrefRNM && <HorizontalSeparator />}
      {hrefRNM && (
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
            <ButtonLink target="_blank" href={`${hrefRNM}?format=pdf`}>
              {download} Télécharger le justificatif
            </ButtonLink>
            <div className="separator" />
            <ButtonLink target="_blank" href={`${hrefRNM}?format=html`} alt>
              ⇢ Voir la fiche sur le site de CMA France
            </ButtonLink>
          </div>
        </Section>
      )}
      {!hrefRNM && !hrefRNCS && <ImmatriculationNotFound />}
      <HorizontalSeparator />
      <Section title="Conventions collectives">
        {conventionCollectives.length === 0 ? (
          <div>Cette entité n’a aucune convention collective enregistrée</div>
        ) : (
          <FullTable
            head={['SIRET', 'Titre', 'N°IDCC', 'Convention']}
            body={conventionCollectives.map((convention) => [
              <a href={`/etablissement/${convention.siret}`}>
                {convention.siret}
              </a>,
              convention.title,
              <Tag>{convention.num}</Tag>,
              <ButtonLink target="_blank" href={convention.url} alt small>
                ⇢&nbsp;Consulter
              </ButtonLink>,
            ])}
          />
        )}
      </Section>
      <HorizontalSeparator />
      <Annonces siren={uniteLegale.siren} />
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
  const slug = context.params.slug as string;

  const siren = slug ? slug.substr(slug.length - 9) : slug;

  if (!isSirenOrSiret(siren)) {
    redirectPageNotFound(context.res, siren);
    return { props: {} };
  }

  // siege social
  const uniteLegale = await getUniteLegale(siren as string);

  const conventionCollectives = await getConventionCollective(
    uniteLegale as UniteLegale
  );

  if (!uniteLegale) {
    redirectSirenIntrouvable(context.res, siren);
    return { props: {} };
  }

  const { rnmLink, rncsLink } = routes;

  const rnm = await fetch(rnmLink + siren + '?format=html');
  const rncs_test = await fetch(rncsLink + siren);

  let hrefRNM = '';
  let hrefRNCS = '';

  if (rnm.status === 200) {
    hrefRNM = rnmLink + siren;
  }

  if (rncs_test.status === 200) {
    hrefRNCS = rncsLink + siren;
  }

  return {
    props: {
      uniteLegale,
      conventionCollectives,
      hrefRNCS,
      hrefRNM,
    },
  };
};

export default EtablissementPage;
