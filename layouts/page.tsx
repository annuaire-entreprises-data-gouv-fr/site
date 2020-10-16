import React from 'react';
import SearchBar from '../components/searchBar';
import { Head } from 'next/document';
import { NextSeo } from 'next-seo';
import Footer from '../components/footer';
import { Header, HeaderSmall } from '../components/header';

interface IProps {
  small?: boolean;
  currentSearchTerm?: string;
}

const Page: React.FC<IProps> = ({
  small,
  children,
  currentSearchTerm = '',
}) => (
  <div id="page-layout">
    {small ? (
      <HeaderSmall currentSearchTerm={currentSearchTerm} map={map} />
    ) : (
      <Header />
    )}
    <main>{children}</main>
    <Footer />
    <style global jsx>{`
      #page-layout {
        width: 100%;
      }
      main {
        display: inline-block;
        min-height: calc(100vh - ${small ? 130 : 210}px);
        width: 100%;
        flex-grow: 1;
      }

      @media only screen and (min-width: 1px) and (max-width: 900px) {
        main {
          min-height: 400px;
          flex-grow: 0;
        }
      }
    `}</style>
  </div>
);

export default Page;
