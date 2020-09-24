import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../layouts';

interface IProps {
  response?: any;
  searchTerm?: string;
  lat?: string;
  lng?: string;
}

const About: React.FC<IProps> = ({ response, searchTerm, lat, lng }) => (
  <Page small={true} currentSearchTerm={searchTerm}>
    <div className="content-container">404</div>
    <style jsx>{``}</style>
  </Page>
);

export default About;
