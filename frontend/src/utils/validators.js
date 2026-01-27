// Valider un email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Valider un mot de passe (min 8 chars, 1 majuscule, 1 minuscule, 1 chiffre)
export const isValidPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Valider un numéro de téléphone français
export const isValidPhone = (phone) => {
  const regex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return regex.test(phone);
};

// Messages d'erreur
export const errorMessages = {
  required: 'Ce champ est requis',
  email: 'Email invalide',
  password: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre',
  passwordMatch: 'Les mots de passe ne correspondent pas',
  phone: 'Numéro de téléphone invalide',
  minLength: (min) => `Minimum ${min} caractères`,
  maxLength: (max) => `Maximum ${max} caractères`,
};