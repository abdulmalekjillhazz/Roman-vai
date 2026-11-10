import { useCallback, useEffect, useState } from 'react';

const emptyProjectForm = {
  title: '',
  slug: '',
  description: '',
  category: '',
  relatedServiceId: '',
  materialsSupplied: '',
  locationArea: '',
  completionDate: '',
  coverImage: '',
  galleryUrls: '',
  seoTitle: '',
  seoDescription: '',
  isPublished: false,
  isFeatured: false,
  hasClientConsent: false,
  order: 0
};

export default function useProjects(api, enabled) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [form, setForm] = useState(emptyProjectForm);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects?all=true');
      setProjects(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load portfolio projects.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (enabled) fetchProjects();
  }, [enabled, fetchProjects]);

  function resetForm() {
    setSelectedProjectId('');
    setForm(emptyProjectForm);
    setUploadFiles([]);
    setMsg('');
    setError('');
  }

  function handleFieldChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function editProject(project) {
    setSelectedProjectId(project._id || project.id);
    const compDateStr = project.completionDate
      ? new Date(project.completionDate).toISOString().split('T')[0]
      : '';

    setForm({
      title: project.title || '',
      slug: project.slug || '',
      description: project.description || '',
      category: project.category || '',
      relatedServiceId: project.relatedServiceId || '',
      materialsSupplied: Array.isArray(project.materialsSupplied) ? project.materialsSupplied.join('\n') : '',
      locationArea: project.locationArea || '',
      completionDate: compDateStr,
      coverImage: project.coverImage || '',
      galleryUrls: Array.isArray(project.gallery) ? project.gallery.join('\n') : '',
      seoTitle: project.seoTitle || '',
      seoDescription: project.seoDescription || '',
      isPublished: Boolean(project.isPublished),
      isFeatured: Boolean(project.isFeatured),
      hasClientConsent: Boolean(project.hasClientConsent),
      order: project.order ?? 0
    });
    setUploadFiles([]);
    setMsg('');
    setError('');
  }

  async function togglePublish(project) {
    const id = project._id || project.id;
    try {
      await api.put(`/projects/${id}`, { isPublished: !project.isPublished });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle project publish status.');
    }
  }

  async function deleteProject(id) {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      if (selectedProjectId === id) resetForm();
      fetchProjects();
      setMsg('Project deleted successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project.');
    }
  }

  async function submitProject(e) {
    if (e?.preventDefault) e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    if (!form.title.trim()) {
      setError('Project title is required.');
      setSaving(false);
      return;
    }
    if (!form.description.trim()) {
      setError('Project description is required.');
      setSaving(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      if (form.slug.trim()) fd.append('slug', form.slug.trim());
      fd.append('description', form.description.trim());
      if (form.category) fd.append('category', form.category.trim());
      if (form.relatedServiceId) fd.append('relatedServiceId', form.relatedServiceId);
      if (form.materialsSupplied) fd.append('materialsSupplied', form.materialsSupplied);
      if (form.locationArea) fd.append('locationArea', form.locationArea.trim());
      if (form.completionDate) fd.append('completionDate', form.completionDate);
      if (form.coverImage) fd.append('coverImage', form.coverImage.trim());
      if (form.galleryUrls) fd.append('galleryUrls', form.galleryUrls);
      if (form.seoTitle) fd.append('seoTitle', form.seoTitle.trim());
      if (form.seoDescription) fd.append('seoDescription', form.seoDescription.trim());
      fd.append('isPublished', String(form.isPublished));
      fd.append('isFeatured', String(form.isFeatured));
      fd.append('hasClientConsent', String(form.hasClientConsent));
      fd.append('order', String(form.order || 0));

      if (uploadFiles && uploadFiles.length > 0) {
        for (let i = 0; i < uploadFiles.length; i++) {
          fd.append('images', uploadFiles[i]);
        }
      }

      if (selectedProjectId) {
        await api.put(`/projects/${selectedProjectId}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMsg('Project updated successfully.');
      } else {
        await api.post('/projects', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMsg('Project created successfully.');
      }

      resetForm();
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  }

  return {
    projects,
    loading,
    saving,
    selectedProjectId,
    form,
    uploadFiles,
    setUploadFiles,
    msg,
    error,
    resetForm,
    handleFieldChange,
    editProject,
    togglePublish,
    deleteProject,
    submitProject,
    fetchProjects
  };
}
