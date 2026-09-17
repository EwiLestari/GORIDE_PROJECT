import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.jsx';
import { Toaster } from 'react-hot-toast';
import { Shield, Clock, Map, Star, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { ErrorBoundary } from './components/layout/ErrorBoundary.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import './index.css';

// Home Component Upgraded
const Home = () => {
  const { t } = useLanguage();
  const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };
  const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-32 pb-20 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div className="flex-1" initial="initial" animate="animate" variants={staggerContainer}>
            <motion.div variants={fadeIn} className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm mb-6">
              {t('home.heroTag')}
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-['Outfit'] leading-tight">
              {t('home.heroTitle1')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('home.heroTitle2')}</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-slate-500 dark:text-slate-400 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
              {t('home.heroDesc')}
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
              <Link to="/catalog" className="btn btn-primary px-8 py-4 text-lg shadow-lg shadow-primary/25 flex items-center gap-2 group">
                {t('home.browseCatalog')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="btn btn-secondary px-8 py-4 text-lg">{t('home.learnMore')}</Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-[100px] rounded-full"></div>
            <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop" alt="Motorcycle" className="relative z-10 rounded-2xl shadow-2xl border border-white/10 w-full object-cover h-[500px]" />
            
            {/* Floating Stats Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 backdrop-blur-xl border border-[var(--border-base)] p-4 rounded-xl shadow-2xl z-20 flex items-center gap-4"
              style={{ backgroundColor: 'var(--bg-panel)' }}
            >
              <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                <Star size={24} className="fill-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold font-['Outfit']">4.9/5</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{t('home.reviews')}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-[var(--border-base)] py-24" style={{ backgroundColor: 'var(--bg-panel)' }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-4">{t('home.whyChooseTitle')}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">{t('home.whyChooseDesc')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Shield size={32} />, title: t('home.feature1Title'), desc: t('home.feature1Desc') },
              { icon: <Clock size={32} />, title: t('home.feature2Title'), desc: t('home.feature2Desc') },
              { icon: <Zap size={32} />, title: t('home.feature3Title'), desc: t('home.feature3Desc') }
            ].map((feature, i) => (
              <div key={i} className="bg-[var(--bg-base)] border border-[var(--border-base)] shadow-md p-8 rounded-2xl hover:border-primary/50 transition-colors group">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold font-['Outfit'] mb-3">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] mb-4">{t('home.howItWorksTitle')}</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">{t('home.howItWorksDesc')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50"></div>
            {[
              { step: "01", title: t('home.step1Title'), desc: t('home.step1Desc') },
              { step: "02", title: t('home.step2Title'), desc: t('home.step2Desc') },
              { step: "03", title: t('home.step3Title'), desc: t('home.step3Desc') }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-[var(--bg-panel)] border-4 border-[var(--bg-base)] flex items-center justify-center text-2xl font-bold text-primary shadow-xl shadow-primary/20 mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold font-['Outfit'] mb-3">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-[250px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

import { Catalog } from './pages/Catalog.jsx';
import { Favorites } from './pages/Favorites.jsx';
import { Booking } from './pages/Booking.jsx';
import { MyBookings } from './pages/MyBookings.jsx';
import { AdminDashboard } from './pages/admin/Dashboard.jsx';
import { ManageMotorcycles } from './pages/admin/ManageMotorcycles.jsx';
import { ManageBookings } from './pages/admin/ManageBookings.jsx';
import { Settings } from './pages/admin/Settings.jsx';
import { About } from './pages/About.jsx';
import { Profile } from './pages/Profile.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

import Unauthorized from './pages/errors/Unauthorized.jsx';
import Forbidden from './pages/errors/Forbidden.jsx';
import NotFound from './pages/errors/NotFound.jsx';
import ServerError from './pages/errors/ServerError.jsx';

import { useAuth } from './context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/unauthorized" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/unauthorized" />;
  if (user.role !== 'admin') return <Navigate to="/forbidden" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              <Toaster 
                position="top-center"
                toastOptions={{
                  style: {
                    background: 'var(--bg-base)',
                    color: 'var(--text-base)',
                    border: '1px solid var(--border-base)'
                  }
                }}
              />
              <Navbar />

              <main className="flex-grow pb-10">
                <ErrorBoundary>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Error Routes */}
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/forbidden" element={<Forbidden />} />
                    <Route path="/server-error" element={<ServerError />} />
                    <Route path="*" element={<NotFound />} />

                    {/* Private Routes (User/Admin) */}
                    <Route path="/booking/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
                    <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                    <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />       
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                    <Route path="/admin/motorcycles" element={<AdminRoute><ManageMotorcycles /></AdminRoute>} />
                    <Route path="/admin/bookings" element={<AdminRoute><ManageBookings /></AdminRoute>} />
                    <Route path="/admin/settings" element={<AdminRoute><Settings /></AdminRoute>} />
                  </Routes>
                </ErrorBoundary>
              </main>

              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
export default App;
