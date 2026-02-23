import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiUsers } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';
import { COURSE_LEVELS } from '../../utils/constants';

const PricingCard = ({ course, onClick }) => {
  const enrolledCount = course?._count?.enrollments || 0;
  const seatsLeft =
    typeof course?.maxStudents === 'number'
      ? Math.max(0, course.maxStudents - enrolledCount)
      : null;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-secondary-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600">
          {COURSE_LEVELS[course.level] || course.level}
        </p>
        <h3 className="mt-2 text-xl font-bold text-gray-900">{course.title}</h3>
      </div>

      <p className="mb-6 line-clamp-3 text-sm text-gray-600">{course.description}</p>

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="inline-flex items-center gap-1">
            <FiClock className="h-4 w-4" />
            {course.duration}h
          </span>
          <span className="text-lg font-bold text-primary-700">{formatPrice(course.price)}</span>
        </div>

        <div className="text-xs text-gray-500">
          {seatsLeft !== null ? (
            <span className="inline-flex items-center gap-1">
              <FiUsers className="h-4 w-4" />
              {seatsLeft} place(s) restante(s)
            </span>
          ) : (
            'Places flexibles'
          )}
        </div>

        <Link
          to={`/courses/${course.id}`}
          onClick={onClick}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          Voir le detail
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
};

export default PricingCard;
