import { Siren } from '../helpers/siren-and-siret';

export interface ISession {
  passport: {
    user: {
      given_name: string;
      family_name: string;
      birthdate: string; //'YYYY-MM-DD'
      gender: 'female' | 'male';
      sub: string;
    };
    companies: {
      siren: string;
      denomination: string;
      role: string;
    }[];
  };
  navigation?: {
    sirenFrom: string;
    pagefrom: string;
    logoutRedirect?:string;
  };
}

export const getNameFromSession = (session: ISession) => {
  if (session && session.passport && session.passport.user) {
    const user = session.passport.user;
    return `${(user.given_name || '').split(' ')[0]} ${user.family_name}`;
  }
  return 'Utilisateur Inconnu';
};

export const isLoggedIn = (session: ISession | null) => {
  return session && session.passport && session.passport.user;
};

/**
 * Is user owner of siren's companies
 * @param session
 * @returns
 */
export const isCompanyOwner = (session: ISession | null, siren: Siren) => {
  const companies = getCompaniesFromSession(session);
  return companies.map((c) => c.siren).indexOf(siren) > -1;
};

export const getCompaniesFromSession = (session: ISession | null) => {
  if (session && session.passport && session.passport.companies) {
    return session.passport.companies;
  }
  return [];
};
