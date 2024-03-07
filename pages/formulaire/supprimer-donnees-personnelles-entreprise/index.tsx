import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import TextWrapper from '#components-ui/text-wrapper';
import { ConnectionFranceConnect } from '#components/hide-personal-data-request-FC';
import { RenseignerSiren } from '#components/hide-personal-data-request-siren';
import { RequestState } from '#components/hide-personal-data-request-state';
import { LayoutSimple } from '#components/layouts/layout-simple';
import Meta from '#components/meta';
import { IUniteLegale } from '#models/core/types';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { InternalError } from '#models/exceptions';
import {
  IHidePersonalDataRequest,
  fillHidePersonalDataRequest,
} from '#models/hide-personal-data-request';
import { isEntrepreneurIndividuelFromNatureJuridique } from '#utils/helpers';
import extractParamsPageRouter from '#utils/server-side-helper/page/extract-params';
import {
  IGetServerSidePropsContextWithSession,
  postServerSideProps,
} from '#utils/server-side-helper/page/post-server-side-props';
import { getHidePersonalDataRequestFCSession } from '#utils/session';
import useSession from 'hooks/use-session';

interface IHidePersonalData {
  uniteLegale?: IUniteLegale;
  hidePersonalDataRequest?: IHidePersonalDataRequest;
}

function HidePersonalDataPage(props: IHidePersonalData) {
  const session = useSession();
  const franceConnected =
    session && !!getHidePersonalDataRequestFCSession(session);

  const title = 'Demande de suppression de données personnelles';
  return (
    <>
      <Meta
        title={title}
        description="Demande de suppression de données personnelles de dirigeant d'entreprise sur l'Annuaire des Entreprises"
        noIndex={false}
      />
      <TextWrapper>
        <h1>{title}</h1>

        {props.uniteLegale ? (
          <>
            <RequestState
              hidePersonalDataRequest={props.hidePersonalDataRequest}
              uniteLegale={props.uniteLegale as IUniteLegale}
            />
          </>
        ) : (
          <>
            <ConnectionFranceConnect />
            {franceConnected && (
              <>
                <h2>Renseigner le SIREN de votre entreprise</h2>
                <RenseignerSiren />
              </>
            )}
          </>
        )}
      </TextWrapper>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    if (context.req.method === 'POST') {
      return await postHidePersonalDataRequest(context);
    }
    return {
      props: { metadata: { useReact: true } },
    };
  }
);

async function postHidePersonalDataRequest(
  context: IGetServerSidePropsContextWithSession
) {
  const { siren } = context.req.body;
  const { isBot } = extractParamsPageRouter(context);

  const uniteLegale = await getUniteLegaleFromSlug(siren, {
    isBot,
  });

  const isEI = isEntrepreneurIndividuelFromNatureJuridique(
    uniteLegale.natureJuridique
  );

  if (isEI) {
    return {
      props: {
        metadata: { useReact: true },
        uniteLegale,
      },
    };
  }
  const franceConnect = getHidePersonalDataRequestFCSession(
    context.req.session
  );

  if (!franceConnect) {
    throw new InternalError({
      message: 'FranceConnect session is not valid',
    });
  }

  const hidePersonalDataRequest = await fillHidePersonalDataRequest(
    siren,
    franceConnect.firstName,
    franceConnect.familyName,
    franceConnect.birthdate,
    franceConnect.sub
  );
  return {
    props: {
      hidePersonalDataRequest,
      uniteLegale,
      metadata: { useReact: true },
    },
  };
}

HidePersonalDataPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutSimple>{page}</LayoutSimple>;
};

export default HidePersonalDataPage;
