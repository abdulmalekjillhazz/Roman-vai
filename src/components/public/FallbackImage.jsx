import React from 'react';

function optimizedCloudinaryUrl(src, width) {
  if (!width || !/^https:\/\/res\.cloudinary\.com\//i.test(src || '')) return src;
  return src.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

export default function FallbackImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp',
  cloudinaryWidth,
  ...props
}) {
  const optimizedSrc = optimizedCloudinaryUrl(src, cloudinaryWidth);
  const [currentSrc, setCurrentSrc] = React.useState(optimizedSrc || fallbackSrc);

  React.useEffect(() => {
    setCurrentSrc(optimizedSrc || fallbackSrc);
  }, [optimizedSrc, fallbackSrc]);

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
