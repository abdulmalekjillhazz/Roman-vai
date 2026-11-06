import React from 'react';

export default function FallbackImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp',
  ...props
}) {
  const [currentSrc, setCurrentSrc] = React.useState(src || fallbackSrc);

  React.useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={(event) => {
        if (event.currentTarget.dataset.fallbackApplied === 'true') return;
        event.currentTarget.dataset.fallbackApplied = 'true';
        event.currentTarget.src = fallbackSrc;
        setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
