import { ProtectedData } from '#components-ui/alerts';
import MultipleSirenAlert from '#components-ui/alerts-with-explanations/multiple-siren';
import NoSiegeSocialAlert from '#components-ui/alerts-with-explanations/no-siege-social';
import NonDiffusibleAlert from '#components-ui/alerts-with-explanations/non-diffusible';
import NotInSireneAlert from '#components-ui/alerts-with-explanations/not-in-sirene-alert';
import { NotLuhnValidAlert } from '#components-ui/alerts-with-explanations/not-luhn-valid';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { ISTATUTDIFFUSION } from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
import { AppScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';

export default function TitleAlerts({
  uniteLegale,
  session,
  statutDiffusion,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
  statutDiffusion: ISTATUTDIFFUSION;
}) {
  return (
    <>
      <NotLuhnValidAlert uniteLegale={uniteLegale} />
      <NoSiegeSocialAlert uniteLegale={uniteLegale} />
      <MultipleSirenAlert uniteLegale={uniteLegale} />
      <NotInSireneAlert uniteLegale={uniteLegale} />

      {hasRights(session, AppScope.isAgent) && (
        <PrintNever>
          <ProtectedData full>
            Vous êtes connecté avec un compte <strong>agent public</strong>. Ce
            compte vous donne accès à certaines données exclusivement réservées
            à l’administration, identifiables par la mention “
            <Icon size={12} slug="lockFill">
              Réservé aux agents publics
            </Icon>
            ” .
          </ProtectedData>
        </PrintNever>
      )}
      <NonDiffusibleAlert statutDiffusion={statutDiffusion} session={session} />
    </>
  );
}
