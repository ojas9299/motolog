module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // JWT Configuration
  JWT_SECRET: process.env.BACKEND_JWT_SECRET,
  
  // Geocoding Configuration
  GEOCODING_USER_AGENT: 'Motolog/1.0',
  
  // API Rate Limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
}; 