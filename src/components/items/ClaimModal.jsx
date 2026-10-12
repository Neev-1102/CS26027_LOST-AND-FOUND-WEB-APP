import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import Input from '../common/Input';
import ImageUploader from '../common/ImageUploader';
import { useToast } from '../../context/ToastContext';
import { claimService } from '../../services/claimService';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const ClaimModal = ({ isOpen, onClose, item, onSuccess }) => {
  const { showSuccess, showError } = useToast();
  const [whyMine, setWhyMine] = useState('');
  const [uniqueFeature, setUniqueFeature] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (!item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!whyMine.trim()) newErrors.whyMine = 'Please explain why you believe this item is yours.';
    if (!uniqueFeature.trim()) newErrors.uniqueFeature = 'Please provide a unique identifying feature.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await claimService.createClaim({
        itemId: item.id,
        itemTitle: item.title,
        itemImage: item.image,
        whyMine,
        uniqueFeature,
        proofImagePreview: proofImage,
        additionalInfo
      });

      showSuccess('Ownership claim submitted successfully! Campus admin will review your proof.');
      if (onSuccess) onSuccess();
      onClose();
      // Reset form
      setWhyMine('');
      setUniqueFeature('');
      setProofImage('');
      setAdditionalInfo('');
      setErrors({});
    } catch (err) {
      showError(err.message || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Claim Item Ownership"
      subtitle={`Item: ${item.title}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Safety Warning */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Official Campus Verification Policy</p>
            <p className="mt-0.5 text-amber-800">
              Only submit a claim if you are the rightful owner. False claims violate campus code of conduct and are logged with student/faculty IDs.
            </p>
          </div>
        </div>

        <Textarea
          label="Why do you believe this item belongs to you?"
          required
          placeholder="E.g., I lost my black Fossil wallet in the canteen around 1 PM on Aug 12th..."
          value={whyMine}
          onChange={(e) => setWhyMine(e.target.value)}
          error={errors.whyMine}
        />

        <Input
          label="Describe a unique identifying feature"
          required
          placeholder="E.g., Serial number, hidden scratch on bottom, sticker inside, family photo in sleeve..."
          value={uniqueFeature}
          onChange={(e) => setUniqueFeature(e.target.value)}
          error={errors.uniqueFeature}
        />

        <ImageUploader
          label="Upload Proof of Ownership (Receipt, Purchase PDF, Old Photo)"
          value={proofImage}
          onChange={(preview) => setProofImage(preview)}
          helperText="Upload purchase receipt, invoice photo, or photo showing you with the item"
        />

        <Textarea
          label="Additional Details (Optional)"
          placeholder="Any additional information to assist security officers..."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          rows={2}
        />

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={ShieldCheck}
            loading={loading}
          >
            Submit Verified Claim
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClaimModal;
