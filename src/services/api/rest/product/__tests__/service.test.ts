import { getProducts } from "../service";
import { apiClient } from "../../../axios_interceptor";
import { ProductsResponse } from "../../types";

// Mock the axios interceptor
jest.mock("../../../axios_interceptor", () => ({
    apiClient: {
        get: jest.fn(),
    },
}));

describe("getProducts", () => {
    beforeEach(() => {
        (apiClient.get as jest.Mock).mockClear();
    });

    it("fetches products successfully", async () => {
        // Mock response based on trade types in the system
        const mockResponse: ProductsResponse = {
            data: {
                products: [
                    { id: "rise_fall", display_name: "Rise/Fall" },
                    { id: "high_low", display_name: "Higher/Lower" },
                    { id: "touch", display_name: "Touch/No Touch" },
                    { id: "multiplier", display_name: "Multiplier" },
                ],
            },
        };

        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: mockResponse,
        });

        const response = await getProducts();

        expect(apiClient.get).toHaveBeenCalledWith("/v1/market/products");
        expect(response).toEqual(mockResponse);
    });

    it("handles API errors", async () => {
        const mockError = new Error("API Error");
        (apiClient.get as jest.Mock).mockRejectedValueOnce(mockError);

        await expect(getProducts()).rejects.toThrow("API Error");
        expect(apiClient.get).toHaveBeenCalledWith("/v1/market/products");
    });
});
