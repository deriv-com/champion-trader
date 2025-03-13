declare namespace NodeJS {
    interface ProcessEnv {
        RSBUILD_REST_URL: string;
        RSBUILD_SSE_PUBLIC_PATH: string;
        MODE: string;
    }
}

export {};
