import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lostItemService } from '../../services/lostItemService';
import { useToast } from '../../context/ToastContext';
import ItemCard from '../../components/items/ItemCard';
import ItemFilters from '../../components/items/ItemFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { PlusCircle, Package } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

const MyLostItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { showToast } = useToast();

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await lostItemService.getMyLostItems();
      setItems(res.items || []);
    } catch (err) {
      showToast('Failed to load your lost items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter((item) => {
    const title = (item.itemName || item.title || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const matchesSearch = !search || title.includes(search.toLowerCase()) || desc.includes(search.toLowerCase());
    const matchesCategory = category === 'all' || item.category?.toLowerCase() === category.toLowerCase();
    const matchesStatus = status === 'all' || item.status?.toLowerCase() === status.toLowerCase();
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Lost Items</h1>
          <p className="text-xs text-slate-500">
            Manage your personal lost item reports and check their review status.
          </p>
        </div>
        <Link to="/student/report-lost">
          <Button variant="primary" icon={PlusCircle}>
            Report New Lost Item
          </Button>
        </Link>
      </div>

      <ItemFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        categories={CATEGORIES}
        statuses={[
          { value: 'pending_review', label: 'Pending Review' },
          { value: 'approved', label: 'Approved' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'rejected', label: 'Rejected' },
        ]}
        onReset={() => {
          setSearch('');
          setCategory('all');
          setStatus('all');
          setSortBy('newest');
        }}
      />

      {loading ? (
        <LoadingSpinner message="Loading your lost reports..." />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No lost reports found"
          description={
            search || category !== 'all' || status !== 'all'
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'You have not reported any lost property yet.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <ItemCard key={item._id || item.id} item={item} type="lost" />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLostItemsPage;
