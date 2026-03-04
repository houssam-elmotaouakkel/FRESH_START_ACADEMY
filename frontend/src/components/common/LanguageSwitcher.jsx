import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';
import { LANGUAGES } from '../../i18n';

function LanguageSwitcher({ variant = 'desktop' }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-2 pt-2 border-t border-secondary-200/70 mt-2">
        <FiGlobe className="text-secondary-600 flex-shrink-0" />
        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                lang.code === current.code
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-secondary-700 hover:bg-secondary-100'
              }`}
            >
              {lang.flag} {lang.code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-secondary-800 hover:bg-secondary-100/70 transition-colors"
        aria-label={`${current.label} — Change language`}
        aria-expanded={open}
      >
        <FiGlobe className="w-4 h-4" />
        <span>{current.flag} {current.code.toUpperCase()}</span>
        <FiChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute end-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-secondary-200/80 py-1 z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-start px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                lang.code === current.code
                  ? 'bg-primary-50 text-primary-900 font-semibold'
                  : 'text-secondary-800 hover:bg-secondary-50'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSwitcher;
