import { env } from './env';

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
      baseUrl: env.WS_URL || 'wss://options-trading-api.deriv.ai',
      publicPath: env.WS_PUBLIC_PATH || '/ws',
      protectedPath: env.WS_PROTECTED_PATH || '/ws'
    },
    rest: {
      baseUrl: env.REST_URL || 'https://options-trading-api.deriv.ai'
    }
  },
  staging: {
    ws: {
      baseUrl: env.WS_URL || 'wss://staging-api.deriv.com',
      publicPath: env.WS_PUBLIC_PATH || '/ws',
      protectedPath: env.WS_PROTECTED_PATH || '/ws'
    },
    rest: {
      baseUrl: env.REST_URL || 'https://staging-api.deriv.com'
    }
  },
  production: {
    ws: {
      baseUrl: env.WS_URL || 'wss://api.deriv.com',
      publicPath: env.WS_PUBLIC_PATH || '/ws',
      protectedPath: env.WS_PROTECTED_PATH || '/ws'
    },
    rest: {
      baseUrl: env.REST_URL || 'https://api.deriv.com'
    }
  }
};

const getConfig = () => {
  // In test environment, return the values from env directly
  if (env.MODE === 'test') {
    return {
      ws: {
        baseUrl: env.WS_URL || 'wss://options-trading-api.deriv.ai/ws',
        publicPath: env.WS_PUBLIC_PATH || '/ws',
        protectedPath: env.WS_PROTECTED_PATH || '/ws'
      },
      rest: {
        baseUrl: env.REST_URL || 'https://options-trading-api.deriv.ai'
      }
    };
  }

  // For other environments, use the environment-specific config
  return config[env.MODE];
};

export const apiConfig = getConfig();
