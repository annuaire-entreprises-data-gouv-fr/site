import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { getCompanyTitle, isSirenOrSiret } from '../../utils/helper';
import { getUniteLegale, UniteLegale } from '../../model';
import redirect, { redirectSirenIntrouvable } from '../../utils/redirect';
import { Section } from '../../components/section';
import ButtonLink from '../../components/button';
import HorizontalSeparator from '../../components/horizontalSeparator';
import { download } from '../../static/icon';
import { cma, inpi } from '../../static/logo';
import { TitleImmatriculation } from '../../components/titleSection';

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
    title={`Justificatif d’immatricuation - ${getCompanyTitle(uniteLegale)}`}
    noIndex={true}
  >
    <div className="content-container">
      <TitleImmatriculation
        siren={uniteLegale.siren}
        name={getCompanyTitle(uniteLegale)}
      />
      {hrefRNCS && (
        <Section title="Cette entreprise est immatriculée au RCS">
          <div className="description">
            <div>
              Cette entreprise possède une fiche d'immatriculation sur le{' '}
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
        <Section title="Cette entreprise est immatriculée au RM">
          <div className="description">
            <div>
              Cette entreprise possède une fiche d'immatriculation sur le{' '}
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
    redirect(context.res, '/404');
  }
  const RNM_LINK = `https://api-rnm.artisanat.fr/v2/entreprises/${siren}`;
  const RNCS_LINK = `https://data.inpi.fr/entreprises/${siren}`;
  const RNCS_PRINT = `https://data.inpi.fr/print/companies/${siren}`;

  // siege social
  const uniteLegale = await getUniteLegale(siren as string);

  if (!uniteLegale || uniteLegale.statut_diffusion === 'N') {
    redirectSirenIntrouvable(context.res, siren);
  }

  const rnm = await fetch(RNM_LINK + '?format=html');
  // so instead of calling data.inpi.fr page we rather call the print page that is much faster
  const rncs_test = await fetch(RNCS_PRINT);

  let hrefRNM = '';
  let hrefRNCS = '';

  if (rnm.status === 200) {
    hrefRNM = RNM_LINK;
  }

  if (rncs_test.status === 200) {
    hrefRNCS = RNCS_LINK;
  }

  if (!hrefRNCS && !hrefRNM) {
    redirect(context.res, `/introuvable/immatriculation?q=${siren}`);
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
