'use client';

import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';

export default function PrintButton() {
  return (
    <InformationTooltip
      ariaRelation="labelledby"
      tabIndex={undefined}
      label="Imprimer cette page ou la sauvegarder au format PDF"
      horizontalOrientation="right"
    >
      <button
        id="print-button"
        onClick={() => {
          window.print();
        }}
      >
        <Icon className="cursor-pointer" slug="print" />
      </button>
    </InformationTooltip>
  );
}
