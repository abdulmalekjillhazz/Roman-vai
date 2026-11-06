import { useCallback, useEffect, useState } from 'react';

export default function useHeroImages(api, enabled) {
  const [heroImages, setHeroImages] = useState({});
  const [heroSavingKey, setHeroSavingKey] = useState('');
  const [heroMessage, setHeroMessage] = useState('');
  const [heroError, setHeroError] = useState('');

  const fetchHeroImages = useCallback(async () => {
    try {
      const response = await api.get(`/hero-slides`);
      setHeroImages(response.data.slides || {});
      setHeroError('');
    } catch (err) {
      setHeroError(err.response?.data?.message || 'Could not load saved hero images. Please refresh.');
    }
  }, [api]);

  useEffect(() => {
    if (enabled) fetchHeroImages();
  }, [enabled, fetchHeroImages]);

  async function handleHeroImageSelection(slide, event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setHeroError('Choose a JPG, PNG or WebP image.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setHeroError('Hero images must be 8 MB or smaller.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    setHeroSavingKey(slide.file);
    setHeroError('');
    setHeroMessage('');

    try {
      const response = await api.post(
        `/hero-slides/${encodeURIComponent(slide.file)}`,
        formData
      );
      setHeroImages(current => ({ ...current, [slide.file]: response.data.imageUrl }));
      setHeroMessage(`${slide.title} image updated. The new image is now live.`);
      if (response.data.cleanupWarning) setHeroMessage(current => `${current} ${response.data.cleanupWarning}`);
    } catch (err) {
      setHeroError(err.response?.data?.message || 'Could not update this hero image. Please try again.');
    } finally {
      setHeroSavingKey('');
    }
  }

  return { heroImages, heroSavingKey, heroMessage, heroError, handleHeroImageSelection };
}
