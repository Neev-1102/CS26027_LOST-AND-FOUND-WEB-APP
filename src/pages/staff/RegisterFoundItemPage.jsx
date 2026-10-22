import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { foundItemService } from '../../services/foundItemService';
import { useToast } from '../../context/ToastContext';
import { CATEGORIES, LOCATIONS } from '../../data/mockData';
import { getDefaultItemImage } from '../../utils/itemImageHelper';
import ItemImageUploader from '../../components/items/ItemImageUploader';
import Button from '../../components/common/Button';
import { PackageCheck, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

const RegisterFoundItemPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      internalItemName: '',
      category: 'Electronics',
      internalDescription: '',
      color: '',
      brand: '',
      dateFound: new Date().toISOString().split('T')[0],
      approximateTime: '',
      generalLocation: LOCATIONS[0] || 'Central Library',
      storageLocation: 'Security Safe Room Cabinet A',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const defaultImg = getDefaultItemImage(data.internalItemName, data.category);
      const chosenImages = (images && images.length > 0) ? images : [defaultImg];
      const payload = {
        ...data,
        images: chosenImages,
        image: chosenImages[0],
      };

      await foundItemService.create(payload);
      showToast('Found item registered into custody! Student notifications checked.', 'success');
      navigate('/staff/found-inventory');
    } catch (err) {
      showToast(err.message || 'Failed to register found item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Staff Custody Intake
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Register Found Item</h1>
          <p className="text-xs text-slate-500">
            Log found property into college custody with secure storage allocation.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Item Internal Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. TI-84 Plus Graphing Calculator"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                errors.internalItemName ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
              }`}
              {...register('internalItemName', { required: 'Item title is required' })}
            />
            {errors.internalItemName && (
              <p className="text-xs text-rose-500 mt-1">{errors.internalItemName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              {...register('category', { required: true })}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id || cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Internal Description & Condition <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            placeholder="Condition, visible scratches, battery status, stickers, accessories included..."
            className={`w-full p-4 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
              errors.internalDescription ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
            }`}
            {...register('internalDescription', { required: 'Description is required' })}
          />
          {errors.internalDescription && (
            <p className="text-xs text-rose-500 mt-1">{errors.internalDescription.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Color <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Black, Silver"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                errors.color ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
              }`}
              {...register('color', { required: 'Color is required' })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Brand / Manufacturer
            </label>
            <input
              type="text"
              placeholder="e.g. Sony, Texas Instruments"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              {...register('brand')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Date Found <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              {...register('dateFound', { required: true })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Approximate Time
            </label>
            <input
              type="time"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              {...register('approximateTime')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              General Location (Public) <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              {...register('generalLocation', { required: true })}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Secure Storage Location Box - Staff Only */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            Confidential Secure Storage Location / Locker <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Security Locker B-04, Cabinet 3 Shelf 2"
            className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-medium focus:outline-none transition-all ${
              errors.storageLocation ? 'border-rose-300' : 'border-amber-300 focus:border-amber-500'
            }`}
            {...register('storageLocation', { required: 'Secure storage location is required' })}
          />
          <p className="text-[11px] text-amber-800">
            <strong>Security Notice:</strong> This physical storage location is strictly confidential and
            will NEVER be exposed to students or claimants.
          </p>
        </div>

        <ItemImageUploader
          label="Item Custody Photos (max 3)"
          images={images}
          onChange={setImages}
          maxImages={3}
        />

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting} icon={PackageCheck}>
            Save into Custody
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterFoundItemPage;
