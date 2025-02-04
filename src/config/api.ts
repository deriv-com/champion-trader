interface ApiConfig {
  ws: {
    baseUrl: string;
    publicPath: string;
    protectedPath: string;
  };
  sse: {
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
      baseUrl: process.env.RSBUILD_WS_URL || 'wss://options-trading-api.deriv.ai',
      publicPath: process.env.RSBUILD_WS_PUBLIC_PATH || '/ws',
      protectedPath: process.env.RSBUILD_WS_PROTECTED_PATH || '/ws'
    },
    sse: {
      baseUrl: process.env.RSBUILD_REST_URL || 'https://options-trading-api.deriv.ai',
      publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || '/sse',
      protectedPath: process.env.RSBUILD_SSE_PROTECTED_PATH || '/sse'
    },
    rest: {
      baseUrl: process.env.RSBUILD_REST_URL || 'https://options-trading-api.deriv.ai'
    }
  },
  staging: {
    ws: {
      baseUrl: process.env.RSBUILD_WS_URL || 'wss://options-trading-api.deriv.ai',
      publicPath: process.env.RSBUILD_WS_PUBLIC_PATH || '/ws',
      protectedPath: process.env.RSBUILD_WS_PROTECTED_PATH || '/ws'
    },
    sse: {
      baseUrl: process.env.RSBUILD_REST_URL || 'https://options-trading-api.deriv.ai',
      publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || '/sse',
      protectedPath: process.env.RSBUILD_SSE_PROTECTED_PATH || '/sse'
    },
    rest: {
      baseUrl: process.env.RSBUILD_REST_URL || 'https://options-trading-api.deriv.ai'
    }
  },
  production: {
    ws: {
      baseUrl: process.env.RSBUILD_WS_URL || 'wss://options-trading-api.deriv.ai',
      publicPath: process.env.RSBUILD_WS_PUBLIC_PATH || '/ws',
      protectedPath: process.env.RSBUILD_WS_PROTECTED_PATH || '/ws'
    },
    sse: {
      baseUrl: process.env.RSBUILD_REST_URL || 'https://options-trading-api.deriv.ai',
      publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || '/sse',
      protectedPath: process.env.RSBUILD_SSE_PROTECTED_PATH || '/sse'
    },
    rest: {
      baseUrl: process.env.RSBUILD_REST_URL || 'https://options-trading-api.deriv.ai'
    }
  }
};

const getConfig = () => {
  // In test environment, return the values from process.env directly
  if (process.env.NODE_ENV === 'test') {
    return {
      ws: {
        baseUrl: process.env.RSBUILD_WS_URL || 'wss://options-trading-api.deriv.ai/ws',
        publicPath: process.env.RSBUILD_WS_PUBLIC_PATH || '/ws',
        protectedPath: process.env.RSBUILD_WS_PROTECTED_PATH || '/ws'
      },
      sse: {
        baseUrl: process.env.RSBUILD_REST_URL || 'https://options-trading-api.deriv.ai',
        publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || '/sse',
        protectedPath: process.env.RSBUILD_SSE_PROTECTED_PATH || '/sse'
      },
      rest: {
        baseUrl: process.env.RSBUILD_REST_URL || 'https://options-trading-api.deriv.ai'
      }
    };
  }

  // For other environments, use the environment-specific config
  const env = process.env.NODE_ENV || 'development';
  return config[env];
};

export const apiConfig = getConfig();
