import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { SideNav } from "@/components/SideNav";
import { useClientStore } from "@/stores/clientStore";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { isLoggedIn } = useClientStore();

  return (
    <div className="flex min-h-screen">
      <SideNav />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        {isLoggedIn && <Footer />}
      </div>
    </div>
  );
};
