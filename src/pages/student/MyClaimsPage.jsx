import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { claimService } from '../../services/claimService';
import ClaimCard from '../../components/claims/ClaimCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { FileCheck, Search } from 'lucide-react';

const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const res = await claimService.getMyClaims();
        setClaims(res.claims || []);
      } catch (err) {
        console.error('Failed to fetch claims:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  const filtered = claims.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Ownership Claims</h1>
          <p className="text-xs text-slate-500">
            Track verification progress and review decisions made by campus staff.
          </p>
        </div>
        <Link to="/student/available-claims">
          <Button variant="primary" icon={Search}>
            Browse Available Items
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'under_review', 'approved', 'completed', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === st
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your submitted claims..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No claims match this status"
          description={
            filter !== 'all'
              ? 'No claims found under this filter.'
              : 'You have not submitted any ownership claims yet. Browse available listings to claim your lost belongings.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((claim) => (
            <ClaimCard key={claim._id || claim.id} claim={claim} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClaimsPage;
