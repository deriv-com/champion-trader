import "@testing-library/jest-dom";

// Set up environment variables for tests
process.env.NODE_ENV = "development";
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
