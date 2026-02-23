import { useEffect } from 'react';

const DEFAULT_TITLE = 'Fresh Start Academy | Cours de langues et communication';
const DEFAULT_DESCRIPTION =
  'Centre de langues pour adultes et etudiants: cours, accompagnement et inscriptions en ligne.';

const ensureMeta = (attribute, value) => {
  const selector = `meta[${attribute}="${value}"]`;
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }

  return tag;
};

const ensureCanonical = () => {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  return link;
};

const useSeo = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonical,
  robots = 'index,follow',
  image,
}) => {
  useEffect(() => {
    document.title = title;

    ensureMeta('name', 'description').setAttribute('content', description);
    ensureMeta('name', 'robots').setAttribute('content', robots);
    ensureMeta('property', 'og:title').setAttribute('content', title);
    ensureMeta('property', 'og:description').setAttribute('content', description);
    ensureMeta('property', 'og:type').setAttribute('content', 'website');

    if (image) {
      ensureMeta('property', 'og:image').setAttribute('content', image);
    }

    if (canonical) {
      ensureCanonical().setAttribute('href', canonical);
    }
  }, [title, description, canonical, robots, image]);
};

export default useSeo;
