import type { IFondation } from "#/models/core/fondations.types";
import { capitalize } from "..";

export const fondationPageTitle = (fondation: IFondation) =>
  `${capitalize(fondation.title)} - ID RNF ${fondation.id}`;

export const fondationPageDescription = (fondation: IFondation) =>
  `L’administration permet aux particuliers et agents publics de vérifier les informations légales de la fondation ${fondation.title}, ${fondation.address}`;
