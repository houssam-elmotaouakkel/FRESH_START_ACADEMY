import { Link } from 'react-router-dom';
import { cn } from '../../utils/helpers';

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2';

const PrimaryButton = ({ to, className, children, type = 'button', ...props }) => {
  const classes = cn(
    baseClass,
    'bg-primary-600 hover:bg-primary-700 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none',
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;
