import { MapPin, Navigation2, Building2, Map } from "lucide-react";
import { motion } from "motion/react";

export function PollingUnitCard({ unit, isSelected, onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onClick={onSelect}
      className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-emerald-50 border-2 border-emerald-500 shadow-lg"
          : "border-2 border-gray-200 hover:border-emerald-200 hover:shadow-md"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${
            isSelected ? "bg-emerald-500" : ""
          }`}
        >
          <MapPin
            className={`w-5 h-5 ${
              isSelected ? "text-white" : "text-emerald-600"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-2 truncate">
            {unit.name}
          </h3>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Map className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600 flex-1">
                <div className="font-medium">{unit.registrationArea}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                {unit.localGovernment}, {unit.state}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Navigation2
                className={`w-4 h-4 flex-shrink-0 ${
                  isSelected ? "text-emerald-500" : "text-gray-400"
                }`}
              />
              <div
                className={`text-sm font-medium ${
                  isSelected ? "text-emerald-600" : "text-gray-600"
                }`}
              >
                {unit.walkingDistance}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-emerald-200"
        >
          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            <Navigation2 className="w-4 h-4" />
            Get Directions
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
