const SectionHeader = ({ eyebrow, title, description, align = 'center', tone = 'dark' }) => {
  const alignment = align === 'left' ? 'text-left' : 'text-center';
  const titleColor = tone === 'light' ? 'text-white' : 'text-gray-900';
  const descriptionColor = tone === 'light' ? 'text-white/80' : 'text-gray-600';
  const eyebrowColor = tone === 'light' ? 'text-white/80' : 'text-primary-600';

  return (
    <div className={`${alignment} max-w-3xl ${align === 'left' ? '' : 'mx-auto'} mb-10`}>
      {eyebrow ? (
        <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowColor}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`text-3xl font-extrabold md:text-4xl ${titleColor}`}>{title}</h2>
      {description ? <p className={`mt-4 text-base md:text-lg ${descriptionColor}`}>{description}</p> : null}
    </div>
  );
};

export default SectionHeader;
