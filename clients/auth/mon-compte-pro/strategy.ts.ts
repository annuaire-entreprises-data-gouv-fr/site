import { Issuer, generators } from 'openid-client';

const _init = false;

const code_verifier = generators.codeVerifier();

export const getClient = async () => {
  if (_init) {
    return;
  } else {
    const monCompteProIssuer = await Issuer.discover(
      'https://app-test.moncomptepro.beta.gouv.fr/'
    );

    const client = new monCompteProIssuer.Client({
      client_id: 'prout',
      client_secret: 'test',
      redirect_uris: ['https://localhost:3000/api/auth/callback'],
      id_token_signed_response_alg: 'HS256',
      post_logout_redirect_uris: ['https://localhost:3000/api/auth/logout'],
    });

    return client;
  }
};

export const authorize = async () => {
  // store the code_verifier in your framework's session mechanism, if it is a cookie based solution
  // it should be httpOnly (not readable by javascript) and encrypted.

  const code_challenge = generators.codeChallenge(code_verifier);

  const client = await getClient();
  return client.authorizationUrl({
    scope: 'openid email profile',
    code_challenge,
    code_challenge_method: 'S256',
  });
};

export const callback = async (req: any) => {
  const client = await getClient();

  const params = client.callbackParams(req);
  const tokenSet = await client.callback(
    'https://client.example.com/callback',
    params,
    { code_verifier }
  );
  console.log(tokenSet);
  const userinfo = await client.userinfo(access_token);
};
