import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foundItemService } from '../../services/foundItemService';
import DashboardTable from '../../components/dashboard/DashboardTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { PlusCircle, Search, Lock, PackageCheck } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { getItemImage } from '../../utils/itemImageHelper';

const FoundItemsInventoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await foundItemService.getAll({ status: statusFilter });
      setItems(res.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter]);

  const filteredItems = items.filter((i) => {
    if (!search) return true;
    const name = (i.internalItemName || i.title || '').toLowerCase();
    const loc = (i.storageLocation || '').toLowerCase();
    return name.includes(search.toLowerCase()) || loc.includes(search.toLowerCase());
  });

  const columns = [
    {
      header: 'Item',
      accessor: 'internalItemName',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={getItemImage(row)}
            alt=""
            className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100"
          />
          <div>
            <span className="font-bold text-slate-900 block">{row.internalItemName || row.title}</span>
            <span className="text-slate-400 text-[11px]">{row.category}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Confidential Storage',
      accessor: 'storageLocation',
      render: (row) => (
        <span className="inline-flex items-center gap-1 font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-semibold">
          <Lock className="w-3 h-3 text-amber-600" />
          {row.storageLocation || 'Security Desk'}
        </span>
      ),
    },
    {
      header: 'Found Location',
      accessor: 'generalLocation',
      render: (row) => <span className="text-xs text-slate-600">{row.generalLocation || row.location}</span>,
    },
    {
      header: 'Date Found',
      accessor: 'dateFound',
      render: (row) => formatDate(row.dateFound || row.date),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Found Items Inventory</h1>
          <p className="text-xs text-slate-500">
            Authorized staff custody records with confidential storage locker management.
          </p>
        </div>
        <Link to="/staff/register-found">
          <Button variant="primary" icon={PlusCircle}>
            Register Found Item
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items or locker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {['all', 'in_custody', 'claim_pending', 'approved_for_handover', 'returned'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading custody records..." />
      ) : (
        <DashboardTable
          columns={columns}
          data={filteredItems}
          emptyMessage="No inventory items found matching your criteria."
        />
      )}
    </div>
  );
};

export default FoundItemsInventoryPage;
