import { create } from "zustand";
import toast from "react-hot-toast";
import { NotificationStore } from "../notificationStore";

// Create interface for mocked toast functions
interface MockToast extends jest.Mock {
    success: jest.Mock;
    error: jest.Mock;
    promise: jest.Mock;
}

// Mock react-hot-toast
jest.mock("react-hot-toast", () => {
    const mockToast: MockToast = Object.assign(jest.fn(), {
        success: jest.fn(),
        error: jest.fn(),
        promise: jest.fn(),
    });
    return {
        __esModule: true,
        default: mockToast,
    };
});

const createTestStore = () => {
    const defaultConfig = {
        position: "top-right" as const,
        duration: 4000,
        className: "rounded-lg",
    };

    return create<NotificationStore>((set, get) => ({
        config: defaultConfig,
        setConfig: (newConfig) => {
            const currentConfig = get().config;
            set({ config: { ...currentConfig, ...newConfig } });
        },
        success: (message, description) => {
            const { config } = get();
            toast.success(description ? `${message}\n${description}` : message, {
                ...config,
                className: `${config.className} bg-green-50`,
            });
        },
        error: (message, description) => {
            const { config } = get();
            toast.error(description ? `${message}\n${description}` : message, {
                ...config,
                className: `${config.className} bg-red-50`,
            });
        },
        info: (message, description) => {
            const { config } = get();
            toast(description ? `${message}\n${description}` : message, {
                ...config,
                className: `${config.className} bg-blue-50`,
                icon: "🔵",
            });
        },
        warning: (message, description) => {
            const { config } = get();
            toast(description ? `${message}\n${description}` : message, {
                ...config,
                className: `${config.className} bg-yellow-50`,
                icon: "⚠️",
            });
        },
        promise: (promise, messages) => {
            const { config } = get();
            toast.promise(promise, messages, config);
            return promise;
        },
    }));
};

describe("notificationStore", () => {
    const mockedToast = toast as unknown as MockToast;
    let store: ReturnType<typeof createTestStore>;

    beforeEach(() => {
        jest.clearAllMocks();
        store = createTestStore();
    });

    describe("config", () => {
        it("should have default config", () => {
            expect(store.getState().config).toEqual({
                position: "top-right",
                duration: 4000,
                className: "rounded-lg",
            });
        });

        it("should update config", () => {
            const newConfig = {
                position: "bottom-left" as const,
                duration: 5000,
            };

            store.getState().setConfig(newConfig);

            expect(store.getState().config).toEqual({
                position: "bottom-left",
                duration: 5000,
                className: "rounded-lg",
            });
        });
    });

    describe("notifications", () => {
        it("should show success notification", () => {
            store.getState().success("Success", "Operation completed");

            expect(mockedToast.success).toHaveBeenCalledWith("Success\nOperation completed", {
                position: "top-right",
                duration: 4000,
                className: "rounded-lg bg-green-50",
            });
        });

        it("should show error notification", () => {
            store.getState().error("Error", "Something went wrong");

            expect(mockedToast.error).toHaveBeenCalledWith("Error\nSomething went wrong", {
                position: "top-right",
                duration: 4000,
                className: "rounded-lg bg-red-50",
            });
        });

        it("should show info notification", () => {
            store.getState().info("Info", "Some information");

            expect(mockedToast).toHaveBeenCalledWith("Info\nSome information", {
                position: "top-right",
                duration: 4000,
                className: "rounded-lg bg-blue-50",
                icon: "🔵",
            });
        });

        it("should show warning notification", () => {
            store.getState().warning("Warning", "Be careful");

            expect(mockedToast).toHaveBeenCalledWith("Warning\nBe careful", {
                position: "top-right",
                duration: 4000,
                className: "rounded-lg bg-yellow-50",
                icon: "⚠️",
            });
        });

        it("should handle promise notification", async () => {
            const promise = Promise.resolve("result");
            const messages = {
                loading: "Loading...",
                success: "Success!",
                error: "Error!",
            };

            store.getState().promise(promise, messages);

            expect(mockedToast.promise).toHaveBeenCalledWith(promise, messages, {
                position: "top-right",
                duration: 4000,
                className: "rounded-lg",
            });
        });

        it("should show notification without description", () => {
            store.getState().success("Success");

            expect(mockedToast.success).toHaveBeenCalledWith("Success", {
                position: "top-right",
                duration: 4000,
                className: "rounded-lg bg-green-50",
            });
        });

        it("should use updated config for notifications", () => {
            const newConfig = {
                position: "bottom-left" as const,
                duration: 5000,
            };

            store.getState().setConfig(newConfig);
            store.getState().success("Success");

            expect(mockedToast.success).toHaveBeenCalledWith("Success", {
                position: "bottom-left",
                duration: 5000,
                className: "rounded-lg bg-green-50",
            });
        });
    });
});
