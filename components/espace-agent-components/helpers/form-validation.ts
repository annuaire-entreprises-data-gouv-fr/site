export type ValidationErrors = string | null;

export const validateEmail = (email: string): ValidationErrors => {
  if (!email?.trim()) {
    return "L’adresse email est requise";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return "L’adresse email n’est pas valide";
  }

  return null;
};

export const validateEmails = (emailList: string): ValidationErrors => {
  const emails = emailList.split(",").filter((email) => Boolean(email.trim()));

  const invalidEmails = emails.filter((email) => validateEmail(email));

  if (invalidEmails.length === 0) {
    return null;
  }

  const plural = invalidEmails.length === 1 ? "" : "s";
  return `Adresse${plural} email${plural} invalide${plural} : ${invalidEmails.join(
    ", "
  )}`;
};

export const validateGroupName = (name: string): ValidationErrors => {
  if (!name?.trim()) {
    return "Le nom du groupe est requis";
  }
  if (name.trim().length < 2) {
    return "Le nom du groupe doit contenir au moins 2 caractères";
  }
  if (name.trim().length > 100) {
    return "Le nom du groupe ne peut pas dépasser 100 caractères";
  }

  return null;
};
