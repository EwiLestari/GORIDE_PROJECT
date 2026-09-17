import { Settings as SettingsIcon, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="container mx-auto px-6 pt-32 pb-20 max-w-4xl animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-4xl font-bold font-['Outfit']">System Settings</h2>
          <p className="text-slate-400">Configure global application rules.</p>
        </div>
      </div>

      <div className="glass-panel p-8">
        <form onSubmit={handleSave} className="flex flex-col gap-8">
          
          <div>
            <h3 className="text-xl font-bold font-['Outfit'] mb-4 text-white border-b border-white/10 pb-2">Business Rules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Late Return Fee (Per Hour)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">Rp</span>
                  <input type="number" defaultValue="10000" className="w-full bg-bg-dark border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-primary focus:outline-none" />
                </div>
                <p className="text-xs text-slate-500">Fee charged automatically when return exceeds end time.</p>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Minimum Booking Duration (Hours)</label>
                <input type="number" defaultValue="24" className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold font-['Outfit'] mb-4 text-white border-b border-white/10 pb-2">Platform Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Company Name</label>
                <input type="text" defaultValue="GoRide Bandung" className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Support Email</label>
                <input type="email" defaultValue="support@goride.com" className="w-full bg-bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-white/10 pt-6">
            <button type="submit" className="btn btn-primary flex items-center gap-2 px-8">
              <Save size={18} />
              Save Configuration
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};
