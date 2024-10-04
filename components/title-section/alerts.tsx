import MultipleSirenAlert from '#components-ui/alerts-with-explanations/multiple-siren';
import NoSiegeSocialAlert from '#components-ui/alerts-with-explanations/no-siege-social';
import NonDiffusibleAlert from '#components-ui/alerts-with-explanations/non-diffusible';
import NotInSireneAlert from '#components-ui/alerts-with-explanations/not-in-sirene-alert';
import { NotLuhnValidAlert } from '#components-ui/alerts-with-explanations/not-luhn-valid';
import { ISTATUTDIFFUSION } from '#models/core/diffusion';
import { IUniteLegale } from '#models/core/types';
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
      <NonDiffusibleAlert statutDiffusion={statutDiffusion} session={session} />
    </>
  );
}
