import React from 'react';
import Select from './Select';
import Button from './Button';
import { Filter, RotateCcw } from 'lucide-react';
import { CATEGORIES, LOCATIONS } from '../../data/mockData';

const FilterPanel = ({
  category,
  setCategory,
  location,
  setLocation,
  status,
  setStatus,
  sortBy,
  setSortBy,
  onReset
}) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map(c => ({ value: c.name, label: c.name }))
  ];

  const locationOptions = [
    { value: 'all', label: 'All Campus Locations' },
    ...LOCATIONS.map(l => ({ value: l, label: l }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'Lost', label: 'Lost' },
    { value: 'Found', label: 'Found' },
    { value: 'Claimed', label: 'Claimed / Recovered' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' }
  ];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft mb-6 transition-all">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Refine & Filter Results</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-800"
        >
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder=""
        />

        <Select
          label="Campus Location"
          options={locationOptions}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder=""
        />

        <Select
          label="Item Status"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          placeholder=""
        />

        <Select
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          placeholder=""
        />
      </div>
    </div>
  );
};

export default FilterPanel;
