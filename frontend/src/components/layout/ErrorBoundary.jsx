import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-20 text-center animate-[fadeIn_0.5s_ease-out]">
          <div className="bg-bg-panel border border-rose-500/20 p-8 rounded-2xl max-w-lg w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500"></div>
            
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} className="text-rose-500" />
            </div>
            
            <h2 className="text-2xl font-bold font-['Outfit'] mb-3 text-white">Oops! Something went wrong</h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              We're sorry, but an unexpected error occurred while loading this section.
              You can try refreshing the page or returning to the dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Refresh Page
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn btn-secondary"
              >
                Go to Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 pt-6 border-t border-white/10 text-left">
                <p className="text-xs font-mono text-rose-400 bg-black/50 p-4 rounded-lg overflow-x-auto">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
