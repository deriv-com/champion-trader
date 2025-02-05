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
    <div className="flex min-h-[100dvh] h-[100dvh]">
      <SideNav />
      <div className="flex flex-col flex-1 relative overflow-hidden">
        <Header className="sticky top-0 z-50" />
        <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
          {children}
        </main>
        {isLoggedIn && <Footer className="sticky bottom-0 z-50" />}
      </div>
    </div>
  );
};
