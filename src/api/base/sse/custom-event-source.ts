export class CustomEventSource implements EventSource {
    private _url: string;
    private headers: Record<string, string>;
    private abortController: AbortController | null = null;
    private _readyState: number = 0;

    readonly CONNECTING = 0;
    readonly OPEN = 1;
    readonly CLOSED = 2;

    onopen: ((this: EventSource, ev: Event) => any) | null = null;
    onmessage: ((this: EventSource, ev: MessageEvent) => any) | null = null;
    onerror: ((this: EventSource, ev: Event) => any) | null = null;

    constructor(url: string, options?: { headers?: Record<string, string> }) {
        this._url = url;
        this.headers = {
            Accept: "text/event-stream",
            "Cache-Control": "no-cache",
            "Content-Type": "text/event-stream",
            ...options?.headers,
        };
        this.connect();
    }

    private async connect() {
        if (this.abortController) {
            return;
        }

        this._readyState = this.CONNECTING;
        this.abortController = new AbortController();

        try {
            const response = await fetch(this._url, {
                method: "GET",
                headers: this.headers,
                signal: this.abortController.signal,
                cache: "no-store",
                credentials: "same-origin",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (!response.body) {
                throw new Error("Response body is null");
            }

            this._readyState = this.OPEN;
            const openEvent = new Event("open");
            if (this.onopen) {
                this.onopen.call(this as unknown as EventSource, openEvent);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (line.trim()) {
                        const messageEvent = new MessageEvent("message", {
                            data: line.replace(/^data: /, ""),
                        });
                        if (this.onmessage) {
                            this.onmessage.call(this as unknown as EventSource, messageEvent);
                        }
                    }
                }
            }
        } catch (error: unknown) {
            if (error instanceof Error && error.name === "AbortError") {
                // Connection was intentionally closed
                return;
            }
            this._readyState = this.CLOSED;
            const errorEvent = new Event("error");
            if (this.onerror) {
                this.onerror.call(this as unknown as EventSource, errorEvent);
            }
        }
    }

    close(): void {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
        this._readyState = this.CLOSED;
    }

    get readyState(): number {
        return this._readyState;
    }

    get url(): string {
        return this._url;
    }

    get withCredentials(): boolean {
        return false;
    }

    addEventListener<K extends keyof EventSourceEventMap>(
        type: K,
        listener: (this: EventSource, ev: EventSourceEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        _options?: boolean | AddEventListenerOptions
    ): void {
        if (typeof listener !== "function") return;

        switch (type) {
            case "message":
                this.onmessage = listener as (this: EventSource, ev: MessageEvent) => any;
                break;
            case "error":
                this.onerror = listener as (this: EventSource, ev: Event) => any;
                break;
            case "open":
                this.onopen = listener as (this: EventSource, ev: Event) => any;
                break;
        }
    }

    removeEventListener<K extends keyof EventSourceEventMap>(
        type: K,
        listener: (this: EventSource, ev: EventSourceEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        _options?: boolean | EventListenerOptions
    ): void {
        switch (type) {
            case "message":
                if (this.onmessage === listener) this.onmessage = null;
                break;
            case "error":
                if (this.onerror === listener) this.onerror = null;
                break;
            case "open":
                if (this.onopen === listener) this.onopen = null;
                break;
        }
    }

    dispatchEvent(_event: Event): boolean {
        return true;
    }
}
