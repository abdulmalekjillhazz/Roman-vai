import { useCallback, useEffect, useState } from 'react';

const emptyServiceForm = {
  title: '',
  slug: '',
  description: '',
  highlights: '',
  serviceAreas: '',
  seoTitle: '',
  seoDescription: '',
  isPublished: false,
  isFeatured: false,
  order: 0,
  imageUrls: '',
  faqs: []
};

export default function useServices(api, enabled) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [form, setForm] = useState(emptyServiceForm);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/services?all=true');
      setServices(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load services.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (enabled) fetchServices();
  }, [enabled, fetchServices]);

  function resetForm() {
    setSelectedServiceId('');
    setForm(emptyServiceForm);
    setUploadFiles([]);
    setMsg('');
    setError('');
  }

  function handleFieldChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function editService(service) {
    setSelectedServiceId(service._id || service.id);
    setForm({
      title: service.title || '',
      slug: service.slug || '',
      description: service.description || '',
      highlights: Array.isArray(service.highlights) ? service.highlights.join('\n') : '',
      serviceAreas: Array.isArray(service.serviceAreas) ? service.serviceAreas.join('\n') : '',
      seoTitle: service.seoTitle || '',
      seoDescription: service.seoDescription || '',
      isPublished: Boolean(service.isPublished),
      isFeatured: Boolean(service.isFeatured),
      order: service.order ?? 0,
      imageUrls: Array.isArray(service.images) ? service.images.join('\n') : '',
      faqs: Array.isArray(service.faqs) ? service.faqs : []
    });
    setUploadFiles([]);
    setMsg('');
    setError('');
  }

  async function togglePublish(service) {
    const id = service._id || service.id;
    try {
      await api.put(`/services/${id}`, { isPublished: !service.isPublished });
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle publication status.');
    }
  }

  async function deleteService(id) {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      if (selectedServiceId === id) resetForm();
      fetchServices();
      setMsg('Service deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete service.');
    }
  }

  async function submitService(e) {
    if (e?.preventDefault) e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    if (!form.title.trim()) {
      setError('Service title is required.');
      setSaving(false);
      return;
    }
    if (!form.description.trim()) {
      setError('Service description is required.');
      setSaving(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      if (form.slug.trim()) fd.append('slug', form.slug.trim());
      fd.append('description', form.description.trim());
      if (form.highlights) fd.append('highlights', form.highlights);
      if (form.serviceAreas) fd.append('serviceAreas', form.serviceAreas);
      if (form.seoTitle) fd.append('seoTitle', form.seoTitle.trim());
      if (form.seoDescription) fd.append('seoDescription', form.seoDescription.trim());
      fd.append('isPublished', String(form.isPublished));
      fd.append('isFeatured', String(form.isFeatured));
      fd.append('order', String(form.order || 0));
      if (form.imageUrls) fd.append('imageUrls', form.imageUrls);
      if (form.faqs && form.faqs.length > 0) {
        fd.append('faqs', JSON.stringify(form.faqs));
      }

      if (uploadFiles && uploadFiles.length > 0) {
        for (let i = 0; i < uploadFiles.length; i++) {
          fd.append('images', uploadFiles[i]);
        }
      }

      if (selectedServiceId) {
        await api.put(`/services/${selectedServiceId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMsg('Service updated successfully.');
      } else {
        await api.post('/services', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMsg('Service created successfully.');
      }

      resetForm();
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  }

  return {
    services,
    loading,
    saving,
    selectedServiceId,
    form,
    uploadFiles,
    setUploadFiles,
    msg,
    error,
    resetForm,
    handleFieldChange,
    editService,
    togglePublish,
    deleteService,
    submitService,
    fetchServices
  };
}
