import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { foundItemService } from '../../services/foundItemService';
import { useToast } from '../../context/ToastContext';
import ImageUploader from '../../components/common/ImageUploader';
import { CATEGORIES, LOCATIONS } from '../../data/mockData';
import { getDefaultItemImage } from '../../utils/itemImageHelper';
import { 
  CheckCircle2, 
  Send, 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

const ReportFoundPage = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [imagePreview, setImagePreview] = useState('');
  const [submittedItemId, setSubmittedItemId] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      category: 'Electronics',
      description: '',
      brand: '',
      color: '',
      location: 'Central Library',
      date: new Date().toISOString().split('T')[0],
      time: '15:00',
      additionalDetails: ''
    }
  });

  const onSubmit = async (formData) => {
    try {
      const fullDescription = `${formData.description}\n\nAdditional Details: ${formData.additionalDetails || 'Turned in to campus staff/security.'}`;
      const itemPhoto = imagePreview || getDefaultItemImage(formData.name, formData.category);

      const created = await foundItemService.create({
        name: formData.name,
        title: formData.name,
        category: formData.category,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        color: formData.color || 'Unspecified',
        brand: formData.brand || 'N/A',
        description: fullDescription,
        image: itemPhoto,
        images: [itemPhoto],
        imagePreview
      });

      showSuccess('Found item reported successfully! Thank you for your campus integrity.');
      setSubmittedItemId(created?.item?._id || created?.item?.id || created?.id || 'found_1');
    } catch (err) {
      showError(err.message || 'Failed to submit found item report.');
    }
  };

  if (submittedItemId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Found Item Logged Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              The item is now listed in the public Found Items directory. If you haven't done so, please surrender custody to the nearest campus security desk.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/found-items/${submittedItemId}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors"
            >
              <span>View Found Listing</span>
            </Link>

            <Link
              to="/found-items"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Browse All Found Items
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Report Found Item</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Help reconnect lost belongings with their rightful student or faculty owner.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Discovered Item Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Fossil Black Men's Leather Wallet"
                {...register('name', { required: 'Found item name is required.' })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
              {errors.name && <p className="text-[11px] font-medium text-rose-600">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('category', { required: 'Please select category.' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Brand / Manufacturer
              </label>
              <input
                type="text"
                placeholder="e.g. Fossil, Apple, Hydro Flask"
                {...register('brand')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Color
              </label>
              <input
                type="text"
                placeholder="e.g. Black, Silver, Navy"
                {...register('color')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Location Found <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('location', { required: 'Please select location.' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="State where you noticed the item and where it has been deposited (e.g. front desk, security guard booth)..."
                {...register('description', { required: 'Description is required.' })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 ${
                  errors.description ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
              {errors.description && <p className="text-[11px] font-medium text-rose-600">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Date & Time Found */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Discovery Date & Time
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Date Found <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                {...register('date', { required: 'Date found is required.' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Time Found
              </label>
              <input
                type="time"
                {...register('time')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Image */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Item Photograph
            </h2>
          </div>

          <ImageUploader
            value={imagePreview}
            onChange={(url) => setImagePreview(url)}
            label="Upload photo of the found item"
          />
        </div>

        {/* Section 4: Custody & Additional Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Custody Handover & Additional Details
            </h2>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Current Custody Location / Additional Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Deposited with Library Circulation Desk attendant Clara on 2nd floor..."
              {...register('additionalDetails')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 disabled:opacity-60 flex items-center gap-2 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Report Found Item'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportFoundPage;
