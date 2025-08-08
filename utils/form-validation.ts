export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email?.trim()) {
    errors.push('L\'adresse email est requise');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('L\'adresse email n\'est pas valide');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateGroupName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name?.trim()) {
    errors.push('Le nom de l\'équipe est requis');
  } else {
    if (name.trim().length < 2) {
      errors.push('Le nom de l\'équipe doit contenir au moins 2 caractères');
    }
    if (name.trim().length > 100) {
      errors.push('Le nom de l\'équipe ne peut pas dépasser 100 caractères');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!value?.trim()) {
    errors.push(`${fieldName} est requis`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};