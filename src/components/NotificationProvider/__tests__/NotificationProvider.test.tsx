import { render } from "@testing-library/react";
import { NotificationProvider } from "../NotificationProvider";
import { useNotificationStore } from "@/stores/notificationStore";
import type { NotificationStore } from "@/stores/notificationStore";

// Mock Toaster component
const mockToaster = jest.fn();
jest.mock("react-hot-toast", () => ({
    Toaster: (props: any) => {
        mockToaster(props);
        return null;
    },
}));

// Mock the store
jest.mock("@/stores/notificationStore");

// Type the mocked store
const mockedUseNotificationStore = useNotificationStore as jest.MockedFunction<
    typeof useNotificationStore
>;

describe("NotificationProvider", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup default mock implementation
        mockedUseNotificationStore.mockImplementation((selector) => {
            if (typeof selector === "function") {
                return selector({
                    config: {
                        position: "top-right",
                        duration: 4000,
                        className: "rounded-lg",
                    },
                } as NotificationStore);
            }
            return {} as NotificationStore;
        });
    });

    it("renders children", () => {
        const { getByText } = render(
            <NotificationProvider>
                <div>Test Child</div>
            </NotificationProvider>
        );

        expect(getByText("Test Child")).toBeInTheDocument();
    });

    it("configures Toaster with default config", () => {
        render(
            <NotificationProvider>
                <div>Test Child</div>
            </NotificationProvider>
        );

        expect(mockToaster).toHaveBeenCalledWith(
            expect.objectContaining({
                position: "top-right",
                toastOptions: expect.objectContaining({
                    duration: 4000,
                    className: "rounded-lg",
                    style: expect.objectContaining({
                        background: "#fff",
                        color: "#363636",
                        boxShadow:
                            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }),
                }),
            })
        );
    });

    it("configures Toaster with custom config", () => {
        const mockConfig = {
            position: "bottom-left" as const,
            duration: 5000,
            className: "custom-class",
        };

        mockedUseNotificationStore.mockImplementation((selector) => {
            if (typeof selector === "function") {
                return selector({
                    config: mockConfig,
                } as NotificationStore);
            }
            return {} as NotificationStore;
        });

        render(
            <NotificationProvider>
                <div>Test Child</div>
            </NotificationProvider>
        );

        expect(mockToaster).toHaveBeenCalledWith(
            expect.objectContaining({
                position: "bottom-left",
                toastOptions: expect.objectContaining({
                    duration: 5000,
                    className: "custom-class",
                }),
            })
        );
    });
});
