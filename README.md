# 🚗 Motolog - Vehicle Trip Logger

A modern web application for logging and tracking vehicle trips with automatic distance calculation and interactive maps.

## 🏗️ Architecture

### Server (MVC Pattern)
```
server/
├── config/                 # Configuration files
│   ├── database.js        # Database connection
│   └── constants.js       # App constants
├── controllers/           # Business logic (Controllers)
│   └── tripController.js  # Trip operations
├── models/               # Data models (Models)
│   ├── Trip.js          # Trip schema
│   └── vehicle.js       # Vehicle schema
├── routes/              # API routes (Views)
│   ├── auth.js         # Authentication routes
│   ├── trip.js         # Trip routes
│   └── vehicle.js      # Vehicle routes
├── middleware/          # Custom middleware
│   └── auth.js         # Authentication middleware
├── utils/              # Utility functions
│   ├── geocoding.js    # Geocoding utilities
│   └── validation.js   # Validation helpers
└── server.js           # Main server file
```

### Client (Clean Architecture)
```
client/src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   │   ├── Toast.jsx   # Toast notifications
│   │   └── Spinner.jsx # Loading spinner
│   ├── forms/          # Form components
│   │   ├── TripForm.jsx
│   │   └── VehicleForm.jsx
│   ├── maps/           # Map components
│   │   ├── TripMap.jsx
│   │   └── TripMapPreview.jsx
│   └── layout/         # Layout components
│       └── Sidebar.jsx
├── hooks/              # Custom React hooks
│   ├── useTrips.js     # Trip state management
│   ├── useVehicles.js  # Vehicle state management
│   └── useToast.js     # Toast notifications
├── services/           # API services
│   └── api.js         # API client
├── pages/             # Page components
│   ├── Homepage.jsx
│   └── SignIn.jsx
├── utils/             # Utility functions
├── styles/            # CSS and styling
└── main.jsx          # App entry point
```

## 🚀 Features

### ✅ Core Features
- **Vehicle Management**: Add, edit, and delete vehicles
- **Trip Logging**: Log trips with automatic distance calculation
- **Interactive Maps**: View trip routes with external map integration
- **User Authentication**: Secure user management with Clerk
- **Real-time Updates**: Live data synchronization

### 🗺️ Map Features
- **Route Visualization**: Interactive trip route display
- **External Maps**: One-click access to Google Maps, Apple Maps, OpenStreetMap
- **Automatic Geocoding**: Real-time location coordinate lookup
- **Distance Calculation**: Accurate distance using Haversine formula

### 📊 Data Management
- **Automatic Distance**: Calculated from start/end locations
- **Trip History**: Complete trip tracking and history
- **Vehicle Profiles**: Detailed vehicle information
- **User Profiles**: Personalized user experience

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Nominatim** - Geocoding service

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Clerk** - Authentication
- **React Hooks** - State management

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd motolog
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Server (.env)
   MONGODB_URI=your_mongodb_connection_string
   BACKEND_JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=http://localhost:5173

   # Client (.env)
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   ```

4. **Start the application**
   ```bash
   # Start server (from server directory)
   npm start

   # Start client (from client directory)
   npm run dev
   ```

## 🔧 API Endpoints

### Trips
- `GET /api/trip` - Get user trips
- `GET /api/trip/:id` - Get specific trip
- `POST /api/trip` - Create new trip
- `PUT /api/trip/:id` - Update trip
- `DELETE /api/trip/:id` - Delete trip
- `GET /api/trip/test/geocode` - Test geocoding

### Vehicles
- `GET /api/vehicle` - Get user vehicles
- `POST /api/vehicle` - Create vehicle
- `PUT /api/vehicle/:id` - Update vehicle
- `DELETE /api/vehicle/:id` - Delete vehicle

### Authentication
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

## 🎯 Usage

### Adding a Vehicle
1. Navigate to "My Vehicles" tab
2. Click "Add Vehicle"
3. Fill in vehicle details
4. Save vehicle

### Logging a Trip
1. Navigate to "My Trips" tab
2. Click "Log New Trip"
3. Select vehicle
4. Enter start/end locations
5. Set trip times
6. Add optional details (description, rating, images)
7. Save trip

### Viewing Trip Map
1. Click "🗺️ View Map" on any trip card
2. Interactive map opens with route
3. Click external map buttons to open in navigation apps

## 🔒 Security

- **JWT Authentication** - Secure API access
- **Input Validation** - Server-side validation
- **CORS Protection** - Cross-origin security
- **Environment Variables** - Secure configuration
- **Error Handling** - Comprehensive error management

## 📈 Performance

- **Lazy Loading** - Components load on demand
- **Optimized Queries** - Efficient database operations
- **Caching** - API response caching
- **Compression** - Response compression
- **CDN Ready** - Static asset optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@motolog.com or create an issue in the repository.

---

**Built with ❤️ using modern web technologies** 