import React, { useState } from 'react';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import ItemImageUploader from '../items/ItemImageUploader';
import { Send, AlertCircle } from 'lucide-react';
import { claimService } from '../../services/claimService';
import { useToast } from '../../context/ToastContext';

const ClaimForm = ({ foundItem, onSuccess, onCancel }) => {
  const [explanation, setExplanation] = useState('');
  const [identifyingEvidence, setIdentifyingEvidence] = useState('');
  const [proofFiles, setProofFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!explanation.trim() || !identifyingEvidence.trim()) {
      setError('Please provide both ownership explanation and identifying evidence.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const claimData = {
        foundItemId: foundItem._id || foundItem.id,
        explanation: explanation.trim(),
        identifyingEvidence: identifyingEvidence.trim(),
        proofFiles,
      };

      await claimService.submitClaim(claimData);
      showToast('Claim submitted successfully! Staff will review your submission.', 'success');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit claim.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 leading-relaxed">
        <span className="font-bold">Claiming: </span>
        <span className="font-semibold">{foundItem.internalItemName || foundItem.title}</span>
        <p className="mt-1 text-blue-800">
          To ensure items are safely returned to legitimate owners, provide detailed identifying evidence
          such as scratches, stickers, serial numbers, unique marks, lock combinations, or proof receipts.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Ownership Explanation <span className="text-rose-500">*</span>
        </label>
        <Textarea
          placeholder="Explain where, when, and how you lost this item..."
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Identifying Evidence / Unique Features <span className="text-rose-500">*</span>
        </label>
        <Textarea
          placeholder="List distinctive characteristics: stickers, wallpapers, case color, scratches, engravings, internal contents..."
          value={identifyingEvidence}
          onChange={(e) => setIdentifyingEvidence(e.target.value)}
          rows={3}
          required
        />
      </div>

      <ItemImageUploader
        label="Attach Proof Files (Purchase Invoice, Serial # Photo, ID)"
        images={proofFiles}
        onChange={setProofFiles}
        maxImages={3}
      />

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={submitting} icon={Send}>
          Submit Claim
        </Button>
      </div>
    </form>
  );
};

export default ClaimForm;
