import React from "react";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center bg-theme px-4 py-2 sticky top-0 z-50 border-b border-theme">
            <button onClick={() => navigate(-1)} className="text-lg font-bold">
                &larr;
            </button>
            <h1 className="flex-1 text-center text-lg font-bold">Contract details</h1>
        </div>
    );
};
