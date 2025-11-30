// Configuration for The Besties Website
// Auto-detects environment (GitHub Pages vs Localhost)

(function() {
  'use strict';

  // Detect if running on GitHub Pages
  const isGitHubPages = window.location.hostname === 'lyonmartinez.github.io' || 
                        window.location.hostname.includes('github.io');

  // Backend API URL
  // For GitHub Pages: Update this to your deployed backend URL (Render, Railway, etc.)
  // For localhost: Uses local backend server
  const API_BASE_URL = isGitHubPages 
    ? 'https://thebesties-backend.onrender.com/api'  // Update this to your backend URL
    : 'http://localhost:5000/api';

  // Website base URL
  const BASE_URL = isGitHubPages
    ? 'https://lyonmartinez.github.io/thebesties'
    : 'http://localhost:5000';

  // Export to window object for global access
  window.APP_CONFIG = {
    API_URL: API_BASE_URL,
    BASE_URL: BASE_URL,
    IS_PRODUCTION: isGitHubPages,
    IS_LOCALHOST: !isGitHubPages
  };

  // Log config in development
  if (!isGitHubPages) {
    console.log('🔧 Development Mode');
    console.log('📍 API URL:', API_BASE_URL);
    console.log('📍 Base URL:', BASE_URL);
  } else {
    console.log('🌐 Production Mode (GitHub Pages)');
    console.log('📍 API URL:', API_BASE_URL);
  }
})();

