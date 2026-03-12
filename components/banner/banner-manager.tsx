import getSession from "#utils/server-side-helper/get-session";
import TempIncidentBanner from "./temp-incident";

export async function BannerManager() {
  const session = await getSession();

  return <TempIncidentBanner isAgent={!!session?.user} />;
}
