import { useCallback, useEffect, useState } from 'react';

const defaultProfile = {
  legalName: '',
  displayName: 'Classical Decor ID',
  introduction: '',
  history: '',
  missionValues: '',
  contactPhone: '',
  whatsappNumber: '',
  contactEmail: '',
  officeAddress: '',
  showroomAddress: '',
  googleMapsUrl: '',
  serviceAreas: '',
  operatingHours: '',
  registrationDetails: '',
  logoUrl: '',
  photoUrls: '',
  certificateUrls: '',
  companyProfilePdfUrl: '',
  socials: {
    instagramUrl: '',
    facebookUrl: '',
    linkedinUrl: ''
  }
};

export default function useBusinessProfile(api, enabled) {
  const [profile, setProfile] = useState(defaultProfile);
  const [form, setForm] = useState(defaultProfile);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/business-profile');
      const data = res.data || {};
      const formatted = {
        legalName: data.legalName || '',
        displayName: data.displayName || 'Classical Decor ID',
        introduction: data.introduction || '',
        history: data.history || '',
        missionValues: data.missionValues || '',
        contactPhone: data.contactPhone || '',
        whatsappNumber: data.whatsappNumber || '',
        contactEmail: data.contactEmail || '',
        officeAddress: data.officeAddress || '',
        showroomAddress: data.showroomAddress || '',
        googleMapsUrl: data.googleMapsUrl || '',
        serviceAreas: Array.isArray(data.serviceAreas) ? data.serviceAreas.join('\n') : (data.serviceAreas || ''),
        operatingHours: data.operatingHours || '',
        registrationDetails: data.registrationDetails || '',
        logoUrl: data.logoUrl || '',
        photoUrls: Array.isArray(data.photoUrls) ? data.photoUrls.join('\n') : (data.photoUrls || ''),
        certificateUrls: Array.isArray(data.certificateUrls) ? data.certificateUrls.join('\n') : (data.certificateUrls || ''),
        companyProfilePdfUrl: data.companyProfilePdfUrl || '',
        socials: {
          instagramUrl: data.socials?.instagramUrl || '',
          facebookUrl: data.socials?.facebookUrl || '',
          linkedinUrl: data.socials?.linkedinUrl || ''
        }
      };
      setProfile(formatted);
      setForm(formatted);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load business profile.');
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    if (enabled) fetchProfile();
  }, [enabled, fetchProfile]);

  function handleFieldChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSocialChange(network, value) {
    setForm(prev => ({
      ...prev,
      socials: { ...prev.socials, [network]: value }
    }));
  }

  function handleFileChange(field, fileList) {
    setFiles(prev => ({ ...prev, [field]: fileList }));
  }

  async function saveProfile(e) {
    if (e?.preventDefault) e.preventDefault();
    setSaving(true);
    setMsg('');
    setError('');

    try {
      const fd = new FormData();
      const stringKeys = [
        'legalName', 'displayName', 'introduction', 'history', 'missionValues',
        'contactPhone', 'whatsappNumber', 'contactEmail', 'officeAddress',
        'showroomAddress', 'googleMapsUrl', 'serviceAreas', 'operatingHours',
        'registrationDetails', 'logoUrl', 'photoUrls', 'certificateUrls', 'companyProfilePdfUrl'
      ];

      for (const k of stringKeys) {
        if (form[k] !== undefined) fd.append(k, form[k]);
      }

      fd.append('socials', JSON.stringify(form.socials || {}));

      if (files.logo?.[0]) {
        fd.append('logo', files.logo[0]);
      }
      if (files.companyProfilePdf?.[0]) {
        fd.append('companyProfilePdf', files.companyProfilePdf[0]);
      }
      if (files.photos && files.photos.length > 0) {
        for (let i = 0; i < files.photos.length; i++) {
          fd.append('photos', files.photos[i]);
        }
      }
      if (files.certificates && files.certificates.length > 0) {
        for (let i = 0; i < files.certificates.length; i++) {
          fd.append('certificates', files.certificates[i]);
        }
      }

      await api.put('/business-profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMsg('Business profile saved successfully.');
      setFiles({});
      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save business profile.');
    } finally {
      setSaving(false);
    }
  }

  return {
    profile,
    form,
    files,
    loading,
    saving,
    msg,
    error,
    handleFieldChange,
    handleSocialChange,
    handleFileChange,
    saveProfile,
    fetchProfile
  };
}
