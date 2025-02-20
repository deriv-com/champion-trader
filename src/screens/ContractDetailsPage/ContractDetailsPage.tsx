import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ContractDetailsChart } from "@/components/ContractDetailsChart";
import axios from "axios";

const ContractDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [, setContractData] = useState({
    type: "Rise",
    market: "Volatility 100 (1s) Index",
    stake: "10.00",
    profit: "+0.00",
    duration: "5 minutes",
    barrier: "329879.6438",
    payout: "11.00",
    startTime: "01 Jan 2024",
    startTimeGMT: "16:00:02 GMT",
    entrySpot: "238972.7174",
    entryTimeGMT: "01 Jan 2024, 16:00:02 GMT",
    exitTime: "01 Jan 2024",
    exitTimeGMT: "17:20:36 GMT",
    exitSpot: "283297.3823"
  });

  useEffect(() => {
    axios.get(`/api/contracts/${id}`)
      .then(response => setContractData(response.data))
      .catch(error => console.error("Error fetching contract details:", error));
  }, [id]);

  return (
    <div className="w-full bg-gray-100 h-screen flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto pb-32 w-full lg:w-3/5 mx-auto">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="text-lg font-bold">&larr;</button>
        <h1 className="flex-1 text-center text-lg font-bold">Contract details</h1>
      </div>

      {/* Rise/Fall Card */}
      {[
        { title: "Rise", titleClass: "text-red-500", description: "Volatility 100 (1s) Index", amount: "10.00 USD", change: "+0.00 USD", changeClass: "text-green-500" }
      ].map((card, index) => (
        <div key={index} className="p-4 bg-white shadow-md rounded-lg mb-4 border-b border-gray-300">
          <div className="flex justify-between items-center">
            <div>
              <div className={`${card.titleClass} font-bold`}>{card.title}</div>
              <div className="text-gray-500 text-sm">{card.description}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-700">{card.amount}</div>
              <div className={card.changeClass}>{card.change}</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm mt-2">0/10 ticks</div>
        </div>
      ))}

      {/* Order Details */}
      
      {/* Chart Space */}
      <div className="min-h-[400px] bg-white rounded-lg border-b border-gray-300">
        <ContractDetailsChart />
      </div>
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg border-b border-gray-300">
        <h2 className="text-md font-bold mb-4">Order details</h2>
        {[
          { label: "Reference ID", value: id },
          { label: "Duration", value: "5 minutes" },
          { label: "Barrier", value: "329879.6438" },
          { label: "Stake", value: "10.00 USD" },
          { label: "Potential payout", value: "11.00 USD" }
        ].map((detail, index) => (
          <div key={index} className="col-span-2 flex justify-between border-b border-gray-300 py-2">
            <span className="text-gray-500">{detail.label}</span>
            <span className="text-right">{detail.value}</span>
          </div>
        ))}
      </div>

      {/* How Do I Earn a Payout */}
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg border-b border-gray-300">
        <h2 className="text-md font-bold mb-2">How do I earn a payout?</h2>
        <p className="text-gray-500">
          Win payout if [market] after [duration] is strictly higher than entry spot.
        </p>
      </div>

      <div className="mt-4 p-4 bg-white shadow-md rounded-lg mb-12 border-b border-gray-300">
        <h2 className="text-md font-bold mb-4">Entry & exit details</h2>
        {[
          { label: "Start time", value: "01 Jan 2024", subValue: "16:00:02 GMT" },
          { label: "Entry spot", value: "238972.7174", subValue: "01 Jan 2024, 16:00:02 GMT" },
          { label: "Exit time", value: "01 Jan 2024", subValue: "17:20:36 GMT" },
          { label: "Exit spot", value: "283297.3823", subValue: "01 Jan 2024, 17:20:36 GMT" }
        ].map((detail, index) => (
          <div key={index} className="col-span-2 flex justify-between border-b border-gray-300 pb-2">
            <span className="text-gray-500">{detail.label}</span>
            <div className="text-right">
              <span className="font-bold block">{detail.value}</span>
              {detail.subValue && <span className="text-gray-500 text-sm block">{detail.subValue}</span>}
            </div>
          </div>
        ))}
      </div>

      </div>
      {/* Close Button */}
      <button onClick={() => navigate(-1)} className="text-white bg-black w-full p-4 text-[#000] text-center rounded-none shadow-md mt-4">
        Close
      </button>
    </div>
  );
};

export default ContractDetailsPage;
