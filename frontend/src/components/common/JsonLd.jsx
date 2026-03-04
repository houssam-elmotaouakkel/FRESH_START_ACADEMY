/**
 * JSON-LD Structured Data Component
 * Generates Schema.org markup for SEO
 */

function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization schema for the academy
 */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Fresh Start Academy',
    url: 'https://freshstartacademy.ma',
    logo: 'https://freshstartacademy.ma/logo.png',
    description:
      'Centre de langues et communication à Rabat. Cours de français, anglais, arabe, espagnol et allemand.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rabat',
      addressCountry: 'MA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['French', 'Arabic', 'English'],
    },
    sameAs: [
      'https://www.facebook.com/freshstartacademy',
      'https://www.instagram.com/freshstartacademy',
    ],
  };

  return <JsonLd data={data} />;
}

/**
 * Course schema for a specific course
 */
export function CourseJsonLd({ course }) {
  if (!course) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Fresh Start Academy',
      url: 'https://freshstartacademy.ma',
    },
    courseMode: course.isOnline ? 'Online' : 'Onsite',
    educationalLevel: course.level,
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'MAD',
      availability: course.isActive
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
    },
    ...(course.startDate && { startDate: course.startDate }),
    ...(course.endDate && { endDate: course.endDate }),
    ...(course.duration && {
      timeRequired: `PT${course.duration}H`,
    }),
  };

  return <JsonLd data={data} />;
}

/**
 * BreadcrumbList schema
 */
export function BreadcrumbJsonLd({ items }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

export default JsonLd;
