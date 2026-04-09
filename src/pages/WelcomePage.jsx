import { MapPin, Navigation } from "lucide-react";
import { motion } from "motion/react";
import { Footer } from '../components/Footer';
import ThumbprintLoader from '../components/ThumbprintLoader';

function WelcomePage({ onLocate, loading }) {
  const handleLocate = () => {
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
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          {/*
          <div className="mb-8 flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="bg-emerald-500 rounded-full p-8 shadow-2xl"
            >
              <MapPin className="w-16 h-16 text-white" />
            </motion.div>
          </div>
          */}

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            Find Your Polling Unit
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-12"
          >
            Discover polling units near you with real-time information and directions
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLocate}
            disabled={loading}
            title={loading ? "Loading..." : "Find Polling Unit"}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-6 rounded-full h-[200px] w-[200px] text-2xl font-semibold shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 flex flex-col justify-center items-center gap-4 mx-auto disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            className="mt-12 grid grid-cols-3 gap-6 text-center"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="text-3xl font-bold text-emerald-500 mb-1">Fast</div>
              <div className="text-sm text-gray-600">Quick Search</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="text-3xl font-bold text-emerald-500 mb-1">Accurate</div>
              <div className="text-sm text-gray-600">Real Data</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-md">
              <div className="text-3xl font-bold text-emerald-500 mb-1">Easy</div>
              <div className="text-sm text-gray-600">Simple UI</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}

export default WelcomePage;
