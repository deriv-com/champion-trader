import { ChevronDown } from "lucide-react";
import { FC, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface PositionsSidebarProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const PositionsSidebar: FC<PositionsSidebarProps> = ({ onClose }) => {
  const [isOpenTab, setIsOpenTab] = useState(true);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTradeType, setSelectedTradeType] = useState("Trade types");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [positions, setPositions] = useState([
    { id: 1, type: "Rise/Fall", market: "Volatility 100 Index", ticks: "2/150", stake: "10.00 USD", profit: "+1.00 USD" },
    { id: 2, type: "Rise/Fall", market: "Volatility 75 Index", ticks: "6/150", stake: "10.00 USD", profit: "+1.00 USD" }
  ]);

  useEffect(() => {
    fetch("/api/positions")
      .then(response => response.json())
      .then(data => setPositions(data))
      .catch(error => console.error("Error fetching positions:", error));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="h-full bg-white shadow-lg"
      ref={sidebarRef}
    >
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">Positions</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
      </div>
      <div className="px-4 py-2">
        <div className="flex justify-between border-b">
          <button
            className={`flex-1 py-2 text-center font-bold border-b-2 ${isOpenTab ? "border-black" : "border-gray-300 text-gray-500"}`}
            onClick={() => setIsOpenTab(true)}
          >
            Open
          </button>
          <button
            className={`flex-1 py-2 text-center font-bold border-b-2 ${!isOpenTab ? "border-black" : "border-gray-300 text-gray-500"}`}
            onClick={() => setIsOpenTab(false)}
          >
            Closed
          </button>
        </div>
        <div className="mt-4">
          <div className="relative w-[50%]" ref={dropdownRef} onMouseDown={(event) => event.stopPropagation()}>
            <button 
              className="text-sm h-9 w-full p-2 border rounded-full text-gray-500 flex items-center justify-between"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span>{selectedTradeType}</span>
              <span><ChevronDown className="text-black-400" /></span>
            </button>
          </div>
          {dropdownOpen && (
            <ul className="absolute text-sm left-0 w-1/2 bg-white border rounded-lg shadow-md mt-1" onMouseDown={(event) => event.stopPropagation()}>
              {["Option 1", "Option 2", "Option 3"].map((option) => (
                <li 
                  key={option} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedTradeType(option);
                    setDropdownOpen(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 space-y-4">
          {positions.map((position) => (
            <div 
              key={position.id}
              className="p-3 rounded-lg shadow-sm cursor-pointer"
              onClick={() => {
                navigate(`/contract/${position.id}`);
                onClose();
              }}
            >
              <div className="flex justify-between text-sm font-medium">
                <div className="flex flex-col items-start">
                  <img src="/market icon.svg" alt="Market Icon" className="w-5 h-8 mb-1" />
                  <span className="mb-[5] font-light text-black-400">{position.type}</span>
                  <span className="text-s font-light text-gray-500 mb-4">{position.market}</span>
                </div>
                <div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-500 w-35 text-xs flex items-center bg-gray-50 px-2 py-1 rounded-md border border-transparent hover:border-gray-300 mb-3">
                      <span className="mr-2">⏳</span> {position.ticks}
                    </span>
                    <span className="text-s font-light text-gray-400 mb-[2]">{position.stake}</span>
                    <span className="text-[#008832] text-sm">{position.profit}</span>
                  </div>
                </div>
              </div>
              <button className="w-full h-6 flex items-center justify-center py-2 border border-black text-xs font-bold rounded-[8]">
                Close {position.stake}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 font-bold border-t flex justify-between">
        <span className="text-black-300">Total profit/loss: </span>
        <span className="text-red-500">-1.50 USD</span>
      </div>
    </div>
  );
};

export default PositionsSidebar;
