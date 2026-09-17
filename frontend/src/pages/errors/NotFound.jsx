import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-10 md:p-16 rounded-3xl text-center max-w-2xl w-full relative overflow-hidden"
      >
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
            className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 border border-[var(--border-base)]"
            style={{ backgroundColor: 'var(--bg-subtle)' }}
          >
            <Compass size={64} className="text-primary" />
          </motion.div>

          <h1 className="text-7xl font-bold font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold font-['Outfit'] mb-4" style={{ color: 'var(--text-base)' }}>
            Lost your way?
          </h2>
          <p className="mb-10 max-w-md mx-auto text-lg" style={{ color: 'var(--text-muted)' }}>
            The page you're looking for has drifted off the map. Let's get you back on the right road.
          </p>

          <Link to="/" className="btn btn-primary inline-flex items-center gap-3 px-8 py-4 text-lg">
            <ArrowLeft size={20} />
            Back to Garage
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
