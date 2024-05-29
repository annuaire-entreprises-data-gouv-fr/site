import { PropsWithChildren } from 'react';
import { PrintNever } from '#components-ui/print-visibility';
import { EScope, hasRights } from '#models/user/rights';
import getSession from '#utils/server-side-helper/app/get-session';

export default async function Layout(props: PropsWithChildren) {
  const session = await getSession();

  if (!hasRights(session, EScope.carteProfessionnelleTravauxPublics)) {
    return null;
  }

  return <PrintNever>{props.children}</PrintNever>;
}
