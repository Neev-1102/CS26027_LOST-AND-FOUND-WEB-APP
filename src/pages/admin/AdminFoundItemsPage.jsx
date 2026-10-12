import React, { useState, useEffect } from 'react';
import { foundItemService } from '../../services/foundItemService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Package, Trash2, CheckCircle2, Eye } from 'lucide-react';

const AdminFoundItemsPage = () => {
  const { showSuccess, showError } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await foundItemService.getAll();
      setItems(res.items || []);
    } catch (err) {
      showError('Failed to fetch found items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await foundItemService.delete(selectedItem.id);
      showSuccess('Found item report removed');
      setConfirmOpen(false);
      fetchItems();
    } catch (err) {
      showError('Failed to delete report');
    }
  };

  if (loading) return <LoadingSkeleton type="details" />;

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft">
        <h1 className="text-2xl font-black text-slate-900">Manage Found Items Directory</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review items handed into campus security desks, approve public listings, or delete records.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 uppercase text-[10px] font-bold text-slate-400 tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Found / Logged By</th>
                <th className="p-4">Location</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-9 h-9 rounded-xl object-cover" />
                    <span className="truncate max-w-xs">{item.title}</span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{item.foundBy?.name}</td>
                  <td className="p-4 font-medium text-slate-500">{item.location}</td>
                  <td className="p-4 font-medium text-slate-500">{item.date}</td>
                  <td className="p-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Trash2}
                        onClick={() => { setSelectedItem(item); setConfirmOpen(true); }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Found Item Log?"
        message={`Are you sure you want to remove "${selectedItem?.title}"?`}
      />

    </div>
  );
};

export default AdminFoundItemsPage;
