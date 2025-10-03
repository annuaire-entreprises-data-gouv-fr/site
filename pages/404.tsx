import { ErrorNotFoundExplanations } from "#components/error-explanations";
import MatomoEvent from "#components/matomo-event";
import Meta from "#components/meta/meta-client";
import type { NextPageWithLayout } from "./_app";

const NotFound: NextPageWithLayout = () => (
  <>
    <Meta noIndex title="Cette page est introuvable" />
    <MatomoEvent action="notFound" category="error" name="" />
    <ErrorNotFoundExplanations />
  </>
);

export default NotFound;
