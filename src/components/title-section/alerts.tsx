import ActiveButRadieeRCSAlert from "#/components-ui/alerts-with-explanations/active-but-radiee-rcs";
import MultipleSirenAlert from "#/components-ui/alerts-with-explanations/multiple-siren";
import NoSiegeSocialAlert from "#/components-ui/alerts-with-explanations/no-siege-social";
import NonDiffusibleAlert from "#/components-ui/alerts-with-explanations/non-diffusible";
import NotInSireneAlert from "#/components-ui/alerts-with-explanations/not-in-sirene-alert";
import { NotLuhnValidAlert } from "#/components-ui/alerts-with-explanations/not-luhn-valid";
import type { IAgentInfo } from "#/models/authentication/agent";
import type { ISTATUTDIFFUSION } from "#/models/core/diffusion";
import type { IUniteLegale } from "#/models/core/types";

export default function TitleAlerts({
  uniteLegale,
  user,
  statutDiffusion,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
  statutDiffusion: ISTATUTDIFFUSION;
}) {
  return (
    <>
      <NotLuhnValidAlert uniteLegale={uniteLegale} />
      <NoSiegeSocialAlert uniteLegale={uniteLegale} />
      <MultipleSirenAlert uniteLegale={uniteLegale} />
      <NotInSireneAlert uniteLegale={uniteLegale} />
      <ActiveButRadieeRCSAlert uniteLegale={uniteLegale} user={user} />
      <NonDiffusibleAlert statutDiffusion={statutDiffusion} user={user} />
    </>
  );
}
