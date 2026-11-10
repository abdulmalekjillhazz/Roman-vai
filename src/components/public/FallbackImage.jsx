import React from 'react';

export function optimizedCloudinaryUrl(src, width) {
  if (!width || !/^https:\/\/res\.cloudinary\.com\//i.test(src || '')) return src;
  return src.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

export default function FallbackImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/assets/decorforall/flexible-stone-desert-gold-accent-wall-10.webp',
  cloudinaryWidth,
  decoding = 'async',
  loading = 'lazy',
  ...props
}) {
  const optimizedSrc = optimizedCloudinaryUrl(src, cloudinaryWidth);
  const [currentSrc, setCurrentSrc] = React.useState(optimizedSrc || fallbackSrc);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    setCurrentSrc(optimizedSrc || fallbackSrc);
  }, [optimizedSrc, fallbackSrc]);

  return (
    <img
      loading={loading}
      decoding={decoding}
      src={currentSrc}
      alt={alt}
      onLoad={(event) => {
        setIsLoaded(true);
        props.onLoad?.(event);
      }}
      className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-90'}`}
      onError={(event) => {
        if (event.currentTarget.dataset.fallbackApplied === 'true') return;
        event.currentTarget.dataset.fallbackApplied = 'true';
        event.currentTarget.src = fallbackSrc;
        setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
