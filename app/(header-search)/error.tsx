"use client";

import {
  type NextAppError,
  useLogFatalErrorAppClient,
} from "hooks/use-log-fatal-error-app-client";
import { SearchErrorExplanations } from "#components/error-explanations";
import { HeaderPageRouter } from "#components/header/header-page-router";

export default function ErrorPage({ error }: { error: NextAppError }) {
  useLogFatalErrorAppClient(error);

  return (
    <>
      <HeaderPageRouter useAgentCTA={true} useMap={false} useSearchBar={true} />
      <main className="fr-container">
        <div className="fr-container">
          <SearchErrorExplanations />
        </div>
      </main>
    </>
  );
}
