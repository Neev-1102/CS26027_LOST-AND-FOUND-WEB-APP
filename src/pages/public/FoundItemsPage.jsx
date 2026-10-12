import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/common/SearchBar';
import FilterPanel from '../../components/common/FilterPanel';
import ItemCard from '../../components/items/ItemCard';
import Pagination from '../../components/common/Pagination';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { foundItemService } from '../../services/foundItemService';

const FoundItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [location, setLocation] = useState(searchParams.get('location') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await foundItemService.getAll({
        search: searchQuery,
        category,
        location,
        status,
        sortBy
      });
      setItems(res.items || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch found items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchQuery, category, location, status, sortBy]);

  const handleReset = () => {
    setSearchQuery('');
    setCategory('all');
    setLocation('all');
    setStatus('all');
    setSortBy('newest');
    setSearchParams({});
  };

  const totalPages = Math.ceil(items.length / pageSize) || 1;
  const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Found Items Directory
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Belongings found around campus and deposited at security desks or departmental offices. If you recognize your item, click details to submit a verified claim.
        </p>

        <div className="mt-6">
          <SearchBar
            value={searchQuery}
            onChange={(val) => { setSearchQuery(val); setCurrentPage(1); }}
            placeholder="Search found bottles, headphones, wallets, keys, calculators..."
          />
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        category={category}
        setCategory={(val) => { setCategory(val); setCurrentPage(1); }}
        location={location}
        setLocation={(val) => { setLocation(val); setCurrentPage(1); }}
        status={status}
        setStatus={(val) => { setStatus(val); setCurrentPage(1); }}
        sortBy={sortBy}
        setSortBy={(val) => { setSortBy(val); setCurrentPage(1); }}
        onReset={handleReset}
      />

      {/* Content area */}
      {loading ? (
        <LoadingSkeleton type="card" count={8} />
      ) : error ? (
        <ErrorState onRetry={fetchItems} description={error} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No found items match your query"
          description="Try resetting your filters or file a Lost Item report so security can contact you when matched."
          actionText="Reset All Filters"
          onAction={handleReset}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedItems.map((item) => (
              <ItemCard key={item.id} item={item} type="found" />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalItems={items.length}
            pageSize={pageSize}
          />
        </>
      )}
    </div>
  );
};

export default FoundItemsPage;
