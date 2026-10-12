import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { Settings, Save, ShieldAlert, BellRing } from 'lucide-react';

const AdminSettingsPage = () => {
  const { showSuccess } = useToast();
  const [siteTitle, setSiteTitle] = useState('CampusFind Lost & Found System');
  const [securityRoom, setSecurityRoom] = useState('Central Admin Building, Room 104');
  const [contactPhone, setContactPhone] = useState('+1 (555) 999-CAMPUS');
  const [retentionDays, setRetentionDays] = useState('90');
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    showSuccess('CampusFind platform settings saved successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft">
        <h1 className="text-2xl font-black text-slate-900">System & Security Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure security desk contact details, retention schedules, and automated email alerts.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
        
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            1. Institution & Security Desk Details
          </h3>

          <Input
            label="Platform Title"
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
          />

          <Input
            label="Physical Security Pickup Desk"
            value={securityRoom}
            onChange={(e) => setSecurityRoom(e.target.value)}
          />

          <Input
            label="Security Helpline Telephone"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
          />
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            2. Item Retention & Privacy Regulations
          </h3>

          <Input
            label="Item Retention Period (Days before archiving)"
            type="number"
            value={retentionDays}
            onChange={(e) => setRetentionDays(e.target.value)}
            helperText="Unclaimed items will be archived after specified retention days"
          />

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer text-xs text-slate-700 font-semibold">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>Enable automated match notification emails to students</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button type="submit" variant="primary" icon={Save}>
            Save Platform Settings
          </Button>
        </div>

      </form>

    </div>
  );
};

export default AdminSettingsPage;
