/// <reference types="@rsbuild/core/types" />

declare namespace NodeJS {
  interface ProcessEnv {
    RSBUILD_WS_URL: string;
    RSBUILD_WS_PUBLIC_PATH: string;
    RSBUILD_WS_PROTECTED_PATH: string;
  }
}
