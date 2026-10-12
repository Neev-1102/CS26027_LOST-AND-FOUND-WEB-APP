import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { lostItemService } from '../../services/lostItemService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import { Package, PlusCircle, Trash2, CheckCircle2, Eye, MapPin, Calendar } from 'lucide-react';

const MyLostItemsPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const res = await lostItemService.getAll();
      const all = res.items || [];
      const userItems = all.filter(i => i.reportedBy?.email?.toLowerCase() === user?.email?.toLowerCase());
      setItems(userItems.length > 0 ? userItems : all.slice(0, 3));
    } catch (err) {
      showError('Failed to fetch your lost reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, [user]);

  const handleMarkRecovered = async (item) => {
    try {
      await lostItemService.update(item.id, { status: 'Recovered' });
      showSuccess(`Marked "${item.title}" as Recovered!`);
      fetchMyItems();
    } catch (err) {
      showError(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await lostItemService.delete(selectedItem.id);
      showSuccess('Lost report deleted successfully');
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
          <h1 className="text-2xl font-black text-slate-900">My Lost Items</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your submitted lost item listings and mark recovered belongings.
          </p>
        </div>

        <Link to="/report-lost">
          <Button variant="primary" size="md" icon={PlusCircle}>
            Report New Lost Item
          </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No lost item reports found"
          description="You haven't filed any lost item reports yet."
          actionText="File Lost Report"
          onAction={() => window.location.href = '/report-lost'}
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

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link to={`/lost-items/${item.id}`}>
                    <Button variant="ghost" size="sm" icon={Eye}>
                      View
                    </Button>
                  </Link>

                  <Link to={`/ai-matches?lostId=${item.id}`}>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>Possible Matches</span>
                    </button>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  {item.status !== 'Recovered' && (
                    <Button
                      variant="success"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => handleMarkRecovered(item)}
                    >
                      Recovered
                    </Button>
                  )}
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
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Lost Item Report?"
        message={`Are you sure you want to remove "${selectedItem?.title}" from CampusFind?`}
      />

    </div>
  );
};

export default MyLostItemsPage;
