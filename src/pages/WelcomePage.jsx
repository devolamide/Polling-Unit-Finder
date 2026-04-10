import { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Footer } from '../components/Footer';
import ThumbprintLoader from '../components/ThumbprintLoader';

const DISCLAIMER_KEY = 'inec-disclaimer-accepted';

function WelcomePage({ onLocate, loading }) {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleStartClick = () => {
    const hasAccepted = localStorage.getItem(DISCLAIMER_KEY);
    
    if (hasAccepted) {
      // If already accepted, proceed directly
      proceedWithLocation();
    } else {
      // Show disclaimer for first-time users
      setShowDisclaimer(true);
    }
  };

  const proceedWithLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please enable location services.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleProceed = () => {
    localStorage.setItem(DISCLAIMER_KEY, 'true');
    setShowDisclaimer(false);
    proceedWithLocation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl w-full px-4"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4"
          >
            Find Your Polling Unit
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 px-2"
          >
            Discover polling units near you with real-time information and directions
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartClick}
            disabled={loading}
            title={loading ? "Loading..." : "Find Polling Unit"}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 sm:px-12 sm:py-6 rounded-full h-[160px] w-[160px] sm:h-[200px] sm:w-[200px] text-xl sm:text-2xl font-semibold shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 flex flex-col justify-center items-center gap-4 mx-auto disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <ThumbprintLoader />
            ) : (
              <>
                Start
              </>
            )}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 sm:mt-12 grid md:grid-cols-3 gap-3 text-center"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-500 mb-1">Fast</div>
              <div className="text-xs sm:text-sm text-gray-600">Quick Search</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-500 mb-1">Accurate</div>
              <div className="text-xs sm:text-sm text-gray-600">Real Data</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-500 mb-1">Easy</div>
              <div className="text-xs sm:text-sm text-gray-600">Simple UI</div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDisclaimer(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-4">
                <div className="bg-amber-100 rounded-full p-2 sm:p-3 flex-shrink-0">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Important Disclaimer</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    We do not have data for all polling units in every state, so the results may not be fully accurate or comprehensive.
                  </p>
                </div>
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm sm:text-base font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceed}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors shadow-lg hover:shadow-emerald-500/50"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default WelcomePage;
