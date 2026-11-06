import { useCallback, useEffect, useState } from 'react';
import { emptyCategoryForm } from '../formDefaults.js';

export default function useCategories(api, enabled) {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [categoryMsg, setCategoryMsg] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get(`/categories`);
      setCategories(res.data);
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Could not load categories. Please refresh.');
    }
  }, [api]);

  useEffect(() => {
    if (enabled) fetchCategories();
  }, [enabled, fetchCategories]);

  function resetCategoryForm() {
    setSelectedCategoryId('');
    setCategoryForm(emptyCategoryForm);
    setCategoryMsg('');
    setCategoryError('');
  }

  function handleCategoryFieldChange(field, value) {
    setCategoryForm(prev => ({ ...prev, [field]: value }));
  }

  async function submitCategory(e) {
    e.preventDefault();
    setCategoryMsg('');
    setCategoryError('');

    if (!categoryForm.name.trim()) {
      setCategoryError('Category name is required.');
      return;
    }

    const payload = {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim() || categoryForm.name.trim(),
      description: categoryForm.description.trim()
    };

    try {
      if (selectedCategoryId) {
        await api.put(`/categories/${selectedCategoryId}`, payload);
        setCategoryMsg('Category updated successfully.');
      } else {
        await api.post(`/categories`, payload);
        setCategoryMsg('Category created successfully.');
      }

      setCategoryForm(emptyCategoryForm);
      setSelectedCategoryId('');
      fetchCategories();
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Failed to save category.');
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      if (selectedCategoryId === id) resetCategoryForm();
      fetchCategories();
    } catch (err) {
      setCategoryError(err.response?.data?.message || 'Delete failed.');
    }
  }

  function editCategory(category) {
    setSelectedCategoryId(category._id || category.slug);
    setCategoryForm({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || ''
    });
  }

  return {
    categories, selectedCategoryId, categoryForm, categoryMsg, categoryError,
    resetCategoryForm, handleCategoryFieldChange,
    submitCategory, deleteCategory, editCategory
  };
}
