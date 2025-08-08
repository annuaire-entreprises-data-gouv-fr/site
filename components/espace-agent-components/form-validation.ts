export type ValidationErrors = string | null;

export const validateEmail = (email: string): ValidationErrors => {
  if (!email?.trim()) {
    return 'L’adresse email est requise';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'L’adresse email n’est pas valide';
    }
  }

  return null;
};

export const validateGroupName = (name: string): ValidationErrors => {
  if (!name?.trim()) {
    return 'Le nom de l’équipe est requis';
  } else {
    if (name.trim().length < 2) {
      return 'Le nom de l’équipe doit contenir au moins 2 caractères';
    }
    if (name.trim().length > 100) {
      return 'Le nom de l’équipe ne peut pas dépasser 100 caractères';
    }
  }

  return null;
};
