import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

export const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mx-auto px-6 pt-32 max-w-7xl animate-[fadeIn_0.5s_ease-out]">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold font-['Outfit']">Admin Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Manage Motorcycles Card */}
        <div className="glass-panel p-8 group hover:-translate-y-1 transition-transform">
          <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold font-['Outfit'] mb-2">Motorcycles</h3>
          <p className="text-slate-400 mb-6 text-sm">Add, edit, or remove motorcycles from the catalog. Update stock and status.</p>
          <Link to="/admin/motorcycles" className="text-primary font-medium group-hover:text-primary-hover flex items-center gap-2">
            Manage Fleet →
          </Link>
        </div>

        {/* Manage Bookings Card */}
        <div className="glass-panel p-8 group hover:-translate-y-1 transition-transform">
          <div className="h-12 w-12 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold font-['Outfit'] mb-2">Bookings</h3>
          <p className="text-slate-400 mb-6 text-sm">Confirm new bookings, process returns, and calculate late fees automatically.</p>
          <Link to="/admin/bookings" className="text-secondary font-medium group-hover:text-emerald-500 flex items-center gap-2">
            Manage Bookings →
          </Link>
        </div>

        {/* Settings Card */}
        <div className="glass-panel p-8 group hover:-translate-y-1 transition-transform">
          <div className="h-12 w-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold font-['Outfit'] mb-2">Settings</h3>
          <p className="text-slate-400 mb-6 text-sm">Configure global application settings like default late fees and policies.</p>
          <Link to="/admin/settings" className="text-purple-400 font-medium hover:text-purple-300 flex items-center gap-2">
            System Settings →
          </Link>
        </div>

      </div>
    </div>
  );
};
