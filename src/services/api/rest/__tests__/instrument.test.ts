import { AxiosError } from "axios"
import { apiClient } from "../../axios_interceptor"
import { getAvailableInstruments } from "../instrument/service"
import {
  AvailableInstrumentsRequest,
  AvailableInstrumentsResponse,
  ErrorResponse,
  MarketGroup,
} from "../types"

// Mock the axios client
jest.mock("../../axios_interceptor")
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

describe("REST API Service", () => {
  describe("getAvailableInstruments", () => {
    const mockRequest: AvailableInstrumentsRequest = {
      context: {
        app_id: 1001,
        account_type: "real",
      },
    }

    const mockMarkets: MarketGroup[] = [
      {
        market_name: "Forex",
        instruments: ["EURUSD", "GBPUSD", "USDJPY"],
      },
      {
        market_name: "Synthetic Indices",
        instruments: ["R_50", "R_75", "R_100"],
      },
      {
        market_name: "Volatility Indices",
        instruments: ["1HZ50V", "1HZ75V", "1HZ100V"],
      },
    ]

    const mockResponse: AvailableInstrumentsResponse = {
      performance: "1ms",
      result: mockMarkets,
    }

    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe("Successful Responses", () => {
      it("fetches available instruments without trace parameter", async () => {
        mockApiClient.post.mockResolvedValueOnce({ data: mockResponse })

        const result = await getAvailableInstruments(mockRequest)

        expect(mockApiClient.post).toHaveBeenCalledWith(
          "/available_instruments",
          mockRequest
        )
        expect(result).toEqual(mockResponse)
        expect(result.result).toHaveLength(3)
        expect(result.result[0].instruments).toHaveLength(3)
      })

      it("fetches available instruments with trace enabled", async () => {
        const requestWithTrace: AvailableInstrumentsRequest = {
          ...mockRequest,
          trace: true,
        }
        mockApiClient.post.mockResolvedValueOnce({ data: mockResponse })

        await getAvailableInstruments(requestWithTrace)

        expect(mockApiClient.post).toHaveBeenCalledWith(
          "/available_instruments",
          requestWithTrace
        )
      })

      it("handles empty result array", async () => {
        const emptyResponse: AvailableInstrumentsResponse = {
          performance: "1ms",
          result: [],
        }
        mockApiClient.post.mockResolvedValueOnce({ data: emptyResponse })

        const result = await getAvailableInstruments(mockRequest)

        expect(result.result).toEqual([])
      })
    })

    describe("Error Handling", () => {
      it("handles validation error for invalid app_id", async () => {
        const errorResponse: ErrorResponse = {
          error: "Invalid app_id: must be a positive integer",
        }

        mockApiClient.post.mockRejectedValueOnce(
          new AxiosError("Bad Request", "400", undefined, undefined, {
            data: errorResponse,
            status: 400,
          } as any)
        )

        await expect(
          getAvailableInstruments({
            context: { app_id: -1, account_type: "real" },
          })
        ).rejects.toThrow("Bad Request")
      })

      it("handles validation error for invalid account_type", async () => {
        const errorResponse: ErrorResponse = {
          error: 'Invalid account_type: must be "demo" or "real"',
        }

        mockApiClient.post.mockRejectedValueOnce(
          new AxiosError("Bad Request", "400", undefined, undefined, {
            data: errorResponse,
            status: 400,
          } as any)
        )

        await expect(
          getAvailableInstruments({
            context: { app_id: 1001, account_type: "invalid" },
          })
        ).rejects.toThrow("Bad Request")
      })

      it("handles server error with specific message", async () => {
        const errorResponse: ErrorResponse = {
          error: "Database connection failed",
        }

        mockApiClient.post.mockRejectedValueOnce(
          new AxiosError("Internal Server Error", "500", undefined, undefined, {
            data: errorResponse,
            status: 500,
          } as any)
        )

        await expect(getAvailableInstruments(mockRequest)).rejects.toThrow(
          "Internal Server Error"
        )
      })

      it("handles network timeout", async () => {
        mockApiClient.post.mockRejectedValueOnce(
          new AxiosError("Timeout of 5000ms exceeded", "ECONNABORTED")
        )

        await expect(getAvailableInstruments(mockRequest)).rejects.toThrow(
          "Timeout of 5000ms exceeded"
        )
      })
    })
  })
})
