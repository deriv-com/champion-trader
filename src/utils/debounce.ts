/**
 * Creates a debounced version of a function that delays its execution until after
 * a specified delay has elapsed since the last time it was called.
 *
 * @param callback The function to debounce
 * @param delay The delay in milliseconds (default: 500ms)
 * @returns A debounced version of the callback function
 *
 * @example
 * const debouncedFn = debounce((value: string) => {
 *   console.log(value);
 * }, 300);
 *
 * // Call multiple times rapidly
 * debouncedFn("test1");
 * debouncedFn("test2");
 * debouncedFn("test3");
 * // Only the last call with "test3" will be executed after 300ms
 */
export function debounce<T extends (...args: any[]) => void>(
    callback: T,
    delay: number = 500
): (...args: Parameters<T>) => () => void {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>): (() => void) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);

        // Return cleanup function
        return () => {
            clearTimeout(timeoutId);
        };
    };
}
