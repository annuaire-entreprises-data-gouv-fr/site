import type React from "react";
import { Warning } from "#components-ui/alerts";
import type { IAdministrationMetaData } from "#models/administrations/types";
import { ReloadButton } from "./reload-button";

interface IProps {
  administrationMetaData: IAdministrationMetaData;
}

const AdministrationNotRespondingMessage: React.FC<IProps> = ({
  administrationMetaData,
}) => (
  <>
    <Warning>
      Le service de l’administration qui nous transmet cette donnée ne
      fonctionne pas en ce moment. 🛑
      <br />
      Cela vient probablement d’une surcharge ponctuelle de leurs services. Nous
      sommes désolés pour le dérangement.
      <br />
      <br />
      Vous pouvez <ReloadButton />.
    </Warning>
    <p>
      Pour en savoir plus sur l’état du service, vous pouvez consulter la
      section de cette administration{" "}
      <a
        href={`/donnees/api#${administrationMetaData.slug}`}
        rel="noreferrer noopener"
        target="_blank"
      >
        dans la page statut des API
      </a>
      {administrationMetaData.site && (
        <>
          {" "}
          ou{" "}
          <a href={administrationMetaData.site}>le site de l’administration</a>
        </>
      )}
      .
    </p>
  </>
);
export default AdministrationNotRespondingMessage;
