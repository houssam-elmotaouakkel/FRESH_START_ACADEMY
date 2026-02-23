const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';

const buildCanonical = (path) => `${SITE_URL}${path}`;

export const getSeoForPath = (pathname) => {
  if (pathname === '/') {
    return {
      title: 'Fresh Start Academy | Cours de langues et communication',
      description:
        'Inscrivez-vous rapidement a des cours de langues adaptes a votre niveau.',
      canonical: buildCanonical('/'),
    };
  }

  if (pathname === '/courses') {
    return {
      title: 'Catalogue des cours | Fresh Start Academy',
      description:
        'Explorez nos cours de langues avec niveaux, prix et prochaines sessions.',
      canonical: buildCanonical('/courses'),
    };
  }

  if (pathname.startsWith('/courses/')) {
    return {
      title: 'Detail du cours | Fresh Start Academy',
      description:
        'Consultez le detail du cours et inscrivez-vous en quelques clics.',
      canonical: buildCanonical(pathname),
    };
  }

  if (pathname === '/contact') {
    return {
      title: 'Contact et inscription | Fresh Start Academy',
      description:
        'Parlez a un conseiller pour choisir la formation adaptee a vos objectifs.',
      canonical: buildCanonical('/contact'),
    };
  }

  if (pathname === '/register') {
    return {
      title: 'Creer un compte | Fresh Start Academy',
      description:
        'Inscription rapide pour acceder a vos cours et suivre votre progression.',
      canonical: buildCanonical('/register'),
    };
  }

  if (pathname === '/login') {
    return {
      title: 'Connexion | Fresh Start Academy',
      description: 'Connectez-vous pour gerer vos inscriptions et votre progression.',
      canonical: buildCanonical('/login'),
    };
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
    return {
      title: 'Espace prive | Fresh Start Academy',
      description: 'Espace utilisateur et administration Fresh Start Academy.',
      canonical: buildCanonical(pathname),
      robots: 'noindex,nofollow',
    };
  }

  return {
    title: 'Fresh Start Academy',
    description:
      'Centre de langues et communication pour etudiants et adultes.',
    canonical: buildCanonical(pathname || '/'),
  };
};

export { SITE_URL };
