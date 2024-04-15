'use client';

import { SearchErrorExplanations } from '#components/error-explanations';
import {
  NextAppError,
  useLogFatalErrorAppClient,
} from 'hooks/use-log-fatal-error-app-client';

export default function ErrorPage({ error }: { error: NextAppError }) {
  useLogFatalErrorAppClient(error);

  return <SearchErrorExplanations />;
}
