const { getDbClient } = require('../config/database');

const prisma = getDbClient();

const getLandingContent = async () => {
  const [featuredCourses, approvedTestimonials, studentsCount, coursesCount, enrollmentsCount] =
    await Promise.all([
      prisma.course.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          category: true,
          level: true,
          price: true,
          duration: true,
          maxStudents: true,
          startDate: true,
          _count: {
            select: {
              enrollments: true,
            },
          },
        },
      }),
      prisma.testimonial.findMany({
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          author: true,
          role: true,
          content: true,
          rating: true,
          avatar: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where: { role: 'STUDENT', isActive: true } }),
      prisma.course.count({ where: { isActive: true } }),
      prisma.enrollment.count({
        where: {
          status: {
            in: ['CONFIRMED', 'COMPLETED'],
          },
        },
      }),
    ]);

  return {
    hero: {
      headline: 'Apprenez une langue utile pour vos etudes et votre carriere',
      subheadline:
        'Programmes pratiques, enseignants experimentes et accompagnement personnalise.',
      primaryCta: {
        label: 'Voir les cours',
        href: '/courses',
        ctaId: 'hero_view_courses',
      },
      secondaryCta: {
        label: 'Parler a un conseiller',
        href: '/contact',
        ctaId: 'hero_contact_advisor',
      },
    },
    featuredCourses,
    approvedTestimonials,
    stats: {
      students: studentsCount,
      activeCourses: coursesCount,
      confirmedEnrollments: enrollmentsCount,
      satisfactionRate: 98,
    },
    faq: [
      {
        question: 'Comment choisir mon niveau ?',
        answer:
          'Un mini entretien avec notre equipe permet de vous orienter vers le bon niveau.',
      },
      {
        question: 'Puis-je commencer rapidement ?',
        answer:
          'Oui. Nous ouvrons des sessions regulieres et proposons des options en ligne.',
      },
      {
        question: 'Quels formats sont disponibles ?',
        answer:
          'Cours individuels, petits groupes et programmes intensifs selon vos objectifs.',
      },
    ],
  };
};

module.exports = {
  getLandingContent,
};
