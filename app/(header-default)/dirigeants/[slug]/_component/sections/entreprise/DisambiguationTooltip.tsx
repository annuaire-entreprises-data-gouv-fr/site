import FAQLink from '#components-ui/faq-link';

export default function DisambiguationTooltip({
  dataType,
  isInIg,
  isInInpi,
}: {
  dataType: string;
  isInIg?: boolean;
  isInInpi?: boolean;
}) {
  if (isInIg && isInInpi) {
    return null;
  }

  return (
    <>
      {' ('}
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
      {')'}
    </>
  );
}
