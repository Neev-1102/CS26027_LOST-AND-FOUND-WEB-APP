import React, { useState, useEffect } from 'react';
import { foundItemService } from '../../services/foundItemService';
import ItemCard from '../../components/items/ItemCard';
import ItemFilters from '../../components/items/ItemFilters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { ShieldCheck, PackageSearch } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

const AvailableClaimListingsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const fetchClaimableItems = async () => {
    try {
      setLoading(true);
      const res = await foundItemService.getAll({
        search,
        category,
        sortBy,
      });
      setItems(res.items || []);
    } catch (err) {
      console.error('Failed to load found items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaimableItems();
  }, [category, sortBy]);

  const handleSearchSubmit = (val) => {
    setSearch(val);
    fetchClaimableItems();
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>Campus Custody Claim Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Items Available for Claim</h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
          These items have been handed into official campus custody. If an item belongs to you, submit a verified ownership claim.
          Specific internal storage lockers and serial numbers are kept confidential by campus security to prevent fraudulent claims.
        </p>
      </div>

      <ItemFilters
        search={search}
        onSearchChange={handleSearchSubmit}
        category={category}
        onCategoryChange={setCategory}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        categories={CATEGORIES}
        onReset={() => {
          setSearch('');
          setCategory('all');
          setSortBy('newest');
        }}
      />

      {loading ? (
        <LoadingSpinner message="Scanning campus custody inventory..." />
      ) : items.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No matching found items"
          description="There are currently no items in custody matching your filters. Check back regularly or report your lost item to receive match notifications."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <ItemCard key={item._id || item.id} item={item} type="found" claimable={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableClaimListingsPage;
