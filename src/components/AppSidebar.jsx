import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Plus,
  List,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Calendar,
  Mail,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  UserPlus,
  Package,
  Calculator,
  CreditCard,
  TrendingUp,
  Shield,
  Carrot,
  Tractor,
  Receipt,
  FileSpreadsheet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
// At the top of AppSidebar.jsx

// At the top of AppSidebar.jsx
import { useSidebar } from "@/components/ui/use-sidebar";

const AppSidebar = () => {
  const location = useLocation();
  const { state } = useSidebar();
  // const [openInvoices, setOpenInvoices] = useState(true);
  // const [openCustomers, setOpenCustomers] = useState(true);
  // const [openProducts, setOpenProducts] = useState(false);
  const [openPayments, setOpenPayments] = useState(false);
  const [openMasters, setOpenMasters] = useState(false);
  // const [openAdmin, setOpenAdmin] = useState(false);
  const [openAavak, setOpenAavak] = useState(false);

  const mainMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    // { icon: TrendingUp, label: "Financial Dashboard", path: "/dashboard" },
    // { icon: BarChart3, label: "Analytics", path: "/analytics" },
    // { icon: Calendar, label: "Calendar", path: "/calendar" },
    // { icon: Mail, label: "Messages", path: "/messages" },
    // { icon: Settings, label: "Settings", path: "/settings" },
    // { icon: HelpCircle, label: "Help", path: "/help" },
  ];

  // const invoiceItems = [
  //   // { icon: List, label: "All Invoices", path: "/invoices" },
  //   // { icon: Plus, label: "Create Invoice", path: "/invoices/create" },
  // ];

  // const customerItems = [
  //   // { icon: Users, label: "All Customers", path: "/customers" },
  //   // { icon: UserPlus, label: "Add Customer", path: "/customers/create" },
  //   // { icon: List, label: "Customer Directory", path: "/customer-directory" },
  // ];

  const aavakItems = [
    { icon: FileSpreadsheet, label: "Aavak List", path: "/aavak" },
    {
      icon: List,
      label: "Aavak Payment",
      path: "/aavak/payment",
    },

    {
      icon: List,
      label: "Sale List",
      path: "/sale",
    },

    {
      icon: List,
      label: "Sale Payment",
      path: "/sale/payment",
    },


    // {
    //   icon: List,
    //   label: "Aavak Payment History",
    //   path: "/aavak/payment-history/1",
    // },
    // { icon: Plus, label: "Create Aavak", path: "/aavak/create" },
    // { icon: Plus, label: "Create Aavak (Alt)", path: "/aavak/create-alt" },
  ];

  // const productItems = [
  //   { icon: Package, label: "Product Catalog", path: "/products" },
  //   { icon: Calculator, label: "Tax Rates", path: "/tax-rates" },
  // ];

  const paymentItems = [
    { icon: CreditCard, label: "Record Payment", path: "/payments" },
    { icon: List, label: "Payment History", path: "/payment" },
  ];

  const masterItems = [
    { icon: Carrot, label: "Vegetable Master", path: "/vegetable-master" },
    { icon: Tractor, label: "Farmer Master", path: "/farmer-master" },
    { icon: Tractor, label: "Customer Master", path: "/customers" },
    { icon: Shield, label: "User Management", path: "/users" },
    { icon: Calculator, label: "Tax Rates", path: "/tax-rates" },
  ];

  // const adminItems = [
  //   // { icon: Shield, label: "User Management", path: "/users" },
  //   // { icon: Settings, label: "System Settings", path: "/system-settings" },
  // ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // const isInvoiceActive = () => location.pathname.startsWith("/invoices");
  // const isCustomerActive = () =>
  //   location.pathname.startsWith("/customers") ||
  //   location.pathname.startsWith("/customer-directory");
  const isAavakActive = () => location.pathname.startsWith("/aavak");
  // const isProductActive = () =>
  //   location.pathname.startsWith("/products") ||
  //   location.pathname.startsWith("/tax-rates");
  const isPaymentActive = () => location.pathname.startsWith("/payments");
  const isMasterActive = () =>
    location.pathname.startsWith("/vegetable-master") ||
    location.pathname.startsWith("/farmer-master") ||
    location.pathname.startsWith("/tax-rates");
  // const isAdminActive = () =>
  //   location.pathname.startsWith("/users") ||
  //   location.pathname.startsWith("/system-settings");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center space-x-3 px-2 py-2">
          <div className="bg-primary rounded-lg p-2">
            <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
          </div>
          {state === "expanded" && (
            <span className="text-xl font-bold text-sidebar-foreground">
              SabajiMandi
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={state === "collapsed" ? item.label : undefined}
                    className={
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : ""
                    }
                  >
                    <NavLink to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Invoices Section */}
              {/* <SidebarMenuItem>
                <Collapsible open={openInvoices} onOpenChange={setOpenInvoices}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isInvoiceActive()}
                      tooltip={state === "collapsed" ? "Invoices" : undefined}
                      className={
                        isInvoiceActive()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : ""
                      }
                    >
                      <FileText className="h-4 w-4" />
                      <span>Invoices</span>
                      {state === "expanded" &&
                        (openInvoices ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {invoiceItems.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(item.path)}
                              className={
                                isActive(item.path)
                                  ? "bg-primary/80 text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground"
                                  : ""
                              }
                            >
                              <NavLink to={item.path}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem> */}

              {/* Customers Section */}
              {/* <SidebarMenuItem>
                <Collapsible
                  open={openCustomers}
                  onOpenChange={setOpenCustomers}
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isCustomerActive()}
                      tooltip={state === "collapsed" ? "Customers" : undefined}
                      className={
                        isCustomerActive()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : ""
                      }
                    >
                      <Users className="h-4 w-4" />
                      <span>Customers</span>
                      {state === "expanded" &&
                        (openCustomers ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {customerItems.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(item.path)}
                              className={
                                isActive(item.path)
                                  ? "bg-primary/80 text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground"
                                  : ""
                              }
                            >
                              <NavLink to={item.path}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem> */}

              {/* Aavak Section */}
              <SidebarMenuItem>
                <Collapsible open={openAavak} onOpenChange={setOpenAavak}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isAavakActive()}
                      tooltip={state === "collapsed" ? "Aavak" : undefined}
                      className={
                        isAavakActive()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : ""
                      }
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Aavak</span>
                      {state === "expanded" &&
                        (openAavak ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {aavakItems.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(item.path)}
                              className={
                                isActive(item.path)
                                  ? "bg-primary/80 text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground"
                                  : ""
                              }
                            >
                              <NavLink to={item.path}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>

              {/* Products & Services Section */}
              {/* <SidebarMenuItem>
                <Collapsible open={openProducts} onOpenChange={setOpenProducts}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isProductActive()}
                      tooltip={state === "collapsed" ? "Products" : undefined}
                      className={
                        isProductActive()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : ""
                      }
                    >
                      <Package className="h-4 w-4" />
                      <span>Products</span>
                      {state === "expanded" &&
                        (openProducts ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {productItems.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(item.path)}
                              className={
                                isActive(item.path)
                                  ? "bg-primary/80 text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground"
                                  : ""
                              }
                            >
                              <NavLink to={item.path}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem> */}

              {/* Payments Section */}
              <SidebarMenuItem>
                <Collapsible open={openPayments} onOpenChange={setOpenPayments}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isPaymentActive()}
                      tooltip={state === "collapsed" ? "Payments" : undefined}
                      className={
                        isPaymentActive()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : ""
                      }
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Payments</span>
                      {state === "expanded" &&
                        (openPayments ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {paymentItems.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(item.path)}
                              className={
                                isActive(item.path)
                                  ? "bg-primary/80 text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground"
                                  : ""
                              }
                            >
                              <NavLink to={item.path}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>

              {/* Masters Section */}
              <SidebarMenuItem>
                <Collapsible open={openMasters} onOpenChange={setOpenMasters}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isMasterActive()}
                      tooltip={state === "collapsed" ? "Masters" : undefined}
                      className={
                        isMasterActive()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : ""
                      }
                    >
                      <Receipt className="h-4 w-4" />
                      <span>Masters</span>
                      {state === "expanded" &&
                        (openMasters ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {masterItems.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(item.path)}
                              className={
                                isActive(item.path)
                                  ? "bg-primary/80 text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground"
                                  : ""
                              }
                            >
                              <NavLink to={item.path}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem>

              {/* Admin Section */}
              {/* <SidebarMenuItem>
                <Collapsible open={openAdmin} onOpenChange={setOpenAdmin}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isAdminActive()}
                      tooltip={state === "collapsed" ? "Admin" : undefined}
                      className={
                        isAdminActive()
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : ""
                      }
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                      {state === "expanded" &&
                        (openAdmin ? (
                          <ChevronDown className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        ))}
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {state === "expanded" && (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {adminItems.map((item) => (
                          <SidebarMenuSubItem key={item.path}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActive(item.path)}
                              className={
                                isActive(item.path)
                                  ? "bg-primary/80 text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground"
                                  : ""
                              }
                            >
                              <NavLink to={item.path}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </NavLink>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </SidebarMenuItem> */}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
