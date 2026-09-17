/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { LogOut, User as UserIcon, LayoutDashboard, Bike, History, Info, Menu, X, Heart, Sun, Moon, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin logout?')) {
      logout();
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path, activeColor = 'text-primary') =>
    `flex items-center gap-2 text-sm font-medium transition-all ${
      isActive(path) ? activeColor : 'text-[var(--text-muted)] hover:text-[var(--text-base)]'
    }`;

  const mobileLinkClass = (path, activeColor = 'text-primary bg-primary/10') =>
    `flex items-center gap-3 text-base font-medium p-3 rounded-xl transition-all ${
      isActive(path)
        ? activeColor
        : 'text-[var(--text-muted)] hover:text-[var(--text-base)] hover:bg-[var(--bg-subtle)]'
    }`;

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl shadow-md border-b border-[var(--border-base)] py-3'
          : 'bg-transparent py-4 md:py-5'
      }`}
      style={scrolled ? { backgroundColor: 'var(--navbar-bg)' } : {}}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center max-w-7xl">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold font-['Outfit'] tracking-tight flex items-center gap-2 group z-50"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
            <Bike size={20} className="md:w-6 md:h-6" />
          </div>
          <div>
            <span className="text-primary">Go</span>
            <span style={{ color: 'var(--text-base)' }}>Ride</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-5 items-center">

          {/* Main Links */}
          <div className="flex gap-5 items-center">
            <Link to="/about" className={linkClass('/about')}>
              <Info size={16} />
              About
            </Link>
            <Link to="/catalog" className={linkClass('/catalog')}>
              <Bike size={16} />
              {t('navbar.catalog')}
            </Link>
          </div>

          <div className="w-px h-4 bg-[var(--border-strong)] mx-1"></div>

          {/* Theme & Language Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
              className="p-2 rounded-full text-[var(--text-muted)] hover:text-primary hover:bg-[var(--bg-subtle)] transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => changeLanguage(language === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[var(--text-muted)] hover:text-primary hover:bg-[var(--bg-subtle)] transition-all font-semibold text-xs"
            >
              <Globe size={14} />
              {language.toUpperCase()}
            </button>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div
                className="flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--border-base)] backdrop-blur-md shadow-sm"
                style={{ backgroundColor: 'var(--bg-panel)' }}
              >
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                      isActive('/admin') ? 'text-secondary' : 'text-[var(--text-muted)] hover:text-secondary'
                    }`}
                    title={t('navbar.dashboard')}
                  >
                    <LayoutDashboard size={16} />
                    <span className="hidden lg:inline">{t('navbar.dashboard')}</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/my-bookings"
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        isActive('/my-bookings') ? 'text-primary' : 'text-[var(--text-muted)] hover:text-primary'
                      }`}
                      title={t('navbar.myBookings')}
                    >
                      <History size={16} />
                      <span className="hidden lg:inline">{t('navbar.myBookings')}</span>
                    </Link>
                    <Link
                      to="/favorites"
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        isActive('/favorites') ? 'text-rose-500' : 'text-[var(--text-muted)] hover:text-rose-500'
                      }`}
                      title={t('navbar.favorites')}
                    >
                      <Heart size={16} className={isActive('/favorites') ? 'fill-rose-500' : ''} />
                      <span className="hidden lg:inline">{t('navbar.favorites')}</span>
                    </Link>
                  </>
                )}

                <div className="w-px h-4 bg-[var(--border-strong)] mx-1"></div>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-[var(--text-muted)] hover:text-primary transition-colors group"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs group-hover:bg-primary/20 transition-colors"
                    style={{ backgroundColor: 'var(--bg-subtle)' }}
                  >
                    <UserIcon size={14} />
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate" style={{ color: 'var(--text-base)' }}>
                    {user.name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="ml-1 w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  title={t('navbar.logout')}
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-base)] transition-colors"
                >
                  {t('navbar.login')}
                </Link>
                <Link to="/register" className="btn btn-primary !px-5 !py-2 !rounded-lg text-sm shadow-lg shadow-primary/20">
                  {t('navbar.register')}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden z-50 p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-base)] hover:bg-[var(--bg-subtle)] transition-all"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full backdrop-blur-xl border-b border-[var(--border-base)] p-5 md:hidden shadow-2xl flex flex-col gap-4"
            style={{ backgroundColor: 'var(--mobile-menu-bg)' }}
          >
            {/* Nav Links */}
            <div className="flex flex-col gap-1">
              <Link to="/about" className={mobileLinkClass('/about')}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg)' }}>
                  <Info size={18} />
                </div>
                About GoRide
              </Link>
              <Link to="/catalog" className={mobileLinkClass('/catalog')}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg)' }}>
                  <Bike size={18} />
                </div>
                {t('navbar.catalog')}
              </Link>
            </div>

            {/* Theme & Language Row */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-base)]"
              style={{ backgroundColor: 'var(--bg-subtle)' }}
            >
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 flex-1 text-sm font-medium text-[var(--text-muted)] hover:text-primary transition-colors"
              >
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                {theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
              </button>
              <div className="w-px h-5 bg-[var(--border-base)]"></div>
              <button
                onClick={() => changeLanguage(language === 'id' ? 'en' : 'id')}
                className="flex items-center gap-2 flex-1 text-sm font-medium text-[var(--text-muted)] hover:text-primary transition-colors justify-end"
              >
                <Globe size={17} />
                {language === 'id' ? 'Bahasa Indonesia' : 'English'}
              </button>
            </div>

            <div className="w-full h-px bg-[var(--border-base)]"></div>

            {/* Auth */}
            {user ? (
              <div className="flex flex-col gap-1">
                {/* User info */}
                <div className="flex items-center gap-3 p-3 rounded-xl mb-1" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--icon-bg)', color: 'var(--text-muted)' }}
                  >
                    <UserIcon size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-base" style={{ color: 'var(--text-base)' }}>{user.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                </div>

                <Link to="/profile" className={mobileLinkClass('/profile')}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg)' }}>
                    <UserIcon size={17} />
                  </div>
                  {t('navbar.profile')}
                </Link>

                {isAdmin ? (
                  <Link to="/admin" className={mobileLinkClass('/admin', 'text-secondary bg-secondary/10')}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg)' }}>
                      <LayoutDashboard size={17} />
                    </div>
                    {t('navbar.dashboard')}
                  </Link>
                ) : (
                  <>
                    <Link to="/my-bookings" className={mobileLinkClass('/my-bookings')}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg)' }}>
                        <History size={17} />
                      </div>
                      {t('navbar.myBookings')}
                    </Link>
                    <Link to="/favorites" className={mobileLinkClass('/favorites', 'text-rose-500 bg-rose-500/10')}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--icon-bg)' }}>
                        <Heart size={17} className={isActive('/favorites') ? 'fill-rose-500' : ''} />
                      </div>
                      {t('navbar.favorites')}
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-1"
                >
                  <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <LogOut size={17} />
                  </div>
                  {t('navbar.logout')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to="/login"
                  className="btn border border-[var(--border-base)] w-full justify-center"
                  style={{ color: 'var(--text-base)', backgroundColor: 'var(--bg-subtle)' }}
                >
                  {t('navbar.login')}
                </Link>
                <Link to="/register" className="btn btn-primary w-full justify-center">
                  {t('navbar.register')}
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
