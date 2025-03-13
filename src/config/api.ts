interface ApiConfig {
    sse: {
        baseUrl: string;
        publicPath: string;
    };
    rest: {
        baseUrl: string;
    };
}

import { OPTION_TRADING_API_REST_URL } from "@/config/constants";

const config: Record<string, ApiConfig> = {
    development: {
        sse: {
            baseUrl: OPTION_TRADING_API_REST_URL,
            publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || "/sse",
        },
        rest: {
            baseUrl: OPTION_TRADING_API_REST_URL,
        },
    },
    staging: {
        sse: {
            baseUrl: OPTION_TRADING_API_REST_URL,
            publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || "/sse",
        },
        rest: {
            baseUrl: OPTION_TRADING_API_REST_URL,
        },
    },
    production: {
        sse: {
            baseUrl: OPTION_TRADING_API_REST_URL,
            publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || "/sse",
        },
        rest: {
            baseUrl: OPTION_TRADING_API_REST_URL,
        },
    },
};

const getConfig = () => {
    // In test environment, return the values from process.env directly
    if (process.env.NODE_ENV === "test") {
        return {
            sse: {
                baseUrl: `${OPTION_TRADING_API_REST_URL}`,
                publicPath: process.env.RSBUILD_SSE_PUBLIC_PATH || "/sse",
            },
            rest: {
                baseUrl: `${OPTION_TRADING_API_REST_URL}`,
            },
        };
    }

    // For other environments, use the environment-specific config
    const env = process.env.NODE_ENV || "development";
    return config[env];
};

export const apiConfig = getConfig();
