'use client';

import ButtonLink from '#components-ui/button';
import { IDRolesGroup } from '#models/authentication/group/groups';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import { useRouter } from 'next/navigation';

export default function FinalStep({ newGroup }: { newGroup: IDRolesGroup }) {
  const router = useRouter();

  return (
    <>
      <div className="fr-col-4">
        <img src="/images/compte/your-scopes.svg" alt="" height="280px" />
      </div>
      <div className="fr-col-8">
        <strong className="fr-card__title">
          Découvrez vos nouveaux droits
        </strong>
        <p className="fr-card__desc">
          Voilà les nouvelles données qui vous aideront à mener à bien votre
          mission :
          <ul>
            {Object.entries(ApplicationRights)
              .map(([key, value]) => {
                if (
                  hasRights(
                    { user: { scopes: newGroup.scopes } } as ISession,
                    value
                  )
                ) {
                  return <li key={key}>{value}</li>;
                }
                return null;
              })
              .filter((e) => Boolean(e))}
          </ul>
        </p>

        <ButtonLink
          onClick={() => {
            router.replace('/compte/accueil');
          }}
        >
          Terminer
        </ButtonLink>
      </div>
    </>
  );
}
