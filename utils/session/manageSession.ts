export interface ISession {
  passport: {
    user: {
      given_name: string;
      family_name: string;
      birthdate: string; //'YYYY-MM-DD'
      gender: 'female' | 'male';
      sub: string;
    };
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
