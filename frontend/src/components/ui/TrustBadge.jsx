import { cn } from '../../utils/helpers';

const TrustBadge = ({ icon: Icon, label, value, className }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-secondary-200 bg-white px-4 py-3 shadow-sm',
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
        {Icon ? <Icon className="h-5 w-5" /> : null}
      </div>
      <div>
        {value ? <p className="text-sm font-semibold text-gray-900">{value}</p> : null}
        <p className="text-xs text-gray-600">{label}</p>
      </div>
    </div>
  );
};

export default TrustBadge;
