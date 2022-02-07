import React from 'react';
import { IPropsWithSession } from '../hocs/with-session';

export const PageContext = React.createContext<IPropsWithSession>({
  session: null,
});
