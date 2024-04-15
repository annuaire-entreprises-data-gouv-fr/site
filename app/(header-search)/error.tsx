'use client';

import { SearchErrorExplanations } from '#components/error-explanations';
import { Header } from '#components/header';
import {
  NextAppError,
  useLogFatalErrorAppClient,
} from 'hooks/use-log-fatal-error-app-client';

export default function ErrorPage({ error }: { error: NextAppError }) {
  useLogFatalErrorAppClient(error);

  return (
    <>
      <Header useSearchBar={true} useAgentCTA={true} useMap={false} />
      <main className="fr-container">
        <div className="fr-container">
          <SearchErrorExplanations />
        </div>
      </main>
    </>
  );
}
