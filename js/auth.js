// Authentication utilities for The Besties Website
(function() {
  'use strict';

  // Get API URL from config
  const getAPIUrl = () => {
    if (window.APP_CONFIG && window.APP_CONFIG.API_URL) {
      return window.APP_CONFIG.API_URL;
    }
    return 'http://localhost:5000/api';
  };

  // Get Discord config from backend
  const getDiscordConfig = async () => {
    try {
      const response = await fetch(`${getAPIUrl()}/auth/discord-config`);
      
      // Check if backend is not running
      if (!response.ok && response.status === 0) {
        throw new Error('BACKEND_NOT_RUNNING');
      }
      
      const data = await response.json();
      
      // Check if Discord Client ID is not configured
      if (!data.clientId) {
        throw new Error('DISCORD_CLIENT_ID_NOT_CONFIGURED');
      }
      
      return {
        clientId: data.clientId || '',
        redirectUri: data.redirectUri || window.APP_CONFIG?.DISCORD_REDIRECT_URI || ''
      };
    } catch (error) {
      console.error('Error fetching Discord config:', error);
      
      // Check if it's a network error (backend not running)
      if (error.message === 'BACKEND_NOT_RUNNING' || 
          error.message.includes('Failed to fetch') || 
          error.name === 'TypeError') {
        throw new Error('BACKEND_NOT_RUNNING');
      }
      
      // Discord Client ID not configured
      if (error.message === 'DISCORD_CLIENT_ID_NOT_CONFIGURED') {
        throw new Error('DISCORD_CLIENT_ID_NOT_CONFIGURED');
      }
      
      return {
        clientId: '',
        redirectUri: window.APP_CONFIG?.DISCORD_REDIRECT_URI || ''
      };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    try {
      // Basic JWT validation (check if expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  };

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  };

  // Save authentication data
  const saveAuth = (token, user) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // Clear authentication data
  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };

  // Redirect to appropriate dashboard based on role
  const redirectToDashboard = (user) => {
    if (!user || !user.role) {
      window.location.href = './login.html';
      return;
    }

    if (user.role === 'leader') {
      window.location.href = './leader-dashboard.html';
    } else {
      window.location.href = './member-dashboard.html';
    }
  };

  // Discord OAuth2 Login (redirect to Discord)
  const discordOAuth2Login = async () => {
    try {
      const config = await getDiscordConfig();
      
      if (!config.clientId) {
        throw new Error('DISCORD_CLIENT_ID_NOT_CONFIGURED');
      }

      const redirectUri = encodeURIComponent(config.redirectUri);
      const scope = encodeURIComponent('identify email');
      const responseType = 'code';
      const state = Math.random().toString(36).substring(2, 15); // CSRF protection
      
      // Save state for verification
      sessionStorage.setItem('discord_oauth_state', state);

      const discordAuthUrl = `https://discord.com/api/oauth2/authorize?` +
        `client_id=${config.clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `response_type=${responseType}&` +
        `scope=${scope}&` +
        `state=${state}`;

      window.location.href = discordAuthUrl;
    } catch (error) {
      console.error('Discord OAuth2 login error:', error);
      throw error;
    }
  };

  // Handle Discord OAuth2 callback
  const handleDiscordCallback = async (code, state) => {
    try {
      // Verify state
      const savedState = sessionStorage.getItem('discord_oauth_state');
      if (state !== savedState) {
        throw new Error('Invalid state parameter. Possible CSRF attack.');
      }
      sessionStorage.removeItem('discord_oauth_state');

      // Exchange code for token
      const response = await fetch(`${getAPIUrl()}/auth/discord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Discord login failed');
      }

      // Save auth data
      saveAuth(data.token, data.user);

      // Redirect to dashboard
      redirectToDashboard(data.user);
    } catch (error) {
      console.error('Discord callback error:', error);
      throw error;
    }
  };

  // Discord Bot Verification Login
  const createVerificationCode = async () => {
    try {
      const response = await fetch(`${getAPIUrl()}/auth/discord/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Không thể tạo verification code');
      }

      return {
        code: data.code,
        expiresIn: data.expiresIn || 300
      };
    } catch (error) {
      console.error('Error creating verification code:', error);
      throw error;
    }
  };

  // Check verification status
  const checkVerification = async (code) => {
    try {
      const response = await fetch(`${getAPIUrl()}/auth/discord/check-verification?code=${code}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (data.success && data.verified) {
        // Save auth data
        saveAuth(data.token, data.user);
        return {
          verified: true,
          user: data.user,
          token: data.token
        };
      }

      return {
        verified: false,
        error: data.error
      };
    } catch (error) {
      console.error('Error checking verification:', error);
      return {
        verified: false,
        error: error.message
      };
    }
  };

  // Make authenticated API request
  const apiRequest = async (url, options = {}) => {
    const token = localStorage.getItem('auth_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${getAPIUrl()}${url}`, {
      ...options,
      headers
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      clearAuth();
      if (window.location.pathname.includes('dashboard')) {
        window.location.href = './login.html';
      }
      throw new Error('Session expired. Please login again.');
    }

    return response;
  };

  // Export to window object
  window.Auth = {
    isAuthenticated,
    getCurrentUser,
    saveAuth,
    clearAuth,
    redirectToDashboard,
    discordOAuth2Login,
    handleDiscordCallback,
    createVerificationCode,
    checkVerification,
    apiRequest,
    getAPIUrl
  };
})();

