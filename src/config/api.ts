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

import { OPTION_TRADING_API_REST_URL, OPTION_TRADING_API_WS_URL } from "@/config/constants";

const config: Record<string, ApiConfig> = {
  development: {
    ws: {
      baseUrl: OPTION_TRADING_API_WS_URL,
      publicPath: process.env.RSBUILD_WS_PUBLIC_PATH || '/ws',
      protectedPath: process.env.RSBUILD_WS_PROTECTED_PATH || '/ws'
    },
    sse: {
      baseUrl: OPTION_TRADING_API_REST_URL,
      publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || '/sse',
      protectedPath: process.env.RSBUILD_SSE_PROTECTED_PATH || '/protected/sse'
    },
    rest: {
      baseUrl: OPTION_TRADING_API_REST_URL
    }
  },
  staging: {
    ws: {
      baseUrl: OPTION_TRADING_API_WS_URL,
      publicPath: process.env.RSBUILD_WS_PUBLIC_PATH || '/ws',
      protectedPath: process.env.RSBUILD_WS_PROTECTED_PATH || '/ws'
    },
    sse: {
      baseUrl: OPTION_TRADING_API_REST_URL,
      publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || '/sse',
      protectedPath: process.env.RSBUILD_SSE_PROTECTED_PATH || '/sse'
    },
    rest: {
      baseUrl: OPTION_TRADING_API_REST_URL
    }
  },
  production: {
    ws: {
      baseUrl: OPTION_TRADING_API_WS_URL,
      publicPath: process.env.RSBUILD_WS_PUBLIC_PATH || '/ws',
      protectedPath: process.env.RSBUILD_WS_PROTECTED_PATH || '/ws'
    },
    sse: {
      baseUrl: OPTION_TRADING_API_REST_URL,
      publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || '/sse',
      protectedPath: process.env.RSBUILD_SSE_PROTECTED_PATH || '/sse'
    },
    rest: {
      baseUrl: OPTION_TRADING_API_REST_URL
    }
  }
};

const getConfig = () => {
  // In test environment, return the values from process.env directly
  if (process.env.NODE_ENV === 'test') {
    return {
      ws: {
        baseUrl: `${OPTION_TRADING_API_WS_URL}/ws`,
        publicPath: process.env.RSBUILD_WS_PUBLIC_PATH || '/ws',
        protectedPath: process.env.RSBUILD_WS_PROTECTED_PATH || '/ws'
      },
      sse: {
        baseUrl: `${OPTION_TRADING_API_REST_URL}`,
        publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || '/sse',
        protectedPath: process.env.RSBUILD_SSE_PROTECTED_PATH || '/sse'
      },
      rest: {
        baseUrl: `${OPTION_TRADING_API_REST_URL}`
      }
    };
  }

  // For other environments, use the environment-specific config
  const env = process.env.NODE_ENV || 'development';
  return config[env];
};

export const apiConfig = getConfig();
