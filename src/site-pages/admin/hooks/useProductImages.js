import { useEffect, useState } from 'react';

export default function useProductImages({ productForm, handleProductFieldChange, setProductMsg, setProductError }) {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadPreviews, setUploadPreviews] = useState([]);
  const existingImageUrls = (productForm.imageUrls || '').split(/\r?\n/).map(url => url.trim()).filter(Boolean);

  useEffect(() => {
    const previews = uploadFiles.map(file => ({ file, url: URL.createObjectURL(file) }));
    setUploadPreviews(previews);
    return () => previews.forEach(preview => URL.revokeObjectURL(preview.url));
  }, [uploadFiles]);

  function setAsThumbnail(url) {
    if (!url) return;
    const remaining = existingImageUrls.filter(u => u !== url);
    const reordered = [url, ...remaining];
    handleProductFieldChange('imageUrls', reordered.join('\n'));
    handleProductFieldChange('thumbnail', url);
    setProductMsg('Selected image is now set as the #1 Primary Thumbnail! Click "Update Product" to save.');
  }

  function removeExistingImage(urlToRemove) {
    const remainingUrls = (productForm.imageUrls || '')
      .split(/\r?\n/)
      .map(url => url.trim())
      .filter(url => url && url !== urlToRemove);
    handleProductFieldChange('imageUrls', remainingUrls.join('\n'));
    if (productForm.thumbnail === urlToRemove) {
      handleProductFieldChange('thumbnail', remainingUrls[0] || '');
    }
  }

  function removeUploadFile(fileToRemove) {
    setUploadFiles(files => files.filter(file => file !== fileToRemove));
  }

  function moveExistingImage(index, direction) {
    const urls = [...existingImageUrls];
    const target = index + direction;
    if (target < 0 || target >= urls.length) return;
    const temp = urls[index];
    urls[index] = urls[target];
    urls[target] = temp;
    handleProductFieldChange('imageUrls', urls.join('\n'));
    handleProductFieldChange('thumbnail', urls[0]);
  }

  function moveUpload(index, direction) {
    setUploadFiles(files => {
      const next = [...files];
      const target = index + direction;
      if (target < 0 || target >= next.length) return files;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function selectUploadFiles(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (uploadFiles.length + files.length > 12) {
      setProductError('Select a maximum of 12 new images per save. Remove a selected image to add another.');
      return;
    }
    if (files.some(file => file.size > 8 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))) {
      setProductError('Use JPG, PNG or WebP images, each 8 MB or smaller.');
      return;
    }
    setProductError('');
    setUploadFiles(current => [...current, ...files]);
  }

  return {
    uploadFiles, setUploadFiles, uploadPreviews, existingImageUrls,
    setAsThumbnail, removeExistingImage, removeUploadFile,
    moveExistingImage, moveUpload, selectUploadFiles
  };
}
