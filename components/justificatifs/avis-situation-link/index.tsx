import type React from "react";
import routes from "#clients/routes";
import ButtonLink from "#components-ui/button";
import FAQLink from "#components-ui/faq-link";
import { Icon } from "#components-ui/icon/wrapper";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import {
  documentNonDiffusiblePlaceHolder,
  estDiffusible,
  estNonDiffusibleProtected,
} from "#models/core/diffusion";
import type { IEtablissement } from "#models/core/types";

const AvisSituationLink: React.FC<{
  etablissement: IEtablissement;
  session: ISession | null;
  label?: string;
  button?: boolean;
}> = ({ etablissement, label, button = false, session }) => {
  const link = button ? (
    <ButtonLink
      alt
      small
      to={`${routes.sireneInsee.avis}${etablissement.siret}`}
    >
      <Icon slug="download">{label || "Avis de situation"}</Icon>
    </ButtonLink>
  ) : (
    <a
      href={`${routes.sireneInsee.avis}${etablissement.siret}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {label || "Avis de situation"}
    </a>
  );

  if (estDiffusible(etablissement)) {
    return link;
  }
  if (hasRights(session, ApplicationRights.isAgent)) {
    if (estNonDiffusibleProtected(etablissement)) {
      return link;
    }
    return (
      <FAQLink tooltipLabel="Document non disponible">
        L’avis de situation INSEE n’est pas disponible pour les entreprises non
        diffusibles, y compris pour les agents publics.
      </FAQLink>
    );
  }
  return (
    <a href="/faq/justificatif-immatriculation-non-diffusible">
      {documentNonDiffusiblePlaceHolder(etablissement)}
    </a>
  );
};

export default AvisSituationLink;
