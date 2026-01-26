import { after } from "next/server";
import { Suspense } from "react";
import { buildAndVerifyTVAFetcher } from "server-fetch/public";
import FAQLink from "#components-ui/faq-link";
import { Loader } from "#components-ui/loader";
import type { IUniteLegale } from "#models/core/types";
import type { ITVAIntracommunautaire } from "#models/tva";
import type { Siren } from "#utils/helpers";
import { TVACellContent } from "./content";

const NoTVA = () => (
  <i>
    Pas de{" "}
    <FAQLink to="/faq/tva-intracommunautaire" tooltipLabel="n° TVA valide">
      Cette structure n’est plus en activité, par conséquent elle ne peut pas
      avoir de numéro de TVA valide.
    </FAQLink>
  </i>
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
}> = async ({ tva: tvaProp, siren }) => {
  const { tvaNumber, mayHaveMultipleTVANumber } = tvaProp;

  const controller = new AbortController();
  const verification = buildAndVerifyTVAFetcher(siren, controller);

  after(() => {
    controller.abort();
  });

  return (
    <Suspense
      fallback={
        <>
          <Loader />
          {/*
      This whitespace ensure the line will have the same height as any written line
      It should avoid content layout shift for SEO
    */}
          &nbsp;
        </>
      }
    >
      <TVACellContent
        mayHaveMultipleTVANumber={mayHaveMultipleTVANumber}
        tvaNumber={tvaNumber}
        verification={verification}
      />
    </Suspense>
  );
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
