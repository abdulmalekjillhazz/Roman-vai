import { useCallback, useEffect, useState } from 'react';
import { emptyFaqForm } from '../formDefaults.js';

export default function useFAQs(api, enabled) {
  const [faqs, setFaqs] = useState([]);
  const [selectedFaqId, setSelectedFaqId] = useState('');
  const [faqForm, setFaqForm] = useState(emptyFaqForm);
  const [faqMsg, setFaqMsg] = useState('');
  const [faqError, setFaqError] = useState('');

  const fetchFAQs = useCallback(async () => {
    try {
      const res = await api.get(`/faqs?all=true`);
      setFaqs(Array.isArray(res.data) ? res.data : []);
      setFaqError('');
    } catch (err) {
      setFaqError(err.response?.data?.message || 'Could not load FAQs. Please refresh.');
    }
  }, [api]);

  useEffect(() => {
    if (enabled) fetchFAQs();
  }, [enabled, fetchFAQs]);

  function resetFaqForm() {
    setSelectedFaqId('');
    setFaqForm(emptyFaqForm);
    setFaqMsg('');
    setFaqError('');
  }

  function handleFaqFieldChange(field, value) {
    setFaqForm(prev => ({ ...prev, [field]: value }));
  }

  async function submitFAQ(e) {
    e.preventDefault();
    setFaqMsg('');
    setFaqError('');

    if (!faqForm.question.trim()) {
      setFaqError('Question is required.');
      return;
    }
    if (!faqForm.answer.trim()) {
      setFaqError('Answer is required.');
      return;
    }

    const payload = {
      question: faqForm.question.trim(),
      answer: faqForm.answer.trim(),
      order: Number(faqForm.order) || 0,
      isActive: Boolean(faqForm.isActive)
    };

    try {
      if (selectedFaqId) {
        await api.put(`/faqs/${selectedFaqId}`, payload);
        setFaqMsg('FAQ updated successfully.');
      } else {
        await api.post(`/faqs`, payload);
        setFaqMsg('FAQ created successfully.');
      }

      setFaqForm(emptyFaqForm);
      setSelectedFaqId('');
      fetchFAQs();
    } catch (err) {
      setFaqError(err.response?.data?.message || 'Failed to save FAQ.');
    }
  }

  async function deleteFAQ(id) {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await api.delete(`/faqs/${id}`);
      if (selectedFaqId === id) resetFaqForm();
      fetchFAQs();
    } catch (err) {
      setFaqError(err.response?.data?.message || 'Delete failed.');
    }
  }

  function editFAQ(faq) {
    setSelectedFaqId(faq._id || faq.id);
    setFaqForm({
      question: faq.question || '',
      answer: faq.answer || '',
      order: faq.order ?? 0,
      isActive: faq.isActive ?? true
    });
  }

  async function moveFAQ(index, direction) {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const reordered = [...faqs];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const items = reordered.map((item, idx) => ({
      id: item._id || item.id,
      order: idx + 1
    }));

    setFaqs(reordered.map((item, idx) => ({ ...item, order: idx + 1 })));

    try {
      const response = await api.put('/faqs/reorder', { items });
      if (Array.isArray(response.data)) setFaqs(response.data);
      setFaqMsg('FAQ order updated.');
    } catch (err) {
      setFaqError(err.response?.data?.message || 'Failed to update order.');
      fetchFAQs();
    }
  }

  return {
    faqs,
    selectedFaqId,
    faqForm,
    faqMsg,
    faqError,
    resetFaqForm,
    handleFaqFieldChange,
    submitFAQ,
    deleteFAQ,
    editFAQ,
    moveFAQ,
    fetchFAQs
  };
}
