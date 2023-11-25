import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import { Loader } from '#components-ui/loader';
import FrontStateMachine from '#components/front-state-machine';
import { CopyPaste } from '#components/table/simple';
import { estActif } from '#models/etat-administratif';
import { IEtablissement, IUniteLegale } from '#models/index';
import { tvaNumber } from '#models/tva/utils';
import { formatIntFr } from '#utils/helpers';

function haveMultipleNafs(etablissementsList: IEtablissement[] = []) {
  return (
    Array.from(new Set(etablissementsList.map((e) => e.activitePrincipale)))
      .length > 1
  );
}

const NoTVA = () => <i>Non-assujetti à la TVA</i>;

const Unknown = () => (
  <i>
    <FAQLink
      to="/faq/tva-intracommunautaire"
      tooltipLabel="Numéro de TVA inconnu ou structure non-assujettie à la TVA"
    >
      Que signifie “inconnu ou non-assujettie à la TVA” ?
    </FAQLink>
  </i>
);

const CopyCell = () => (
  <CopyPaste shouldTrim={true} id="tva-cell-result">
    Inconnu
  </CopyPaste>
);

/**
 * Several possible outcomes
 *
 * Compute the default TVA Number
 *
 * - structure is inactive -> no need to verify default TVA number -> "Non-assujetti"
 * - structure is active -> we verify default TVA number :
 *   - default TVA number invalid
 *     - it has only ever had one NAF -> only possible TVA number is invalid -> "Non-assujetti"
 *     - it has had two or more NAF -> may have other valid numbers we dont know about or be "Non-assujetti" -> "unknown"
 *   - default TVA number succeeded
 *     - it has only one active NAF -> TVA number is the only valid one
 *     - it has two or more active NAFs -> it might have other valid TVA numbers
 *
 */
const TVACell: React.FC<{ uniteLegale: IUniteLegale }> = ({ uniteLegale }) => {
  if (!estActif(uniteLegale)) {
    return <NoTVA />;
  }

  const mayHaveMultipleTVANumbers = haveMultipleNafs(
    uniteLegale.etablissements.all
  );

  const mayHaveMultipleActiveTVANumbers = haveMultipleNafs(
    uniteLegale.etablissements.open
  );

  const { siren } = uniteLegale;
  const unverifiedTvaNumber = tvaNumber(siren);

  return (
    <FrontStateMachine
      id="tva-cell-wrapper"
      states={[
        mayHaveMultipleTVANumbers ? <Unknown /> : <NoTVA />,
        <>
          <Loader />
          {/*
            This whitespace ensure the line will have the same height as any written line
            It should avoid content layout shift for SEO
          */}
          &nbsp;
        </>,
        <>
          {mayHaveMultipleActiveTVANumbers ? (
            <InformationTooltip
              label={
                <>
                  Attention, cette structure{' '}
                  <a href="#etablissements">
                    a plusieurs activités différentes
                  </a>
                  .<br />
                  Elle peut posséder un numéro de TVA Intracommunautaire pour
                  chacune de ces activités.
                  <br />
                  Le numéro affiché correspond à son activité la plus ancienne.
                </>
              }
              orientation="left"
              left="5px"
            >
              <Icon slug="lightbulbFill" color="#ffb300">
                <CopyCell />
              </Icon>
            </InformationTooltip>
          ) : (
            <CopyCell />
          )}
        </>,
        <i>
          Le téléservice du VIES ne fonctionne pas actuellement.{' '}
          {unverifiedTvaNumber
            ? `Nous n’avons pas pu vérifier si le numéro FR${formatIntFr(
                unverifiedTvaNumber
              )} est valide.`
            : ''}{' '}
          Merci de ré-essayer plus tard.
        </i>,
      ]}
    />
  );
};

export default TVACell;
