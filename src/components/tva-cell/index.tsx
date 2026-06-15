import FAQLink from "#/components-ui/faq-link";
import { estActif } from "#/models/core/etat-administratif";
import type { IUniteLegale } from "#/models/core/types";
import TVAList from "./tva-list";

const NoTVA = ({ isActive }: { isActive: boolean }) => (
  <i>
    Pas de{" "}
    <FAQLink
      to="/definitions/tva-intracommunautaire"
      tooltipLabel="n° TVA valide"
    >
      {isActive
        ? ""
        : "Cette structure n’est plus en activité, par conséquent elle ne peut pas avoir de numéro de TVA valide."}
    </FAQLink>
  </i>
);

const TVACell: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const isActive = estActif(uniteLegale);
  if (!(isActive && uniteLegale.tva) || uniteLegale.tva.length === 0) {
    return <NoTVA isActive={isActive} />;
  }

  return <TVAList tvaNumbers={uniteLegale.tva} />;
};

export default TVACell;
