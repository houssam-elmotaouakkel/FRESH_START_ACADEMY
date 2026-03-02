import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMoon, FiArrowRight } from 'react-icons/fi';
import { isRamadanPeriod } from '../../lib/hijriCalendar';

function RamadanBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkRamadan = async () => {
      try {
        const visible = await isRamadanPeriod();
        if (isMounted) {
          setIsVisible(visible);
        }
      } catch (error) {
        console.warn('Ramadan banner check failed:', error);
        if (isMounted) {
          setIsVisible(false);
        }
      }
    };

    checkRamadan();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-primary-900 text-secondary-100 border-b border-primary-700">
      <div className="content-wrap px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm font-medium flex items-center gap-2">
          <FiMoon />
          Ramadan Kareem - Programmes adaptes pour vos horaires.
        </p>
        <Link to="/contact" className="text-sm font-semibold inline-flex items-center gap-2 hover:text-white">
          Demander les horaires
          <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}

export default RamadanBanner;
