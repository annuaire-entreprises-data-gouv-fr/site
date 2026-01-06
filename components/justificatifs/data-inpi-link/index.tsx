import routes from "#clients/routes";
import { INPI } from "#components/administrations";
import { Link } from "#components/Link";
import ButtonLink from "#components-ui/button";
import { Icon } from "#components-ui/icon/wrapper";
import { PrintNever } from "#components-ui/print-visibility";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { estDiffusible } from "#models/core/diffusion";
import type { IUniteLegale } from "#models/core/types";

type IProps = { uniteLegale: IUniteLegale; session: ISession | null };

export const DataInpiLinkWithExplanations = ({
  uniteLegale,
  session,
}: IProps) => {
  const siteLink = `${routes.rne.portail.entreprise}${uniteLegale.siren}`;

  if (
    !estDiffusible(uniteLegale) &&
    !hasRights(session, ApplicationRights.nonDiffusible)
  ) {
    return (
      <>
        Le(s) dirigeant(s) se sont opposés à la diffusion de leurs données
        personnelles. Pour télécharger l’extrait d’immatriculation de cette
        entreprise, rendez-vous sur le site{" "}
        <a href="https://data.inpi.fr">data.inpi.fr</a>.
      </>
    );
  }
  return (
    <PrintNever>
      <p>
        Pour accéder aux données contenues dans un extrait d’immatriculation
        (équivalent de{" "}
        <strong>
          <Link href="/faq/extrait-kbis">l'extrait KBIS ou D1</Link>
        </strong>
        ), vous pouvez soit télécharger l’{" "}
        <strong>
          extrait des inscriptions au Registre National des Entreprises (RNE)
        </strong>
        , soit consulter la fiche complète sur le site de l’
        <INPI />
        &nbsp;:
      </p>
      <ul className="fr-btns-group fr-btns-group--inline-md fr-btns-group--center">
        <li>
          <ButtonLink
            to={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
          >
            <Icon slug="download">
              Télécharger le justificatif d’immatriculation
            </Icon>
          </ButtonLink>
        </li>
        <li>
          <ButtonLink
            alt
            target="_blank"
            to={
              siteLink || `${routes.rne.portail.entreprise}${uniteLegale.siren}`
            }
          >
            ⇢ Voir la fiche sur le site de l’INPI
          </ButtonLink>
        </li>
      </ul>
    </PrintNever>
  );
};
