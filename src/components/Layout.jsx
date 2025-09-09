import React from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 bg-gray-50">{children}</main>
      </SidebarInset>
    </div>
  );
};

export default Layout;
