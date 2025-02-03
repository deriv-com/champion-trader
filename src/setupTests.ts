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

// Mock WebSocket
class WebSocketMock {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  public readyState: number = WebSocketMock.CONNECTING;
  public url: string;
  private handlers: { [key: string]: Function[] } = {
    open: [],
    close: [],
    error: [],
    message: [],
  };

  constructor(_url: string) {
    this.url = _url;
    setTimeout(() => {
      this.readyState = WebSocketMock.OPEN;
      this.triggerEvent("open", new Event("open"));
    }, 0);
  }

  addEventListener(type: string, listener: Function): void {
    if (!this.handlers[type]) {
      this.handlers[type] = [];
    }
    this.handlers[type].push(listener);
  }

  removeEventListener(type: string, listener: Function): void {
    if (!this.handlers[type]) return;
    const index = this.handlers[type].indexOf(listener);
    if (index > -1) {
      this.handlers[type].splice(index, 1);
    }
  }

  triggerEvent(event: string, data: any) {
    if (!this.handlers[event]) return;
    this.handlers[event].forEach((handler) => {
      handler.call(this, data);
    });
  }

  send = jest.fn();
  close = jest.fn();
}

global.WebSocket = WebSocketMock as any;
