import { ServerErrorExplanations } from "#components/error-explanations";
import MatomoEvent from "#components/matomo-event";
import Meta from "#components/meta/meta-client";
import type { NextPageWithLayout } from "./_app";

const ServerError: NextPageWithLayout = () => (
  <>
    <Meta noIndex={true} title="Cette page est introuvable" />
    <MatomoEvent action="serverError" category="error" name="" />
    <ServerErrorExplanations />
  </>
);

export default ServerError;
