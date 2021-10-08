import { GetServerSideProps } from 'next';
import React from 'react';

import Page from '../../layouts';

const Captcha: React.FC<{ url: string }> = ({ url }) => {
  return (
    <Page title="L’Annuaire des Entreprises">
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            function onLoad() {
              var btn = document.getElementById('captcha-submit-button');
              btn.style.display='block';
            }
            function onError(err) {
              console.error(err);
            }
            function onSubmit(token) {
              console.log(token);
              document.getElementById("h-captcha-form").submit();
            }
            `,
        }}
      ></script>
      <script
        src="https://js.hcaptcha.com/1/api.js?onload=onLoad"
        async
        defer
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
        <form id="h-captcha-form" action="/api/verify-captcha" method="GET">
          <div className="catptcha-hidden">
            <label htmlFor="url">Url</label>
            <input name="url" defaultValue={url} />
          </div>

          <div className="button-link">
            <button
              id="captcha-submit-button"
              className="h-captcha"
              data-sitekey={process.env.CAPTCHA_SITE_KEY}
              data-callback="onSubmit"
            >
              Accéder aux données
            </button>
          </div>
          <input
            className="catptcha-hidden"
            type="submit"
            value="Accéder aux données"
          />
        </form>
      </div>

      <style jsx>{`
        #captcha-submit-button {
          display: none;
        }

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
