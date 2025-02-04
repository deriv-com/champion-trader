import React from "react";
import { useNavigate } from "react-router-dom";
import { useClientStore } from "@/stores/clientStore";

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, isLoggedIn } = useClientStore();

  const handleLogout = () => {
    localStorage.removeItem('loginToken');
    logout();
    navigate('/trade');
  };

  return (
    <div className="flex flex-col flex-1 p-4">
      <h1 className="text-2xl font-bold">Menu</h1>
      <div className="flex flex-col gap-4 mt-4">
        <button className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
          Settings
        </button>
        <button className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
          Help Center
        </button>
        <button className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
          About
        </button>
        {isLoggedIn && (
          <>
            <div className="flex-1" />
            <button 
              onClick={handleLogout}
              className="text-left p-4 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
            >
              Log out
            </button>
          </>
        )}
      </div>
    </div>
  );
};
