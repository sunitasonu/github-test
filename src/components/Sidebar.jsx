import React from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  Mail,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Users, label: "Users", active: false },
    { icon: ShoppingCart, label: "Orders", active: false },
    { icon: BarChart3, label: "Analytics", active: false },
    { icon: FileText, label: "Reports", active: false },
    { icon: Calendar, label: "Calendar", active: false },
    { icon: Mail, label: "Messages", active: false },
    { icon: Settings, label: "Settings", active: false },
    { icon: HelpCircle, label: "Help", active: false },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SabajiMandi</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start ${
                item.active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
