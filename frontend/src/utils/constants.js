// URL de l'API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Rôles
export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
};

// Catégories de cours
export const COURSE_CATEGORIES = {
  LANGUAGES: 'Langues',
  SUPPORT: 'Soutien scolaire',
  TRAINING: 'Formation professionnelle',
  SOFT_SKILLS: 'Compétences transversales',
};

// Niveaux de cours
export const COURSE_LEVELS = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
};

// Statuts d'inscription
export const ENROLLMENT_STATUS = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmé',
  CANCELLED: 'Annulé',
  COMPLETED: 'Terminé',
};

// Statuts de contact
export const CONTACT_STATUS = {
  UNREAD: 'Non lu',
  READ: 'Lu',
  REPLIED: 'Répondu',
  ARCHIVED: 'Archivé',
};

// Couleurs des statuts
export const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  UNREAD: 'bg-red-100 text-red-800',
  READ: 'bg-gray-100 text-gray-800',
  REPLIED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-500',
};