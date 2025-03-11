import "@testing-library/jest-dom";

import { apiConfig } from "./config/api";

// Set up environment variables for tests
process.env.NODE_ENV = "development";
process.env.RSBUILD_WS_URL = apiConfig.ws.baseUrl;
process.env.RSBUILD_WS_PUBLIC_PATH = apiConfig.ws.publicPath;
process.env.RSBUILD_WS_PROTECTED_PATH = apiConfig.ws.protectedPath;
process.env.MODE = "test";

// Mock TextEncoder/TextDecoder for React Router
class TextEncoderMock {
    encode(str: string): Uint8Array {
        return new Uint8Array([...str].map((c) => c.charCodeAt(0)));
    }
}

class TextDecoderMock {
    decode(arr: Uint8Array): string {
        return String.fromCharCode(...arr);
    }
}

global.TextEncoder = TextEncoderMock as any;
global.TextDecoder = TextDecoderMock as any;
