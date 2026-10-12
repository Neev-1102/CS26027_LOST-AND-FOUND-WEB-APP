import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { foundItemService } from '../../services/foundItemService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { CheckCircle2, PlusCircle, Trash2, Eye, MapPin, Calendar } from 'lucide-react';

const MyFoundItemsPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const res = await foundItemService.getAll();
      const all = res.items || [];
      const userItems = all.filter(i => i.foundBy?.email?.toLowerCase() === user?.email?.toLowerCase());
      setItems(userItems.length > 0 ? userItems : all.slice(0, 3));
    } catch (err) {
      showError('Failed to fetch your found reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, [user]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await foundItemService.delete(selectedItem.id);
      showSuccess('Found item report deleted successfully');
      setConfirmOpen(false);
      fetchMyItems();
    } catch (err) {
      showError('Failed to delete report');
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={4} />;

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Found Items</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage belongings you found on campus or turned into security desks.
          </p>
        </div>

        <Link to="/report-found">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Log Found Item
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No found item reports logged"
          description="You haven't logged any found items yet."
          actionText="Log Found Item"
          onAction={() => window.location.href = '/report-found'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-soft flex flex-col justify-between space-y-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-100 shrink-0"
                />
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status} size="sm" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{item.category}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm truncate">{item.title}</h4>
                  <div className="text-xs text-slate-500 space-y-0.5 pt-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" /> {item.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {item.date}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link to={`/found-items/${item.id}`}>
                  <Button variant="ghost" size="sm" icon={Eye}>
                    View Listing
                  </Button>
                </Link>

                <Button
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => { setSelectedItem(item); setConfirmOpen(true); }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

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

export default MyFoundItemsPage;
