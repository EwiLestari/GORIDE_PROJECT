import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="container mx-auto px-6 pt-32 pb-20 max-w-5xl">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold font-['Outfit'] mb-4 text-primary">About GoRide</h2>
        <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          We are the premium motorcycle rental service in Bandung, dedicated to providing the best riding experience for locals and tourists alike.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div
          className="h-80 rounded-2xl overflow-hidden shadow-2xl relative border border-[var(--border-base)]"
          style={{ backgroundColor: 'var(--bg-subtle)' }}
        >
          <img
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1000&auto=format&fit=crop"
            alt="Riding in Bandung"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div>
          <h3 className="text-3xl font-bold font-['Outfit'] mb-4" style={{ color: 'var(--text-base)' }}>
            Our Mission
          </h3>
          <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            At GoRide, we believe that exploring Bandung should be easy, stylish, and unforgettable. Our mission is to provide well-maintained, high-quality motorcycles that suit your every need—whether it's navigating through city traffic or enjoying a scenic ride up to Lembang.
          </p>
          <ul className="space-y-4">
            {['Premium Fleet of Motorcycles', '24/7 Customer Support', 'Flexible Rental Durations'].map((item) => (
              <li key={item} className="flex items-center gap-3" style={{ color: 'var(--text-base)' }}>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-sm">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass-panel p-10 text-center rounded-2xl">
        <h3 className="text-3xl font-bold font-['Outfit'] mb-4" style={{ color: 'var(--text-base)' }}>
          Ready to start your journey?
        </h3>
        <p className="mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Choose from our wide selection of matic, manual, and sport motorcycles. Your adventure awaits.
        </p>
        <Link to="/catalog" className="btn btn-primary px-8 py-4 text-lg">
          Browse Catalog
        </Link>
      </div>
    </div>
  );
};
