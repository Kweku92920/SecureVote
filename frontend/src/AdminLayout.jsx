import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const titleByPath = {
  "/admin": "Dashboard",
  "/admin/elections": "Elections",
  "/admin/candidates": "Candidates",
  "/admin/voters": "Voters",
  "/admin/cards": "Voter Cards",
  "/admin/results": "Results",
  "/admin/settings": "Settings",
};

const AdminLayout = ({ children, onLogout, user }) => {
  const location = useLocation();
  const title = titleByPath[location.pathname] || "Dashboard";
  
  // State tracking parameter for managing mobile side-drawer drawer positioning
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close the mobile navigation layout automatically if the window location URL modifications trigger
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] font-sans antialiased flex overflow-x-hidden">
      
      {/* ─── RESPONSIVE COMPONENT: SIDEBAR ─── */}
      {/* We pass down the open state and closing set toggles so your sidebar can slide in out of bounds */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onLogout={onLogout} 
      />
      
      {/* ─── BACKGROUND SHIELD FOR CLOSING DRAWER OVERLAY ─── */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs transition-opacity duration-200"
        />
      )}

      {/* ─── MAIN CONTENT RECTANGLE CANVAS CONTAINER ─── */}
      {/* Removed the destructive static pl-64, replaced with fluid lg:pl-64 breakpoint matrix logic */}
      <div className="flex-1 min-w-0 pt-16 lg:pl-64 flex flex-col transition-all duration-300 ease-in-out">
        
        {/* ─── RESPONSIVE COMPONENT: HEADER ─── */}
        {/* We pass onMenuToggle so clicking the hamburger button inside the header opens the side drawer */}
        <Header 
          title={title} 
          user={user} 
          onLogout={onLogout} 
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        
        {/* ─── MAIN APP CONTENT DISPLAY CONTAINER SHEET ─── */}
        {/* Swapped static large p-8 for layout padding steps: p-4 on phones, p-6 on tablets, p-8 on desktops */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] w-full mx-auto overflow-x-hidden flex-1">
          {children}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;