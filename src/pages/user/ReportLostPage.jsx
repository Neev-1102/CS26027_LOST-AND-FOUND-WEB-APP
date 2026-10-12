import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { lostItemService } from '../../services/lostItemService';
import { useToast } from '../../context/ToastContext';
import ImageUploader from '../../components/common/ImageUploader';
import { CATEGORIES, LOCATIONS } from '../../data/mockData';
import { 
  Package, 
  Send, 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  DoorClosed, 
  Fingerprint, 
  FileText 
} from 'lucide-react';

const ReportLostPage = () => {
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
      model: '',
      serialNumber: '',
      location: 'Central Library',
      building: 'Main Library Building',
      room: '2nd Floor Quiet Study',
      date: new Date().toISOString().split('T')[0],
      time: '14:30',
      identifyingFeatures: '',
      additionalNotes: ''
    }
  });

  const onSubmit = async (formData) => {
    try {
      const fullDescription = `${formData.description}\n\nIdentifying Features: ${formData.identifyingFeatures || 'None specified'}\nAdditional Notes: ${formData.additionalNotes || 'N/A'}`;

      const created = await lostItemService.create({
        name: formData.name,
        title: formData.name,
        category: formData.category,
        location: `${formData.location} (${formData.building}${formData.room ? ` - ${formData.room}` : ''})`,
        date: formData.date,
        time: formData.time,
        color: formData.color || 'Unspecified',
        brand: formData.brand || 'N/A',
        model: formData.model || '',
        serialNumber: formData.serialNumber || '',
        description: fullDescription,
        image: imagePreview || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
        imagePreview
      });

      showSuccess('Lost item report submitted successfully!');
      setSubmittedItemId(created?.id || 'lost_1');
    } catch (err) {
      showError(err.message || 'Failed to submit report.');
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
              Lost Item Reported Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your report is now published on the CampusFind directory. Would you like to run an instant AI similarity search against current found items?
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/ai-matches?lostId=${submittedItemId}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find Possible Matches Now</span>
            </Link>

            <Link
              to="/my-items/lost"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              View My Reported Items
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
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Report Lost Item</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in detailed item attributes to assist campus security and fellow students with recovery.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-8">
        
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Tag className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Apple MacBook Air M2 (Space Gray)"
                {...register('name', { required: 'Item name is required.' })}
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
                {...register('category', { required: 'Please choose category.' })}
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
                placeholder="e.g. Apple, Fossil, Sony, North Face"
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
                placeholder="e.g. Space Gray, Matte Black, Blue"
                {...register('color')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Model / Variant
              </label>
              <input
                type="text"
                placeholder="e.g. 13-inch M2 2023"
                {...register('model')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Serial Number (Optional / Confidential)
              </label>
              <input
                type="text"
                placeholder="e.g. C02G9981MD6R (Helps security verify ownership definitively)"
                {...register('serialNumber')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe where you lost it, context, and visible appearance..."
                {...register('description', { required: 'Description is required.' })}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 ${
                  errors.description ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                }`}
              />
              {errors.description && <p className="text-[11px] font-medium text-rose-600">{errors.description.message}</p>}
            </div>
          </div>
        </div>

        {/* Section 2: Location Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Location Where Lost
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Primary Campus Area <span className="text-rose-500">*</span>
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

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Building / Wing
              </label>
              <input
                type="text"
                placeholder="e.g. Central Library"
                {...register('building')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Room / Area Specifics
              </label>
              <input
                type="text"
                placeholder="e.g. 2nd Floor Silent Room"
                {...register('room')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Date & Time */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              3. Date & Approximate Time
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Date Lost <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                {...register('date', { required: 'Date is required.' })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Approximate Time
              </label>
              <input
                type="time"
                {...register('time')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Image Upload */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4. Item Image (Enables AI Similarity Search)
            </h2>
          </div>

          <ImageUploader
            value={imagePreview}
            onChange={(url) => setImagePreview(url)}
            label="Upload photo of the item (or catalog reference image)"
          />
        </div>

        {/* Section 5: Additional Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Fingerprint className="w-4 h-4 text-blue-600" />
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              5. Identifying Features & Additional Notes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Identifying Features (Stickers, Scratches, Engravings)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. ReactJS sticker on lid, minor scratch on bottom edge..."
                {...register('identifyingFeatures')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Additional Notes
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Urgent for midterm exams, please call security if turned in..."
                {...register('additionalNotes')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
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
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-60 flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Report Lost Item'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportLostPage;
