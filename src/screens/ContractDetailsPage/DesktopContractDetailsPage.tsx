import React, { useEffect } from "react"
import { useThemeStore } from "@/stores/themeStore"
import { useNavigate } from "react-router-dom"
import { useMainLayoutStore } from "@/stores/mainLayoutStore"
import { X } from "lucide-react"
import {
  ContractSummary,
  EntryExitDetails,
  OrderDetails,
} from "./components"
import { ContractDetailsChart } from "@/components/ContractDetailsChart/ContractDetailsChart"

const DesktopContractDetailsPage: React.FC = () => {
  const navigate = useNavigate()
  const { setSideNavVisible } = useMainLayoutStore()

  useEffect(() => {
    // Hide SideNav when component mounts
    setSideNavVisible(false)

    // Show SideNav when component unmounts
    return () => setSideNavVisible(true)
  }, [setSideNavVisible])

  const { isDarkMode } = useThemeStore();

  return (
    <div className={`flex flex-col h-screen w-full ${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"}`} data-testid="desktop-contract-details">
      <div className="flex justify-between items-center p-4 bg-white dark:bg-black border-b">
        <h1 className="text-xl font-bold mx-auto">Contract details</h1>
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative m-4">
        <div className={`w-[320px] border-r flex flex-col ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`} data-testid="left-panel">
          <div className={`flex-1 overflow-y-auto pb-20 space-y-4 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`} data-testid="content-area">
            <ContractSummary />
            <OrderDetails />
            <EntryExitDetails />
          </div>
          <div className="absolute bottom-0 left-0 right-0 m-4 w-[290px] b-[55px]" data-testid="close-button-container">
            <div className="max-w-[1200px] mx-auto">
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-black text-white py-4 rounded-lg dark:text-gray-300 dark:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className={`ml-4 rounded-lg border h-full ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-500"}`}>
            <ContractDetailsChart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DesktopContractDetailsPage
