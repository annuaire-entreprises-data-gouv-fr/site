import { GetServerSideProps } from 'next';
import React from 'react';
import { INSEE } from '../../../components/administrations';
import BreadCrumb from '../../../components/bread-crumb';
import ButtonLink from '../../../components/button';
import { withSession } from '../../../hocs/with-session';
import Page from '../../../layouts';
import constants from '../../../models/constants';
import { formatIntFr } from '../../../utils/helpers/formatting';
import { ISession } from '../../../utils/session/accessSession';

const HabiliationFailure: React.FC<{
  session: ISession;
  siren: string;
}> = ({ session, siren }) => {
  return (
    <Page
      title="Vous n’êtes pas autorisé(e) à accéder à cette page"
      noIndex={true}
      session={session}
    >
      <BreadCrumb
        links={[
          {
            label: `${formatIntFr(siren)}`,
            to: `/entreprise/${siren}`,
          },
          {
            label: `Espace dirigeant`,
          },
        ]}
      />
      <div className="content-container">
        <h1>Vous n’êtes pas autorisé(e) à accéder à cette page</h1>
        <p>
          Seuls les dirigeants de l’entreprise sont autorisés à accéder à cette
          page. Selon l’
          <INSEE /> vous n’êtes pas dirigeant(e) de cette entreprise.
        </p>
        Cela peut être du à une des raisons suivantes :
        <ul>
          <li>
            soit vous n’êtes <b>pas encore</b> dirigeant
          </li>
          <li>
            soit vous n’êtes <b>plus</b> dirigeant
          </li>
          <li>
            soit vous n’êtes <b>pas</b> dirigeant
          </li>
          <li>soit cette entreprise n’a pas de dirigeant enregistré</li>
        </ul>
        <b>NB: </b> certaines associations, les entreprises dirigées par des
        personnes morales et les administrations publiques ne sont pas encore
        gérée par ce service d’authentification des dirigeants d’entreprise.
        <p>
          Si vous êtes dirigeant de cette entreprise et que le problème se
          reproduit, vous pouvez{' '}
          <a href={constants.links.mailto}>nous contacter.</a>.
        </p>
        <div className="layout-center">
          <ButtonLink to="/">Retourner à la recherche</ButtonLink>
        </div>
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async (context) => {
    //@ts-ignore
    const siren = context.params.slug as string;

    return {
      props: { siren },
    };
  }
);

export default HabiliationFailure;
