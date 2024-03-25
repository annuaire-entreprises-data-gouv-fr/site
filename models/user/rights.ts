import { IScope } from './scopes';

export type IRights = {
  // view variables
  actesRne: boolean;
  bilansRne: boolean;
  documentsRne: boolean;
  conformite: boolean;
  nonDiffusible: boolean;
  isLoggedIn: boolean;

  // avoid using these last two and prefer dedicated view variable
  isAgent: boolean;
};

export default function getRights(scopes: IScope[]): IRights {
  const isAgent = scopes.length > 0;
  const hasScope = (slug: IScope) => {
    return scopes.indexOf(slug) > -1;
  };
  return {
    actesRne: hasScope('rne'),
    bilansRne: hasScope('rne'),
    documentsRne: hasScope('rne'),
    conformite: hasScope('conformite'),
    nonDiffusible: hasScope('nondiffusible'),
    isLoggedIn: isAgent,
    isAgent,
  };
}
