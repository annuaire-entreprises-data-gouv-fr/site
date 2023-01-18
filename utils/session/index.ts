import type { IronSessionOptions } from 'iron-session';

export const sessionOptions: IronSessionOptions = {
  password: 'complex_password_at_least_32_characters_long',
  cookieName: 'myapp_cookiename',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

// export const getSession = (req: NextApiRequest, res: NextApiResponse) =>
//   getIronSession(req, res, {
//     cookieName: 'myapp_cookiename',
//     password: 'complex_password_at_least_32_characters_long',
//     // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
//     cookieOptions: {
//       secure: process.env.NODE_ENV === 'production',
//     },
//   });
