import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import { Loader } from '#components-ui/loader';
import FrontStateMachine from '#components/front-state-machine';
import { CopyPaste } from '#components/table/simple';
import { ITVAIntracommunautaire } from '#models/tva';
import { formatIntFr } from '#utils/helpers';

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

const CopyCell = ({ number }: { number?: string }) => (
  <CopyPaste shouldTrim={true} id="tva-cell-result">
    {number || 'Inconnu'}
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
const TVACell: React.FC<{
  tva: ITVAIntracommunautaire | null;
}> = ({ tva }) => {
  if (!tva) {
    return <NoTVA />;
  }

  const { number, mayHaveMultipleTVANumber } = tva;

  return (
    <FrontStateMachine
      id="tva-cell-wrapper"
      states={[
        mayHaveMultipleTVANumber.allTime ? <Unknown /> : <NoTVA />,
        <>
          <Loader />
          {/*
            This whitespace ensure the line will have the same height as any written line
            It should avoid content layout shift for SEO
          */}
          &nbsp;
        </>,
        <>
          {mayHaveMultipleTVANumber.currentlyActive ? (
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
        <>
          <InformationTooltip
            label={
              <>
                Nous n’avons pas pu controler la validité de ce numéro car le
                téléservice du VIES ne fonctionne pas actuellement. Merci de
                ré-essayer plus tard pour vérifier si cette structure est bien
                assujettie à la TVA.
              </>
            }
            orientation="left"
            left="5px"
          >
            <Icon slug="errorFill" color="#df0a00">
              <CopyCell number={`FR${formatIntFr(number)}`} />
            </Icon>
          </InformationTooltip>
        </>,
      ]}
    />
  );
};

export default TVACell;
