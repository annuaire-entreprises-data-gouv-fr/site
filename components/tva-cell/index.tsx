'use client';

import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import { Loader } from '#components-ui/loader';
import MatomoEvent from '#components/matomo-event';
import { CopyPaste } from '#components/table/copy-paste';
import { isAPILoading } from '#models/api-loading';
import { isAPINotResponding } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { ITVAIntracommunautaire } from '#models/tva';
import { Siren, formatIntFr } from '#utils/helpers';
import useFetchTVA from 'hooks/fetch/tva';

const NoTVA = () => <i>Non-assujetti à la TVA</i>;

const Unknown = () => (
  <i>
    <FAQLink
      to="/faq/tva-intracommunautaire"
      tooltipLabel="Numéro de TVA inconnu ou structure non-assujettie à la TVA"
    >
      Le numéro de TVA de cette entreprise est inconnu. Cela peut signifier
      qu’elle est non-assujettie à la TVA, ou qu’elle possède un numéro de TVA
      valide mais non renseigné dans nos bases.
    </FAQLink>
  </i>
);

const CopyCell = ({ number }: { number: string }) => (
  <CopyPaste shouldTrim={true} id="tva-cell-result" label="TVA">
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
  const verification = useFetchTVA(siren);
  if (isAPILoading(verification)) {
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
  } else if (isAPINotResponding(verification)) {
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
        ) : mayHaveMultipleTVANumber.allTime ? (
          <>
            <Unknown />
          </>
        ) : (
          <NoTVA />
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
