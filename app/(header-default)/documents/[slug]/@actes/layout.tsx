import { PropsWithChildren } from 'react';
import { PrintNever } from '#components-ui/print-visibility';
import AgentWallDocuments from '#components/espace-agent-components/agent-wall/document';
import { EScope, hasRights } from '#models/user/rights';
import { cachedGetUniteLegale } from '#utils/server-side-helper/app/cached-methods';
import extractParamsAppRouter, {
  AppRouterProps,
} from '#utils/server-side-helper/app/extract-params';
import getSession from '#utils/server-side-helper/app/get-session';

export default async function Layout(props: PropsWithChildren<AppRouterProps>) {
  const session = await getSession();
  const { slug, isBot } = extractParamsAppRouter(props);
  const uniteLegale = await cachedGetUniteLegale(slug, isBot);

  if (!hasRights(session, EScope.actesRne)) {
    return (
      <AgentWallDocuments
        title="Actes et statuts"
        id="actes"
        uniteLegale={uniteLegale}
      />
    );
  }

  return <PrintNever>{props.children}</PrintNever>;
}
