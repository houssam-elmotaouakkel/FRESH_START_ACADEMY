import useSeo from '../../hooks/useSeo';

const SITE_NAME = 'Fresh Start Academy';
const DEFAULT_DESCRIPTION =
  'Centre de langues et communication à Salé. Cours de français, anglais, arabe, espagnol et allemand.';

/**
 * SEO component for per-page meta tags.
 * Uses the existing useSeo hook for DOM-based meta tag management.
 * @param {{ title?: string, description?: string, path?: string }} props
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '',
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = path ? `${window.location.origin}${path}` : undefined;

  useSeo({
    title: fullTitle,
    description,
    canonical,
  });

  return null;
}
