interface ApiConfig {
  ws: {
    baseUrl: string;
    publicPath: string;
    protectedPath: string;
  };
  rest: {
    baseUrl: string;
  };
}

const config: Record<string, ApiConfig> = {
  development: {
    ws: {
      baseUrl: process.env.VITE_WS_URL || 'ws://localhost:8080',
      publicPath: process.env.VITE_WS_PUBLIC_PATH || '/ws',
      protectedPath: process.env.VITE_WS_PROTECTED_PATH || '/protected/ws'
    },
    rest: {
      baseUrl: process.env.VITE_REST_URL || 'http://localhost:8080'
    }
  },
  staging: {
    ws: {
      baseUrl: process.env.VITE_WS_URL || 'wss://staging-api.deriv.com',
      publicPath: process.env.VITE_WS_PUBLIC_PATH || '/ws',
      protectedPath: process.env.VITE_WS_PROTECTED_PATH || '/protected/ws'
    },
    rest: {
      baseUrl: process.env.VITE_REST_URL || 'https://staging-api.deriv.com'
    }
  },
  production: {
    ws: {
      baseUrl: process.env.VITE_WS_URL || 'wss://api.deriv.com',
      publicPath: process.env.VITE_WS_PUBLIC_PATH || '/ws',
      protectedPath: process.env.VITE_WS_PROTECTED_PATH || '/protected/ws'
    },
    rest: {
      baseUrl: process.env.VITE_REST_URL || 'https://api.deriv.com'
    }
  }
};

const getConfig = () => {
  // In test environment, return the values from process.env directly
  if (process.env.NODE_ENV === 'test') {
    return {
      ws: {
        baseUrl: process.env.VITE_WS_URL || 'ws://localhost:8080',
        publicPath: process.env.VITE_WS_PUBLIC_PATH || '/ws',
        protectedPath: process.env.VITE_WS_PROTECTED_PATH || '/protected/ws'
      },
      rest: {
        baseUrl: process.env.VITE_REST_URL || 'http://localhost:8080'
      }
    };
  }

  // For other environments, use the environment-specific config
  const env = process.env.NODE_ENV || 'development';
  return config[env];
};

export const apiConfig = getConfig();
