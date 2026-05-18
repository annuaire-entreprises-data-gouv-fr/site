import { LabelAndCertificateBadge } from "#/components-ui/badge/frequent";
import InformationTooltip from "#/components-ui/information-tooltip";

export function LabelWithLinkToSection({
  label,
  informationTooltipLabel,
  sectionId,
  siren,
}: {
  label: string;
  informationTooltipLabel: string;
  sectionId: string;
  siren: string;
}) {
  return (
    <InformationTooltip label={informationTooltipLabel} tabIndex={undefined}>
      <LabelAndCertificateBadge
        label={label}
        link={{
          hash: sectionId,
          params: { slug: siren },
          to: "/labels-certificats/$slug",
          "aria-label": `Consulter la section ${label} pour cette structure`,
        }}
      />
    </InformationTooltip>
  );
}
