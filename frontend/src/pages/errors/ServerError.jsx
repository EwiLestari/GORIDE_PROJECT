import React from 'react';
import { Link } from 'react-router-dom';
import { ServerCrash } from 'lucide-react';
import { motion } from 'framer-motion';

const ServerError = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-10 md:p-16 rounded-3xl text-center max-w-lg w-full relative overflow-hidden"
      >
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-[80px]"></div>

        <div className="relative z-10">
          <div
            className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'var(--bg-subtle)' }}
          >
            <ServerCrash className="text-red-600" size={48} />
          </div>
          <h1 className="text-6xl font-bold font-['Outfit'] text-red-600 mb-2">500</h1>
          <h2 className="text-2xl font-bold font-['Outfit'] mb-4" style={{ color: 'var(--text-base)' }}>
            Internal Server Error
          </h2>
          <p className="mb-8 text-base" style={{ color: 'var(--text-muted)' }}>
            Oops! Something went wrong on our end. Please try again later.
          </p>
          <Link to="/" className="btn btn-primary px-8 py-3">
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ServerError;
