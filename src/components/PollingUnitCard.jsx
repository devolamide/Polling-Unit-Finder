import { MapPin, Navigation2, Building2, Map } from "lucide-react";
import { motion } from "motion/react";

export function PollingUnitCard({ unit, isSelected, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-emerald-50 border-2 border-emerald-500 shadow-lg"
          : "border-2 border-gray-200 hover:border-emerald-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div
          className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
            isSelected ? "bg-emerald-500" : ""
          }`}
        >
          <MapPin
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              isSelected ? "text-white" : "text-emerald-600"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2">
            {unit.name}
          </h3>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-start gap-1.5 sm:gap-2">
              <Map className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-gray-600 flex-1 min-w-0">
                <div className="font-medium line-clamp-2">{unit.registrationArea}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-gray-600 truncate">
                {unit.localGovernment}, {unit.state}
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Navigation2
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${
                  isSelected ? "text-emerald-500" : "text-gray-400"
                }`}
              />
              <div
                className={`text-xs sm:text-sm font-medium ${
                  isSelected ? "text-emerald-600" : "text-gray-600"
                }`}
              >
                {unit.walkingDistance}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
