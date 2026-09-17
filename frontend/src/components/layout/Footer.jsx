import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Bike } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const Footer = () => {
  const { t } = useLanguage();

  const linkClass = 'text-sm transition-colors hover:text-primary';

  return (
    <footer
      className="border-t border-[var(--border-base)] pt-16 pb-8 mt-20"
      style={{ backgroundColor: 'var(--bg-panel)' }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand & Description */}
          <div className="col-span-1">
            <Link to="/" className="text-3xl font-bold font-['Outfit'] mb-4 inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <Bike size={18} />
              </div>
              <span>
                <span className="text-primary">Go</span>
                <span style={{ color: 'var(--text-base)' }}>Ride</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              {t('footer.aboutDesc')}
            </p>
            <div className="flex gap-3">
              {['FB', 'TW', 'IG'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:bg-primary hover:text-white border border-[var(--border-base)]"
                  style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6" style={{ color: 'var(--text-base)' }}>
              {t('footer.quickLinks')}
            </h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className={linkClass} style={{ color: 'var(--text-muted)' }}>Home</Link></li>
              <li><Link to="/about" className={linkClass} style={{ color: 'var(--text-muted)' }}>{t('footer.about')}</Link></li>
              <li><Link to="/catalog" className={linkClass} style={{ color: 'var(--text-muted)' }}>{t('footer.catalog')}</Link></li>
              <li><Link to="/login" className={linkClass} style={{ color: 'var(--text-muted)' }}>{t('navbar.login')}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-6" style={{ color: 'var(--text-base)' }}>Legal</h4>
            <ul className="flex flex-col gap-3">
              {[t('footer.terms'), t('footer.privacy'), 'Rental Agreement', 'FAQ'].map((item) => (
                <li key={item}>
                  <a href="#" className={linkClass} style={{ color: 'var(--text-muted)' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6" style={{ color: 'var(--text-base)' }}>
              {t('footer.contact')}
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Jl. Setiabudi No. 123, Bandung, Jawa Barat 40153
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>hello@goride.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[var(--border-base)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} GoRide. {t('footer.rights')}
          </p>
          <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            Made with <span className="text-rose-500">❤️</span> in Bandung
          </p>
        </div>
      </div>
    </footer>
  );
};
