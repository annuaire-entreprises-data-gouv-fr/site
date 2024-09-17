import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { INPI } from '#components/administrations';
import { estDiffusible } from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { AppScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';

type IProps = { uniteLegale: IUniteLegale; session: ISession | null };

export const DataInpiLinkWithExplanations = ({
  uniteLegale,
  session,
}: IProps) => {
  const siteLink = `${routes.rne.portail.entreprise}${uniteLegale.siren}`;

  if (
    !estDiffusible(uniteLegale) &&
    !hasRights(session, AppScope.nonDiffusible)
  ) {
    return (
      <>
        Le(s) dirigeant(s) se sont opposés à la diffusion de leurs données
        personnelles. Pour télécharger l’extrait d’immatriculation de cette
        entreprise, rendez-vous sur le site{' '}
        <a href="https://data.inpi.fr">data.inpi.fr</a>.
      </>
    );
  }
  return (
    <PrintNever>
      <p>
        Pour accéder aux données contenues dans un extrait d’immatriculation
        (équivalent de{' '}
        <strong>
          <a href="/faq/extrait-kbis">l’extrait KBIS ou D1</a>
        </strong>
        ), vous pouvez soit télécharger l’{' '}
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
            nofollow={true}
            to={`/justificatif-immatriculation-pdf/${uniteLegale.siren}`}
          >
            <Icon slug="download">
              Télécharger le justificatif d’immatriculation
            </Icon>
          </ButtonLink>
        </li>
        <li>
          <ButtonLink
            target="_blank"
            to={
              siteLink || `${routes.rne.portail.entreprise}${uniteLegale.siren}`
            }
            alt
          >
            ⇢ Voir la fiche sur le site de l’INPI
          </ButtonLink>
        </li>
      </ul>
    </PrintNever>
  );
};
