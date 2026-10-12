import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { FolderTree, PlusCircle, Edit3, Trash2, Box } from 'lucide-react';

const AdminCategoriesPage = () => {
  const { showSuccess, showError } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [catName, setCatName] = useState('');
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteCat, setDeleteCat] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (err) {
      showError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditCategory(null);
    setCatName('');
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditCategory(cat);
    setCatName(cat.name);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      if (editCategory) {
        await adminService.updateCategory(editCategory.id, { name: catName });
        showSuccess(`Category updated to "${catName}"`);
      } else {
        await adminService.createCategory({ name: catName });
        showSuccess(`Category "${catName}" added`);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      showError(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async () => {
    if (!deleteCat) return;
    try {
      await adminService.deleteCategory(deleteCat.id);
      showSuccess(`Category "${deleteCat.name}" deleted`);
      setConfirmOpen(false);
      fetchCategories();
    } catch (err) {
      showError('Failed to delete category');
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={6} />;

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Category Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage classification tags for lost and found items.
          </p>
        </div>

        <Button variant="primary" size="md" icon={PlusCircle} onClick={handleOpenAdd}>
          Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${cat.color || 'bg-blue-50 text-blue-600'}`}>
                <Box className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                <p className="text-xs text-slate-400">{cat.count || 0} items listed</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit category"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setDeleteCat(cat); setConfirmOpen(true); }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Category Name"
            required
            placeholder="e.g. Laboratory Equipment, Sports Gear..."
            value={catName}
            onChange={(e) => setCatName(e.target.value)}
          />

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category?"
        message={`Are you sure you want to remove "${deleteCat?.name}" category?`}
      />

    </div>
  );
};

export default AdminCategoriesPage;
