declare namespace NodeJS {
  interface ProcessEnv {
    VITE_WS_URL: string;
    VITE_WS_PUBLIC_PATH: string;
    VITE_WS_PROTECTED_PATH: string;
    MODE: string;
  }
}

export {};
