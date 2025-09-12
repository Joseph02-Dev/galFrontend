import type { ReactNode } from "react";
import  Navbar  from "../composants/Navbar";
import Sidebar from "../composants/Sidebar";
import SidebarToggle from "../composants/SidebarToggle";
import { useState } from "react";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  hideSidebar?: boolean;
}

export default function MainLayout({ children, hideSidebar }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // On masque le sidebar si la prop hideSidebar est true
  return (
    <div data-theme="night">
      <Navbar />
      <div className="pt-16">
        {/* Bouton toggle visible uniquement sur mobile/tablette */}
        {!hideSidebar && <SidebarToggle onClick={() => setSidebarOpen(true)} />}
  <div className="flex">
          {/* Sidebar en overlay sur mobile/tablette */}
          {!hideSidebar && (
            <div>
              <div
                className={`fixed inset-0 z-40 bg-white opacity-85 bg-opacity-50 transition-opacity md:hidden ${
                  sidebarOpen ? "block" : "hidden"
                }`}
                onClick={() => setSidebarOpen(false)}
              />
              <div
                className={`left-0 top-16 bottom-0 w-72 z-50 transition-transform bg-white dark:bg-gray-900 border-r overflow-y-auto 
                  ${
                    sidebarOpen
                      ? "fixed translate-x-0"
                      : "fixed -translate-x-full"
                  }
                  md:translate-x-0 md:fixed md:block`}
              >
                <Sidebar />
              </div>
            </div>
          )}
          <div className={!hideSidebar ? "flex-1 md:ml-72 md:mr-72" : "flex-1"}>
            <main className="min-h-[calc(100vh-4rem)] max-w-md mx-auto p-4 md:ml-2.5">
              {children}
            </main>
          </div>
          {/* Sidebar droit visible uniquement sur desktop */}
          {!hideSidebar && (
            <div className="hidden md:block fixed right-0 top-16 bottom-0 w-72 z-40 bg-white dark:bg-gray-900 border-l overflow-y-auto">
            </div>
          )}
        </div>
      </div>
      {/* footer si besoin */}
    </div>
  );
}


