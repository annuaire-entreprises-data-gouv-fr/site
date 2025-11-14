import { Suspense } from "react";
import { getEORIValidationFetcher } from "server-fetch/public";
import { Loader } from "#components-ui/loader";
import type { Siret } from "#utils/helpers";
import { EORICellContent } from "./content";

type IProps = {
  siret: Siret;
};
export default function EORICell({ siret }: IProps) {
  const eoriValidation = getEORIValidationFetcher(siret);

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
