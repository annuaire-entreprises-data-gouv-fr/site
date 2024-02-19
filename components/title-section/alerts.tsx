import { ProtectedData } from '#components-ui/alerts';
import MultipleSirenAlert from '#components-ui/alerts-with-explanations/multiple-siren';
import NoSiegeSocialAlert from '#components-ui/alerts-with-explanations/no-siege-social';
import NonDiffusibleAlert from '#components-ui/alerts-with-explanations/non-diffusible';
import NotInSireneAlert from '#components-ui/alerts-with-explanations/not-in-sirene-alert';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { Tag } from '#components-ui/tag';
import { ISTATUTDIFFUSION } from '#models/core/statut-diffusion';
import { IUniteLegale } from '#models/core/types';
import { ISession, isAgent } from '#utils/session';

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
      <NoSiegeSocialAlert uniteLegale={uniteLegale} />
      <MultipleSirenAlert uniteLegale={uniteLegale} />
      <NotInSireneAlert uniteLegale={uniteLegale} />

      {isAgent(session) && (
        <PrintNever>
          <ProtectedData full>
            Vous êtes connecté avec un compte <strong>agent public</strong>. Ce
            compte vous donne accès à certaines données exclusivement réservées
            à l’administration, identifiables par la mention “
            <Icon size={12} slug="lockFill">
              Réservé aux agents publics
            </Icon>
            ” .
            <br />
            <br />
            Ce service est en <Tag color="new">beta test</Tag>. Il est possible
            que vous recontriez des bugs ou des erreurs. Si cela arrive,{' '}
            <a href="mailto:charlotte.choplin@beta.gouv.fr">
              n’hésitez pas à nous contacter
            </a>
            .
          </ProtectedData>
        </PrintNever>
      )}
      <NonDiffusibleAlert statutDiffusion={statutDiffusion} session={session} />
    </>
  );
}
