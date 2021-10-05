import { GetServerSideProps } from 'next';
import React from 'react';
import ButtonLink from '../../components/button';

import Page from '../../layouts';

const Captcha: React.FC<{ url: string }> = ({ url }) => {
  return (
    <Page title="L’Annuaire des Entreprises">
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function onReCaptchaValid(token) {
              document.getElementById("recaptcha-form").submit();
            }
            `,
        }}
      ></script>
      <script
        async
        defer
        src="https://www.google.com/recaptcha/api.js"
      ></script>
      <div className="title">
        <h1>Êtes-vous bien un humain ? 🤔</h1>
        <p>
          Pour accéder à cette page, merci de cliquer sur le bouton ci-dessous
          pour nous permettre de vérifier que vous êtes bien un humain.
        </p>
        <p>(Car c’est bien connu, les robots n’ont pas de souris 🐭 !)</p>
      </div>
      <div className="layout-center">
        <form id="recaptcha-form" action="/api/verify-captcha" method="GET">
          <div className="catptcha-hidden">
            <label htmlFor="url">Url</label>
            <input name="url" defaultValue={url} />
          </div>

          <div className="button-link layout-center">
            <button
              className="g-recaptcha "
              data-sitekey={process.env.CAPTCHA_SITE_KEY}
              data-callback="onReCaptchaValid"
            >
              Accéder à la page
            </button>
          </div>
        </form>
        {/*
        <form id="recaptcha-form" action="/api/verify-captcha" method="GET">
          <div
            className="g-recaptcha"
            data-sitekey={process.env.CAPTCHA_SITE_KEY}
            data-callback="onReCaptchaValid"
          ></div>
          <div className="catptcha-hidden">
            <label htmlFor="url">Url</label>
            <input name="url" defaultValue={url} />
          </div>

          <input
            className="catptcha-hidden"
            type="submit"
            value="Accéder au données"
          />
        </form> */}
      </div>

      <style jsx>{`
        .catptcha-hidden {
          visibility: hidden;
        }
        .title {
          text-align: center;
        }
      `}</style>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const url = (context.query.url || '') as string;
  return {
    props: {
      url,
    },
  };
};

export default Captcha;
