import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { INPI } from '#components/administrations';
import { Section } from '#components/section';
import { EAdministration } from '#models/administrations/EAdministration';
import { estDiffusible } from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';

export const JustificatifImmatriculationRNE = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  const siteLink = `${routes.rne.portail.entreprise}${uniteLegale.siren}`;

  if (
    !estDiffusible(uniteLegale) &&
    !hasRights(session, EScope.nonDiffusible)
  ) {
    return (
      <Section
        title="Justificatif d’immatriculation au RNE"
        id="justificatif-immatriculation-rne"
        sources={[EAdministration.INPI]}
      >
        Le(s) dirigeant(s) se sont opposés à la diffusion de leurs données
        personnelles. Pour télécharger l’extrait d’immatriculation de cette
        entreprise, rendez-vous sur le site{' '}
        <a href="https://data.inpi.fr">data.inpi.fr</a>.
      </Section>
    );
  }
  return (
    <Section
      title="Justificatif d’immatriculation au RNE"
      id="justificatif-immatriculation-rne"
      sources={[EAdministration.INPI]}
    >
      <PrintNever>
        <p>
          Pour accéder aux données contenues dans un extrait d’immatriculation
          (équivalent de{' '}
          <strong>
            <a href="/faq/extrait-kbis">l’extrait KBIS ou D1</a>
          </strong>
          ), vous pouvez soit télécharger le{' '}
          <strong>
            justificatif d’immatriculation au Registre National des Entreprises
            (RNE)
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
                siteLink ||
                `${routes.rne.portail.entreprise}${uniteLegale.siren}`
              }
              alt
            >
              ⇢ Voir la fiche sur le site de l’INPI
            </ButtonLink>
          </li>
        </ul>
      </PrintNever>
    </Section>
  );
};
