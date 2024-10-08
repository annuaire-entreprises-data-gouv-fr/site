'use client';

import { SearchErrorExplanations } from '#components/error-explanations';
import { HeaderPageRouter } from '#components/header/header-page-router';
import {
  NextAppError,
  useLogFatalErrorAppClient,
} from 'hooks/use-log-fatal-error-app-client';

export default function ErrorPage({ error }: { error: NextAppError }) {
  useLogFatalErrorAppClient(error);

  return (
    <>
      <HeaderPageRouter useSearchBar={true} useAgentCTA={true} useMap={false} />
      <main className="fr-container">
        <div className="fr-container">
          <SearchErrorExplanations />
        </div>
      </main>
    </>
  );
}
