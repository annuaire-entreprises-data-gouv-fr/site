import { Suspense } from "react";
import { Loader } from "#components-ui/loader";
import { getEORIValidation } from "#models/eori-validation";
import type { Siret } from "#utils/helpers";
import { withErrorHandler } from "#utils/server-side-helper/with-error-handler";
import { EORICellContent } from "./content";

type IProps = {
  siret: Siret;
};
export default function EORICell({ siret }: IProps) {
  const eoriValidation = withErrorHandler(() => getEORIValidation(siret));

  return (
    <Suspense
      fallback={
        <>
          <Loader />
          &nbsp;
        </>
      }
    >
      <EORICellContent eoriValidation={eoriValidation} />
    </Suspense>
  );
}
