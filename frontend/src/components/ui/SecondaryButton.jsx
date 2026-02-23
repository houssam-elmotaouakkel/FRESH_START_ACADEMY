import { Link } from 'react-router-dom';
import { cn } from '../../utils/helpers';

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2';

const SecondaryButton = ({ to, className, children, type = 'button', ...props }) => {
  const classes = cn(
    baseClass,
    'border border-primary-300 bg-white text-primary-700 hover:bg-primary-50',
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

export default SecondaryButton;
