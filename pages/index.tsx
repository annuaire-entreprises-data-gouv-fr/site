import { GetServerSideProps } from 'next';
import React from 'react';
import SearchBar from '../components/search-bar';
import StructuredDataSearchAction from '../components/structured-data/search';
import { IPropsWithSession, withSession } from '../hocs/with-session';
import Page from '../layouts';

const Index: React.FC<IPropsWithSession> = ({ session }) => {
  return (
    <Page
      simpleHeader={true}
      title="L’Annuaire des Entreprises"
      session={session}
    >
      <StructuredDataSearchAction />
      <div className="layout-center">
        <div className="centered-search">
          <h1>L’Annuaire des Entreprises</h1>
          <h2>
            Retrouvez toutes les informations publiques concernant les
            entreprises françaises
          </h2>
          <div className="layout-center search">
            <SearchBar autoFocus={true} />
          </div>
        </div>
      </div>
      <style jsx>{`
        h1,
        h2 {
          text-align: center;
        }

        .search {
          margin-top: 30px;
        }

        .centered-search {
          margin-bottom: 32vh;
          margin-top: 10vh;
        }
      `}</style>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = withSession((context) => {
  return { props: {} };
});

export default Index;
