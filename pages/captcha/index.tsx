import { GetServerSideProps } from 'next';
import React from 'react';

import Page from '../../layouts';

const Captcha: React.FC<{ url: string }> = ({ url }) => {
  return (
    <Page title="L’Annuaire des Entreprises">
      <script
        src="https://www.google.com/recaptcha/api.js"
        async
        defer
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            function onReCaptchaValid(token) {
              document.getElementById("recaptcha-form").submit();
            }`,
        }}
      ></script>
      <div className="head">
        <h1>Petite vérification 🤖/🙂</h1>
        <p>
          Nous sommes désolé pour ce dérangement.
          <br />
          Cette étape nous sert à filtrer les robots des humains et uniquement
          autoriser l’accès à ces derniers.
        </p>
        <p>
          Nous travaillons à supprimer cette étape et rendre la vérification
          entièrement automatique.
        </p>
        <p>
          En attendant, pour continuer et accéder aux données, il vous suffit de
          cocher la case ci-dessous
        </p>
      </div>
      <div className="layout-center">
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
        </form>
      </div>

      <style jsx>{`
        .catptcha-hidden {
          visibility: hidden;
        }
        .head {
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
