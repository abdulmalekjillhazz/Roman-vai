import { useCallback, useEffect, useState } from 'react';

export default function useHeroImages(api, enabled) {
  const [heroImages, setHeroImages] = useState({});
  const [heroContent, setHeroContent] = useState({});
  const [heroSavingKey, setHeroSavingKey] = useState('');
  const [heroMessage, setHeroMessage] = useState('');
  const [heroError, setHeroError] = useState('');
  const [editingSlideKey, setEditingSlideKey] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    eyebrow: '',
    description: '',
    specs: '',
    actionText: ''
  });

  const fetchHeroImages = useCallback(async () => {
    try {
      const response = await api.get(`/hero-slides`);
      setHeroImages(response.data.slides || {});
      setHeroContent(response.data.content || {});
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
      setHeroContent(current => ({
        ...current,
        [slide.file]: {
          ...(current[slide.file] || {}),
          imageUrl: response.data.imageUrl
        }
      }));
      setHeroMessage(`${slide.title} image updated. The new image is now live.`);
      if (response.data.cleanupWarning) setHeroMessage(current => `${current} ${response.data.cleanupWarning}`);
    } catch (err) {
      setHeroError(err.response?.data?.message || 'Could not update this hero image. Please try again.');
    } finally {
      setHeroSavingKey('');
    }
  }

  async function updateHeroText(slideKey, textFields) {
    setHeroSavingKey(slideKey);
    setHeroError('');
    setHeroMessage('');

    try {
      const response = await api.post(
        `/hero-slides/${encodeURIComponent(slideKey)}`,
        textFields
      );
      const updated = response.data;
      setHeroContent(current => ({
        ...current,
        [slideKey]: {
          ...(current[slideKey] || {}),
          title: updated.title,
          eyebrow: updated.eyebrow,
          description: updated.description,
          specs: updated.specs,
          actionText: updated.actionText,
          imageUrl: updated.imageUrl || current[slideKey]?.imageUrl || ''
        }
      }));
      setHeroMessage('Slide texts updated successfully! The changes are now live.');
      return { success: true, data: updated };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Could not update slide texts. Please try again.';
      setHeroError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setHeroSavingKey('');
    }
  }

  return {
    heroImages,
    heroContent,
    heroSavingKey,
    heroMessage,
    heroError,
    handleHeroImageSelection,
    updateHeroText,
    fetchHeroImages,
    editingSlideKey,
    setEditingSlideKey,
    editFormData,
    setEditFormData
  };
}
