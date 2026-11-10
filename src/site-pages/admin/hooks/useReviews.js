import { useCallback, useEffect, useState } from 'react';

export default function useReviews(api, enabled) {
  const [reviews, setReviews] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const url = statusFilter && statusFilter !== 'all'
        ? `/reviews?all=true&status=${statusFilter}`
        : `/reviews?all=true`;
      const res = await api.get(url);
      setReviews(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load customer reviews.');
    } finally {
      setLoading(false);
    }
  }, [api, statusFilter]);

  useEffect(() => {
    if (enabled) fetchReviews();
  }, [enabled, fetchReviews]);

  async function updateStatus(id, newStatus, adminResponse = undefined, moderationNotes = undefined) {
    try {
      const payload = { status: newStatus };
      if (adminResponse !== undefined) payload.adminResponse = adminResponse;
      if (moderationNotes !== undefined) payload.moderationNotes = moderationNotes;

      await api.put(`/reviews/${id}`, payload);
      setMsg(`Review status updated to ${newStatus}.`);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update review status.');
    }
  }

  async function deleteReview(id) {
    if (!window.confirm('Are you sure you want to delete this review? For legitimate feedback, consider Archiving instead.')) {
      return;
    }
    try {
      await api.delete(`/reviews/${id}`);
      setMsg('Review deleted.');
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review.');
    }
  }

  return {
    reviews,
    statusFilter,
    setStatusFilter,
    loading,
    msg,
    error,
    updateStatus,
    deleteReview,
    fetchReviews
  };
}
