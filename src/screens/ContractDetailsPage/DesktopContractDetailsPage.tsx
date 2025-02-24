import React from "react"
import { useNavigate } from "react-router-dom"
import { X } from "lucide-react"
import {
  ContractSummary,
  EntryExitDetails,
  OrderDetails,
} from "./components"
import { ContractDetailsChart } from "@/components/ContractDetailsChart/ContractDetailsChart"

const DesktopContractDetailsPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full" data-testid="desktop-contract-details">
      <div className="flex justify-between items-center p-4 bg-white">
        <h1 className="text-xl font-bold mx-auto">Contract details</h1>
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-[320px] border-r bg-white flex flex-col" data-testid="left-panel">
          <div className="flex-1 overflow-y-auto p-4 pb-40" data-testid="content-area">
            <ContractSummary />
            <OrderDetails />
            <EntryExitDetails />
          </div>
          <div className="absolute bottom-16 left-0 right-0 m-4 w-[290px] b-[55px]" data-testid="close-button-container">
            <div className="max-w-[1200px] mx-auto">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-black text-white py-3 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="m-4 mb-20 bg-white rounded-lg border h-full text-gray-500 ">
            <ContractDetailsChart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopContractDetailsPage
