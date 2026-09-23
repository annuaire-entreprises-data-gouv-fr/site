import FAQLink from "#/components-ui/faq-link";
import { isEESEFOrExploitationEnCommunFromNatureJuridique } from "#/utils/helpers/checks";

export default function DisambiguationTooltip({
  dataType,
  isInIg,
  isInInpi,
  natureJuridique,
}: {
  dataType: string;
  isInIg?: boolean;
  isInInpi?: boolean;
  natureJuridique: string;
}) {
  if (
    isEESEFOrExploitationEnCommunFromNatureJuridique(natureJuridique) ||
    (isInIg && isInInpi)
  ) {
    return null;
  }

  return (
    <>
      {" ("}
      {!isInIg && (
        <FAQLink tooltipLabel="incohérence">
          Ce {dataType} n‘apparait pas dans les données d‘Infogreffe.
        </FAQLink>
      )}
      {!isInInpi && (
        <FAQLink tooltipLabel="incohérence">
          Ce {dataType} n‘apparait pas dans les données de l‘INPI.
        </FAQLink>
      )}
      {")"}
    </>
  );
}
