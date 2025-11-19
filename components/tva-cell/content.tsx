"use client";

import { use } from "react";
import { CopyPaste } from "#components/table/copy-paste";
import FAQLink from "#components-ui/faq-link";
import { Icon } from "#components-ui/icon/wrapper";
import InformationTooltip from "#components-ui/information-tooltip";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import { hasAnyError, type IDataFetchingState } from "#models/data-fetching";
import { formatIntFr } from "#utils/helpers";

type TVACellContentProps = {
  tvaNumber: string;
  mayHaveMultipleTVANumber: {
    allTime: boolean;
    currentlyActive: boolean;
  };
  verification: Promise<
    | IAPINotRespondingError
    | Exclude<IDataFetchingState, IDataFetchingState.LOADING>
    | { tva: string | null }
  >;
};

const CopyCell = ({ number }: { number: string }) => (
  <CopyPaste id="tva-cell-result" label="TVA" shouldRemoveSpace={true}>
    {"FR" + formatIntFr(number)}
  </CopyPaste>
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

export function TVACellContent({
  tvaNumber,
  mayHaveMultipleTVANumber,
  verification,
}: TVACellContentProps) {
  const awaitedVerification = use(verification);

  if (hasAnyError(awaitedVerification)) {
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
  }

  return awaitedVerification.tva ? (
    <>
      {mayHaveMultipleTVANumber.currentlyActive ? (
        <InformationTooltip
          horizontalOrientation="left"
          label={
            <>
              Attention, cette structure a plusieurs activités différentes.
              <br />
              Elle peut posséder un numéro de TVA Intracommunautaire pour
              chacune de ces activités.
              <br />
              Le numéro affiché correspond à son activité la plus ancienne.
            </>
          }
          left="5px"
          tabIndex={0}
        >
          <Icon color="#ffb300" slug="lightbulbFill">
            <CopyCell number={awaitedVerification.tva} />
          </Icon>
        </InformationTooltip>
      ) : (
        <CopyCell number={awaitedVerification.tva} />
      )}
    </>
  ) : (
    <TVAInvalide
      multipleNum={mayHaveMultipleTVANumber.allTime}
      number={tvaNumber}
    />
  );
}
