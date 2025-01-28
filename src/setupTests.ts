import '@testing-library/jest-dom';

// Mock TextEncoder/TextDecoder for React Router
class TextEncoderMock {
  encode(str: string): Uint8Array {
    return new Uint8Array([...str].map(c => c.charCodeAt(0)));
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

  public readyState = WebSocketMock.CONNECTING;
  public url: string;
  private handlers: { [key: string]: ((event: any) => void)[] } = {};

  constructor(url: string) {
    this.url = url;
    setTimeout(() => {
      this.readyState = WebSocketMock.OPEN;
      this.triggerEvent('open', new Event('open'));
    }, 0);
  }

  addEventListener(event: string, handler: (event: any) => void) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  removeEventListener(event: string, handler: (event: any) => void) {
    if (this.handlers[event]) {
      this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }
  }

  send(data: string) {
    if (this.readyState !== WebSocketMock.OPEN) {
      throw new Error('WebSocket is not open');
    }
    // Simulate message echo for testing
    this.triggerEvent('message', new MessageEvent('message', { data }));
  }

  close() {
    this.readyState = WebSocketMock.CLOSED;
    this.triggerEvent('close', new CloseEvent('close'));
  }

  private triggerEvent(event: string, data: any) {
    if (this.handlers[event]) {
      this.handlers[event].forEach(handler => handler(data));
    }
  }
}

global.WebSocket = WebSocketMock as any;
