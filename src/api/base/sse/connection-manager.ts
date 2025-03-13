/**
 * SSE Connection Manager
 *
 * Manages SSE connections to ensure only one connection exists per endpoint.
 * When a new connection is created for an endpoint that already has an active connection,
 * the old connection is automatically closed.
 */

/**
 * Type definition for a cleanup function that closes an SSE connection
 */
export type ConnectionCleanup = () => void;

/**
 * Singleton class to manage SSE connections
 */
class SSEConnectionManager {
    // Map to store active connections with base URL as key and cleanup function as value
    private connections: Map<string, ConnectionCleanup> = new Map();

    /**
     * Get the base URL without query parameters
     * @param url Full URL including query parameters
     * @returns Base URL without query parameters
     */
    /**
     * Get the normalized base URL without query parameters
     * This ensures consistent URL handling for connection management
     * @param url Full URL including query parameters
     * @returns Normalized base URL without query parameters
     */
    private getBaseUrl(url: string): string {
        try {
            const urlObj = new URL(url);

            // Normalize the pathname (remove trailing slash if present)
            let pathname = urlObj.pathname;
            if (pathname.endsWith("/") && pathname.length > 1) {
                pathname = pathname.slice(0, -1);
            }

            // Create normalized base URL
            const baseUrl = `${urlObj.protocol}//${urlObj.host}${pathname}`;

            return baseUrl;
        } catch (error) {
            // If URL parsing fails, return the original URL
            console.error("Failed to parse URL:", error);
            return url;
        }
    }

    /**
     * Register a new connection
     * @param url Full URL of the connection
     * @param cleanup Cleanup function to close the connection
     * @returns The registered cleanup function
     */
    public register(url: string, cleanup: ConnectionCleanup): ConnectionCleanup {
        const baseUrl = this.getBaseUrl(url);

        // Close existing connection if it exists
        this.closeExistingConnection(baseUrl);

        // Store the new connection
        this.connections.set(baseUrl, cleanup);

        // Return a wrapped cleanup function that also removes the connection from the manager
        return () => {
            try {
                // Call the cleanup function
                if (cleanup && typeof cleanup === "function") {
                    cleanup();
                }

                // Remove the connection from the manager
                this.connections.delete(baseUrl);
            } catch (error) {
                console.error("Error during connection cleanup:", error);
            }
        };
    }

    /**
     * Close an existing connection for a given URL
     * @param baseUrl Base URL of the connection to close
     */
    public closeExistingConnection(baseUrl: string): void {
        const existingCleanup = this.connections.get(baseUrl);

        if (existingCleanup) {
            try {
                // Call the cleanup function
                if (existingCleanup && typeof existingCleanup === "function") {
                    existingCleanup();
                }

                // Remove the connection from the manager
                this.connections.delete(baseUrl);
            } catch (error) {
                console.error("Error during connection cleanup:", error);
            }
        }
    }

    /**
     * Get the number of active connections (for testing/debugging)
     */
    public getConnectionCount(): number {
        return this.connections.size;
    }

    /**
     * Reset all connections (for testing purposes)
     */
    public reset(): void {
        // Close all active connections
        this.connections.forEach((cleanup) => cleanup());
        // Clear the connections map
        this.connections.clear();
    }
}

// Export a singleton instance
export const connectionManager = new SSEConnectionManager();
