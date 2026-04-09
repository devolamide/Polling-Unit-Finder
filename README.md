# INEC Polling Unit Finder

A modern, interactive React application that helps Nigerian voters find the nearest INEC (Independent National Electoral Commission) polling units based on their current location.

## Features

- **Location-based Search**: Automatically detects user location and finds the 5 closest polling units
- **Interactive Map**: Visualizes user location and all polling units on an OpenStreetMap with custom markers
- **Walking Distance**: Calculates actual walking routes and distances using OSRM routing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Fast Performance**: Built with Vite for lightning-fast development and optimized builds
- **Modern UI**: Clean design with smooth animations powered by Framer Motion
- **Custom Typography**: Work Sans for headings and DM Sans for body text

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Leaflet** - Interactive maps powered by OpenStreetMap
- **OSRM** - Open Source Routing Machine for walking distance calculations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd inec-polling-finder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## How It Works

1. **Welcome Page**: User is greeted with a clean interface and a "Start" button with thumbprint loading animation
2. **Location Detection**: App requests user's browser location (with permission)
3. **Data Processing**: 
   - Loads polling unit data from `data.json`
   - Calculates straight-line distances to all polling units
   - Selects the 10 closest units
   - Queries OSRM API for actual walking distances
   - Sorts by walking distance and returns top 5
4. **Results Display**: 
   - Shows an interactive map with user location (blue marker) and all 5 polling units (green markers)
   - Lists polling units with detailed information
   - Displays walking distance and estimated time for each unit

## Data Structure

The application uses polling unit data with the following structure:

```json
{
  "state": "ABIA",
  "localGovernment": "01 - ABA NORTH",
  "registrationArea": "01 - EZIAMA",
  "pollingUnit": "023 - EZIAMA CENTRAL SCHOOL",
  "longitude": "7.375",
  "latitude": "5.129",
  "googleMapUrl": "..."
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for use in promoting civic engagement and democratic participation in Nigeria.

## Credits

- Map data © [OpenStreetMap](https://www.openstreetmap.org/) contributors
- Routing powered by [OSRM](http://project-osrm.org/)
- Built with ❤️ for Nigerian voters
- Powered by Clique Technologiess

## Support

Found this useful? [Buy me a coffee](https://selar.com/showlove/yinkash) ☕
