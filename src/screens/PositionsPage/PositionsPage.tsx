import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";

const positions = [
  {
    id: 1,
    type: "Rise",
    market: "Volatility 100 (1s) Index",
    stake: "10.00 USD",
    profit: "+0.00 USD",
    duration: "0/10 ticks",
    isOpen: true,
  },
  {
    id: 2,
    type: "Rise",
    market: "Volatility 100 (1s) Index",
    stake: "10.00 USD",
    profit: "+0.00 USD",
    duration: "00:05:00",
    isOpen: false,
  },
];

const PositionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [swipedCard, setSwipedCard] = useState<number | null>(null);

  const handleTouchStart = () => {
    setSwipedCard(null);
  };

  const handleTouchMove = (e: React.TouchEvent, id: number) => {
    const touch = e.touches[0];
    if (touch.clientX < 250) {
      setSwipedCard(id);
    }
  };

  const handleTouchEnd = () => {
    // Optionally reset swipe after some time
  };

  useEffect(() => {
    function handleClickOutside() {
      if (swipedCard !== null) {
        setSwipedCard(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [swipedCard]);

  return (
    <div className="flex flex-col flex-1 h-full bg-white"> 
      {/* Tabs */}
      <div className="flex sticky top-0 z-10 px-4 bg-white border-b border-border">
        <button
          className={`flex-1 py-3 border-b-2 transition-colors ${
            activeTab === "open" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground"
          }`}
          onClick={() => setActiveTab("open")}
        >
          Open
        </button>
        <button
          className={`flex-1 py-3 border-b-2 transition-colors ${
            activeTab === "closed" 
              ? "border-primary text-primary" 
              : "border-transparent text-muted-foreground"
          }`}
          onClick={() => setActiveTab("closed")}
        >
          Closed
        </button>
      </div>

      {/* Positions List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2 space-y-2 bg-gray-100">
        {positions
          .filter((position) => (activeTab === "open" ? position.isOpen : !position.isOpen))
          .map((position) => {
            const navigate = useNavigate();
            return (
              <div
                key={position.id}
                className="relative flex transition-transform duration-300"
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => handleTouchMove(e, position.id)}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setSwipedCard(position.id)}
                onMouseLeave={() => setSwipedCard(null)}
              >
                <div className={`relative flex transition-transform duration-300 w-full ${swipedCard === position.id ? "-translate-x-0" : "translate-x-0"}`}>
                  <Card className={`w-full lg:w-full cursor-pointer flex transition-all duration-300 ${
                    swipedCard === position.id ? "translate-x-[-4rem]" : "translate-x-0"
                  }`}
                  onClick={() => navigate(`/contract/${position.id}`)}
                >
                  <CardContent className="p-4 w-full">
                    <div className="flex justify-between">
                      <div>
                        <div className="text-red-500 font-bold">{position.type}</div>
                        <div className="text-gray-500 text-sm">{position.market}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-700">{position.stake}</div>
                        <div className="text-green-500">{position.profit}</div>
                      </div>
                    </div>
                    <div className="text-gray-500 text-sm mt-2">{position.duration}</div>
                  </CardContent>
                </Card>
              </div>
                <button
                  className={`absolute right-0 h-full w-16 bg-red-600 text-white font-bold flex items-center justify-center transition-all duration-300 rounded-tr-lg rounded-br-lg ${
                    swipedCard === position.id ? "flex" : "hidden"
                  }`}
                  onClick={() => console.log("Close action triggered")}
                >
                  Close
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PositionsPage;
