import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { lostItemService } from '../../services/lostItemService';
import { useToast } from '../../context/ToastContext';
import { CATEGORIES, LOCATIONS } from '../../data/mockData';
import { getDefaultItemImage } from '../../utils/itemImageHelper';
import ItemImageUploader from '../../components/items/ItemImageUploader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import { Package, Send, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

const ReportLostItemPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const showToast = toast?.showToast || toast?.addToast || toast?.showSuccess || console.log;
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [possibleMatchesCount, setPossibleMatchesCount] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      itemName: '',
      category: 'Electronics',
      description: '',
      color: '',
      brand: '',
      dateLost: new Date().toISOString().split('T')[0],
      approximateTime: '',
      locationLost: LOCATIONS[0] || 'Central Library',
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const defaultImg = getDefaultItemImage(data.itemName, data.category);
      const chosenImages = (images && images.length > 0) ? images : [defaultImg];
      const payload = {
        ...data,
        images: chosenImages,
        image: chosenImages[0],
      };

      const result = await lostItemService.create(payload);
      showToast('Lost item reported successfully! Staff will review it shortly.', 'success');

      if (result.possibleMatchesCount > 0) {
        setPossibleMatchesCount(result.possibleMatchesCount);
      } else {
        navigate('/student/my-lost-items');
      }
    } catch (err) {
      showToast(err.message || 'Failed to submit lost item report', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (possibleMatchesCount !== null) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Report Submitted!</h2>
        <p className="text-sm text-slate-600 mt-2 mb-6">
          Our matching algorithm identified <strong>{possibleMatchesCount} possible match(es)</strong> in campus custody that may match your description.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="primary" onClick={() => navigate('/student/available-claims')}>
            Browse Found Items to Claim
          </Button>
          <Button variant="secondary" onClick={() => navigate('/student/my-lost-items')}>
            Go to My Lost Items
          </Button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-black text-slate-900">Report a Lost Item</h1>
          <p className="text-xs text-slate-500">
            Provide detailed information to help campus staff and security locate your lost item.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Apple MacBook Pro M2"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                errors.itemName ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
              }`}
              {...register('itemName', { required: 'Item name is required' })}
            />
            {errors.itemName && <p className="text-xs text-rose-500 mt-1">{errors.itemName.message}</p>}
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
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Describe unique characteristics, scratches, stickers, condition, contents, or serial markings..."
            className={`w-full p-4 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
              errors.description ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
            }`}
            {...register('description', { required: 'Please provide a detailed description' })}
          />
          {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Primary Color <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Space Gray, Matte Black, Blue"
              className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                errors.color ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
              }`}
              {...register('color', { required: 'Color is required' })}
            />
            {errors.color && <p className="text-xs text-rose-500 mt-1">{errors.color.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Brand / Manufacturer
            </label>
            <input
              type="text"
              placeholder="e.g. Apple, Dell, Titan, WildHorn"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              {...register('brand')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Date Lost <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              {...register('dateLost', { required: true })}
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
              Location Lost <span className="text-rose-500">*</span>
            </label>
            <select
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
              {...register('locationLost', { required: true })}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ItemImageUploader
          label="Item Photos (Optional, max 3)"
          images={images}
          onChange={setImages}
          maxImages={3}
        />

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={submitting} icon={Send}>
            Submit Lost Report
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportLostItemPage;
