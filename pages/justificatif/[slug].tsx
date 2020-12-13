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
import { download } from '../../static/icon';
import { cma, inpi } from '../../static/logo';
import { TitleImmatriculation } from '../../components/titleSection';
import routes from '../../model/routes';

interface IProps {
  uniteLegale: UniteLegale;
  hrefRNCS: string;
  hrefRNM: string;
}

const EtablissementPage: React.FC<IProps> = ({
  uniteLegale,
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
            <ButtonLink target="_blank" href={`${hrefRNCS}?format=pdf`}>
              {download} Télécharger le justificatif
            </ButtonLink>
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
      {!hrefRNM && !hrefRNCS && <div></div>}
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

  if (!uniteLegale) {
    redirectSirenIntrouvable(context.res, siren);
    return { props: {} };
  }

  const { rnmLink, rncsLink, rncsPrint } = routes;

  const rnm = await fetch(rnmLink + siren + '?format=html');
  // so instead of calling data.inpi.fr page we rather call the print page that is much faster
  const rncs_test = await fetch(rncsPrint + siren);

  let hrefRNM = '';
  let hrefRNCS = '';

  if (rnm.status === 200) {
    hrefRNM = rnmLink;
  }

  if (rncs_test.status === 200) {
    hrefRNCS = rncsLink + siren;
  }

  if (!hrefRNCS && !hrefRNM) {
    redirect(context.res, `/introuvable/immatriculation?q=${siren}`);
    return { props: {} };
  }

  return {
    props: {
      uniteLegale,
      hrefRNCS,
      hrefRNM,
    },
  };
};

export default EtablissementPage;
