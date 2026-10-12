import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const ItemFilters = ({
  search = '',
  onSearchChange,
  category = 'all',
  onCategoryChange,
  status = 'all',
  onStatusChange,
  sortBy = 'newest',
  onSortByChange,
  categories = [],
  statuses = [],
  onReset,
}) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((c) => ({
      value: typeof c === 'string' ? c : c.name || c.id,
      label: typeof c === 'string' ? c : c.name,
    })),
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...statuses.map((s) => ({
      value: s.value,
      label: s.label,
    })),
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-4">
          <Input
            placeholder="Search keywords, brand, color, location..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={Search}
          />
        </div>

        {/* Category */}
        <div className="md:col-span-3">
          <Select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={categoryOptions}
          />
        </div>

        {/* Status */}
        {statuses.length > 0 && (
          <div className="md:col-span-3">
            <Select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              options={statusOptions}
            />
          </div>
        )}

        {/* Sort & Reset */}
        <div className="md:col-span-2 flex items-center gap-2">
          <div className="flex-1">
            <Select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              options={sortOptions}
            />
          </div>
          {onReset && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onReset}
              title="Reset Filters"
              className="p-2.5 h-10 flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemFilters;
