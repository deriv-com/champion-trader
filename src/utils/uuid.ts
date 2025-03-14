/**
 * Generates a RFC4122 compliant UUID v4 using the Web Crypto API
 * Used for idempotency keys in API requests
 *
 * @returns A UUID string
 */
export const generateUUID = (): string => {
    // Use the built-in crypto.randomUUID() if available (modern browsers and Node.js 16+)
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    // Fallback for older browsers or environments without crypto.randomUUID
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
        // Create a typed array of 16 bytes (128 bits)
        const buffer = new Uint8Array(16);
        crypto.getRandomValues(buffer);

        // Set version (4) and variant (RFC4122)
        buffer[6] = (buffer[6] & 0x0f) | 0x40; // version 4
        buffer[8] = (buffer[8] & 0x3f) | 0x80; // variant RFC4122

        // Convert to hex string with proper formatting
        const hexCodes = [...buffer].map((value) => {
            const hexCode = value.toString(16);
            return hexCode.padStart(2, "0");
        });

        // Format as UUID (8-4-4-4-12)
        return [
            hexCodes.slice(0, 4).join(""),
            hexCodes.slice(4, 6).join(""),
            hexCodes.slice(6, 8).join(""),
            hexCodes.slice(8, 10).join(""),
            hexCodes.slice(10).join(""),
        ].join("-");
    }

    // Last resort fallback using Math.random (less secure, but works everywhere)
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
