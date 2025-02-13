import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ContractDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gray-100 h-screen flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto pb-32 w-full lg:w-3/5 mx-auto">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)} className="text-lg font-bold">&larr;</button>
        <h1 className="flex-1 text-center text-lg font-bold">Contract details</h1>
      </div>

      {/* Rise/Fall Card */}
      <div className="p-4 bg-white shadow-md rounded-lg mb-4 border-b border-gray-300">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-red-500 font-bold">Rise</div>
            <div className="text-gray-500 text-sm">Volatility 100 (1s) Index</div>
          </div>
          <div className="text-right">
            <div className="text-gray-700">10.00 USD</div>
            <div className="text-green-500">+0.00 USD</div>
          </div>
        </div>
        <div className="text-gray-500 text-sm mt-2">0/10 ticks</div>
      </div>

      {/* Order Details */}
      
      {/* Chart Space */}
      <div className="min-h-[400px] bg-gray-200 flex items-center justify-center rounded-lg border-b border-gray-300">
        <span className="text-gray-500">Chart space (empty)</span>
      </div>
      <div className="mt-4 p-4 bg-white shadow-md rounded-lg border-b border-gray-300">
        <h2 className="text-md font-bold mb-4">Order details</h2>
        <div className="grid grid-cols-2 gap-y-2">
          <div className="col-span-2 flex justify-between border-b border-gray-300 py-2">
            <span className="text-gray-500">Reference ID</span>
            <span className="text-right">{id}</span>
          </div>

          <div className="col-span-2 flex justify-between border-b border-gray-300 py-2">
            <span className="text-gray-500">Duration</span>
            <span className="text-right">5 minutes</span>
          </div>

          <div className="col-span-2 flex justify-between border-b border-gray-300 py-2">
            <span className="text-gray-500">Barrier</span>
            <span className="text-right">329879.6438</span>
          </div>

          <div className="col-span-2 flex justify-between border-b border-gray-300 py-2">
            <span className="text-gray-500">Stake</span>
            <span className="text-right">10.00 USD</span>
          </div>

          <div className="col-span-2 flex justify-between py-2">
            <span className="text-gray-500">Potential payout</span>
            <span className="text-right">11.00 USD</span>
          </div>
        </div>
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
        <div className="grid grid-cols-2 gap-y-4">
          <div className="col-span-2 flex justify-between border-b border-gray-300 pb-2">
            <span className="text-gray-500">Start time</span>
            <div className="text-right">
              <span className="font-bold">01 Jan 2024</span>
              <div className="text-gray-500 text-sm">16:00:02 GMT</div>
            </div>
          </div>

          <div className="col-span-2 flex justify-between border-b border-gray-300 pb-2">
            <span className="text-gray-500">Entry spot</span>
            <div className="text-right">
            <div className="text-right">
              <span className="font-bold block">238972.7174</span>
              <span className="text-gray-500 text-sm block">01 Jan 2024</span>
              <span className="text-gray-500 text-sm block">16:00:02 GMT</span>
            </div>
            </div>
          </div>

          <div className="col-span-2 flex justify-between border-b border-gray-300 pb-2">
            <span className="text-gray-500">Exit time</span>
            <div className="text-right">
              <span className="font-bold">01 Jan 2024</span>
              <div className="text-gray-500 text-sm">17:20:36 GMT</div>
            </div>
          </div>

          <div className="col-span-2 flex justify-between pb-2">
            <span className="text-gray-500">Exit spot</span>
            <div className="text-right">
            <div className="text-right">
              <span className="font-bold block">283297.3823</span>
              <span className="text-gray-500 text-sm block">01 Jan 2024</span>
              <span className="text-gray-500 text-sm block">17:20:36 GMT</span>
            </div>
            </div>
          </div>
        </div>
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
