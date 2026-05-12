import { useAuth } from "#/contexts/auth.context";
import TempIncidentBanner from "./temp-incident";

export function BannerManager() {
  const { user } = useAuth();

  return <TempIncidentBanner isAgent={!!user} />;
}
