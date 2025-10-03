"use client";

import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";
import MatomoEvent from "#components/matomo-event";
import { CopyPaste } from "#components/table/copy-paste";
import FAQLink from "#components-ui/faq-link";
import { Icon } from "#components-ui/icon/wrapper";
import InformationTooltip from "#components-ui/information-tooltip";
import { Loader } from "#components-ui/loader";
import type { IUniteLegale } from "#models/core/types";
import { hasAnyError, isDataLoading } from "#models/data-fetching";
import type { ITVAIntracommunautaire } from "#models/tva";
import { formatIntFr, type Siren } from "#utils/helpers";

const NoTVA = () => (
  <i>
    Pas de{" "}
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
    Pas de{" "}
    <FAQLink
      to="/faq/tva-intracommunautaire"
      tooltipLabel="n° TVA valide connu"
    >
      Le numéro de TVA {"FR" + formatIntFr(number)} n’est pas validé par
      l’administration fiscale.
      <br />
      Plusieurs explications sont possibles :
      <ul>
        <li>soit elle n’est pas assujettie à la TVA</li>
        <li>
          soit elle est assujettie, mais ce numéro a été invalidé par
          l’administration fiscale
        </li>
        {multipleNum && (
          <li>
            soit elle est assujettie et nous ne connaissons pas son numéro
          </li>
        )}
      </ul>
    </FAQLink>
  </i>
);

const CopyCell = ({ number }: { number: string }) => (
  <CopyPaste id="tva-cell-result" label="TVA" shouldRemoveSpace={true}>
    {"FR" + formatIntFr(number)}
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
  const verification = useAPIRouteData(APIRoutesPaths.VerifyTva, siren, null);
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
          horizontalOrientation="left"
          label={
            <>
              Nous n’avons pas pu controler la validité de ce numéro car le
              téléservice du VIES ne fonctionne pas actuellement. Merci de
              ré-essayer plus tard pour vérifier si cette structure est bien
              assujettie à la TVA.
            </>
          }
          left="5px"
          tabIndex={0}
        >
          <Icon color="#df0a00" slug="errorFill">
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
                horizontalOrientation="left"
                label={
                  <>
                    Attention, cette structure a plusieurs activités
                    différentes.
                    <br />
                    Elle peut posséder un numéro de TVA Intracommunautaire pour
                    chacune de ces activités.
                    <br />
                    Le numéro affiché correspond à son activité la plus
                    ancienne.
                  </>
                }
                left="5px"
                tabIndex={0}
              >
                <Icon color="#ffb300" slug="lightbulbFill">
                  <CopyCell number={tva} />
                </Icon>
              </InformationTooltip>
            ) : (
              <CopyCell number={tva} />
            )}
          </>
        ) : (
          <TVAInvalide
            multipleNum={mayHaveMultipleTVANumber.allTime}
            number={tvaNumber}
          />
        )}

        {Math.random() < 0.0001 && (
          <MatomoEvent
            action={!!tva ? "valid" : "invalid"}
            category="tva"
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

  return <VerifyTVA siren={uniteLegale.siren} tva={uniteLegale.tva} />;
};

export default TVACell;
