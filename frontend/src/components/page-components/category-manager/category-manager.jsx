import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '../../../atoms';
import { apiClient } from '../../../utils/api-client';
import { CurrentUserFlag } from '../../reusable-components/current-user-flag/current-user-flag';
import styles from './category-manager.module.css';

export const CategoryManager = () => {
  const currentUser = useAtomValue(currentUserAtom);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [householdInfo, setHouseholdInfo] = useState(null);
  const [isHouseholdOwner, setIsHouseholdOwner] = useState(true);

  // New category form
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    categoryType: 'outflow'
  });

  // New sub-category form
  const [newSubCategory, setNewSubCategory] = useState({
    subCatName: '',
    parentCatID: ''
  });

  // Fetch household info and categories on mount
  useEffect(() => {
    if (currentUser) {
      fetchHouseholdInfo();
      fetchCategories();
    }
  }, [currentUser]);

  const fetchHouseholdInfo = async () => {
    const result = await apiClient.getHouseholdInfo();
    if (result.success && result.data.household) {
      setHouseholdInfo(result.data.household);
      setIsHouseholdOwner(result.data.household.isOwner);
    } else {
      setHouseholdInfo(null);
      setIsHouseholdOwner(true); // Not in household, can manage own categories
    }
  };

  // Fetch sub-categories when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    setLoading(true);
    const result = await apiClient.getCategories();
    if (result.success) {
      setCategories(result.data.categories);
    } else {
      console.error("Failed to fetch categories:", result.error);
    }
    setLoading(false);
  };

  const fetchSubCategories = async (categoryId) => {
    const result = await apiClient.getSubCategories(categoryId);
    if (result.success) {
      setSubCategories(result.data.subCats);
    } else {
      console.error("Failed to fetch sub-categories:", result.error);
      setSubCategories([]);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.categoryName.trim()) {
      alert("Please enter a category name");
      return;
    }

    const result = await apiClient.createCategory(newCategory.categoryName, newCategory.categoryType);
    if (result.success) {
      alert("Category created successfully!");
      setNewCategory({ categoryName: '', categoryType: 'outflow' });
      fetchCategories();
    } else {
      alert("Failed to create category: " + result.error);
    }
  };

  const handleCreateSubCategory = async (e) => {
    e.preventDefault();
    if (!newSubCategory.subCatName.trim() || !newSubCategory.parentCatID) {
      alert("Please fill in all fields");
      return;
    }

    const result = await apiClient.createSubCategory(newSubCategory.subCatName, newSubCategory.parentCatID);
    if (result.success) {
      alert("Sub-category created successfully!");
      setNewSubCategory({ subCatName: '', parentCatID: '' });
      if (selectedCategory === newSubCategory.parentCatID) {
        fetchSubCategories(selectedCategory);
      }
    } else {
      alert("Failed to create sub-category: " + result.error);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? This may affect existing transactions.")) {
      return;
    }

    const result = await apiClient.deleteCategory(id);
    if (result.success) {
      alert("Category deleted successfully!");
      fetchCategories();
      if (selectedCategory === id) {
        setSelectedCategory(null);
        setSubCategories([]);
      }
    } else {
      alert("Failed to delete category: " + result.error);
    }
  };

  const handleDeleteSubCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub-category?")) {
      return;
    }

    const result = await apiClient.deleteSubCategory(id);
    if (result.success) {
      alert("Sub-category deleted successfully!");
      fetchSubCategories(selectedCategory);
    } else {
      alert("Failed to delete sub-category: " + result.error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <CurrentUserFlag username={currentUser?.username || ""} />
      <h1>Manage Categories</h1>
      <Link to="/menu-page">
        <img className={styles.logo} src="/512ktbudgebudiconlogo.png" alt="logo" />
      </Link>

      <div className={styles.content}>
        {!isHouseholdOwner && householdInfo && (
          <div className={styles.infoMessage}>
            <p>📋 You are viewing categories from household: <strong>{householdInfo.name}</strong></p>
            <p>Only the household owner can create or delete categories.</p>
          </div>
        )}

        {/* Create Category Section - Only show to owners or non-household users */}
        {isHouseholdOwner && (
        <div className={styles.section}>
          <h2>Create New Category</h2>
          <form onSubmit={handleCreateCategory} className={styles.form}>
            <input
              type="text"
              placeholder="Category Name"
              value={newCategory.categoryName}
              onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
              className={styles.input}
            />
            <select
              value={newCategory.categoryType}
              onChange={(e) => setNewCategory({ ...newCategory, categoryType: e.target.value })}
              className={styles.select}
            >
              <option value="inflow">Inflow</option>
              <option value="outflow">Outflow</option>
            </select>
            <button type="submit" className={styles.createButton}>Create Category</button>
          </form>
        </div>
        )}

        {/* Categories List */}
        <div className={styles.section}>
          <h2>Your Categories</h2>
          {categories.length === 0 ? (
            <p className={styles.emptyMessage}>No categories yet. Create one above!</p>
          ) : (
            <div className={styles.categoryList}>
              {categories.map(cat => (
                <div
                  key={cat._id}
                  className={`${styles.categoryCard} ${selectedCategory === cat._id ? styles.selected : ''}`}
                  onClick={() => setSelectedCategory(cat._id)}
                >
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryName}>{cat.category_name}</span>
                    <span className={`${styles.categoryType} ${styles[cat.category_type]}`}>
                      {cat.category_type}
                    </span>
                  </div>
                  {isHouseholdOwner && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat._id);
                    }}
                    className={styles.deleteButton}
                  >
                    Delete
                  </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Sub-Category Section - Only show to owners */}
        {isHouseholdOwner && (
        <div className={styles.section}>
          <h2>Create New Sub-Category</h2>
          <form onSubmit={handleCreateSubCategory} className={styles.form}>
            <input
              type="text"
              placeholder="Sub-Category Name"
              value={newSubCategory.subCatName}
              onChange={(e) => setNewSubCategory({ ...newSubCategory, subCatName: e.target.value })}
              className={styles.input}
            />
            <select
              value={newSubCategory.parentCatID}
              onChange={(e) => setNewSubCategory({ ...newSubCategory, parentCatID: e.target.value })}
              className={styles.select}
            >
              <option value="">Select Parent Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.category_name}</option>
              ))}
            </select>
            <button type="submit" className={styles.createButton}>Create Sub-Category</button>
          </form>
        </div>
        )}

        {/* Sub-Categories List */}
        {selectedCategory && (
          <div className={styles.section}>
            <h2>Sub-Categories</h2>
            {subCategories.length === 0 ? (
              <p className={styles.emptyMessage}>No sub-categories for this category yet.</p>
            ) : (
              <div className={styles.subCategoryList}>
                {subCategories.map(subCat => (
                  <div key={subCat._id} className={styles.subCategoryCard}>
                    <span className={styles.subCategoryName}>{subCat.sub_category_name}</span>
                    {isHouseholdOwner && (
                    <button
                      onClick={() => handleDeleteSubCategory(subCat._id)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
