'use client';

import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import { Loader } from '#components-ui/loader';
import MatomoEvent from '#components/matomo-event';
import { CopyPaste } from '#components/table/copy-paste';
import { IUniteLegale } from '#models/core/types';
import { hasAnyError, isDataLoading } from '#models/data-fetching';
import { ITVAIntracommunautaire } from '#models/tva';
import { Siren, formatIntFr } from '#utils/helpers';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

const NoTVA = () => (
  <i>
    Pas de{' '}
    <FAQLink to="/faq/tva-intracommunautaire" tooltipLabel="n° TVA valide">
      Cette structure n’est plus en activité, par conséquent elle ne peut pas
      avoir de numéro de TVA valide.
    </FAQLink>
  </i>
);

const TVAInvalide = ({
  number,
  multipleNum,
}: {
  number: string;
  multipleNum: boolean;
}) => (
  <i>
    Pas de{' '}
    <FAQLink to="/faq/tva-intracommunautaire" tooltipLabel="n° TVA valide">
      Le numéro de TVA {'FR' + formatIntFr(number)} n’est pas validé par
      l’administration fiscale.
      <br />
      Plusieurs explications sont possibles :
      <ul>
        <li>soit la structure n’est pas assujettie à la TVA</li>
        <li>
          soit elle est assujettie, mais ce numéro a été invalidé par
          l’administration fiscale
        </li>
        {multipleNum && (
          <li>
            soit elle est assujettie, mais nous ne connaissons pas son numéro
          </li>
        )}
      </ul>
    </FAQLink>
  </i>
);

const CopyCell = ({ number }: { number: string }) => (
  <CopyPaste shouldRemoveSpace={true} id="tva-cell-result" label="TVA">
    {'FR' + formatIntFr(number)}
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

const VerifyTVA: React.FC<{
  tva: ITVAIntracommunautaire;
  siren: Siren;
}> = ({ tva, siren }) => {
  const { tvaNumber, mayHaveMultipleTVANumber } = tva;
  const verification = useAPIRouteData('verify-tva', siren, null);
  if (isDataLoading(verification)) {
    return (
      <>
        <Loader />
        {/*
      This whitespace ensure the line will have the same height as any written line
      It should avoid content layout shift for SEO
    */}
        &nbsp;
      </>
    );
  } else if (hasAnyError(verification)) {
    return (
      <>
        <InformationTooltip
          tabIndex={0}
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
            <CopyCell number={tvaNumber} />
          </Icon>
        </InformationTooltip>
      </>
    );
  } else {
    const tva = verification?.tva;
    return (
      <>
        {tva ? (
          <>
            {mayHaveMultipleTVANumber.currentlyActive ? (
              <InformationTooltip
                tabIndex={0}
                label={
                  <>
                    Attention, cette structure a plusieurs activités différentes
                    .<br />
                    Elle peut posséder un numéro de TVA Intracommunautaire pour
                    chacune de ces activités.
                    <br />
                    Le numéro affiché correspond à son activité la plus
                    ancienne.
                  </>
                }
                orientation="left"
                left="5px"
              >
                <Icon slug="lightbulbFill" color="#ffb300">
                  <CopyCell number={tva} />
                </Icon>
              </InformationTooltip>
            ) : (
              <CopyCell number={tva} />
            )}
          </>
        ) : (
          <TVAInvalide
            number={tvaNumber}
            multipleNum={mayHaveMultipleTVANumber.allTime}
          />
        )}

        {Math.random() < 0.0001 && (
          <MatomoEvent
            category="tva"
            action={!!tva ? 'valid' : 'invalid'}
            name={siren}
          />
        )}
      </>
    );
  }
};

const TVACell: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  if (!uniteLegale.tva) {
    return <NoTVA />;
  }

  return <VerifyTVA tva={uniteLegale.tva} siren={uniteLegale.siren} />;
};

export default TVACell;
