import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import FinancialDashboard from "./pages/FinancialDashboard";
import InvoiceList from "./pages/InvoiceList";
import CreateInvoice from "./pages/CreateInvoice";
import ViewInvoice from "./pages/ViewInvoice";
import EditInvoice from "./pages/EditInvoice";
import CustomerList from "./pages/CustomerList";
import CreateCustomer from "./pages/CreateCustomer";
import ViewCustomer from "./pages/ViewCustomer";
import EditCustomer from "./pages/EditCustomer";
import CustomerDirectory from "./pages/CustomerDirectory";
import VegetableMaster from "./pages/VegetableMaster";
import FarmerMaster from "./pages/FarmerMaster";
import ProductCatalog from "./pages/ProductCatalog";
import TaxRates from "./pages/TaxRates";
import PaymentRecording from "./pages/PaymentRecording";
import UserManagement from "./pages/UserManagement";
import SystemSettings from "./pages/SystemSettings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import LoginMinimal from "./pages/LoginMinimal";
import LoginCorporate from "./pages/LoginCorporate";
import LoginCreative from "./pages/LoginCreative";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import AavakList from "./pages/AavakList";
import AavakCreate from "./pages/AavakCreate";
// import AavakCreateAlt from "./pages/AavakCreateAlt";
import ViewAavak from "./pages/AavakView";
import EditAavak from "./pages/AavakEdit";
import PrintAavak from "./pages/AavakPrint";
import AavakPayment from "./pages/AavakPayment";
import AavakPaymentHistory from "./pages/AavakPaymentHistory";
import SaleCreate from "./pages/SaleCreate";
import SaleList from "./pages/SaleList";
import SalePayment from "./pages/SalePayment";
import SalePaymentHistory from "./pages/SalePaymentHistory";

function App() {
  return (
    <>
      <Router>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <Routes>
              {/* Authentication Routes */}
              <Route path="/login-index" element={<Login />} />
              <Route path="/login/minimal" element={<LoginMinimal />} />
              <Route path="/" element={<LoginCorporate />} />
              <Route path="/login/creative" element={<LoginCreative />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Main Application Routes */}
              <Route
                path="/*"
                element={
                  <Layout>
                    <Routes>
                      <Route path="/dashboard" element={<Index />} />
                      <Route
                        path="/dashboard"
                        element={<FinancialDashboard />}
                      />

                      {/* Invoice Routes */}
                      <Route path="/invoices" element={<InvoiceList />} />
                      <Route
                        path="/invoices/create"
                        element={<CreateInvoice />}
                      />
                      <Route path="/invoices/:id" element={<ViewInvoice />} />
                      <Route
                        path="/invoices/:id/edit"
                        element={<EditInvoice />}
                      />

                      {/* Customer Routes */}
                      <Route path="/customers" element={<CustomerList />} />
                      <Route
                        path="/customers/create"
                        element={<CreateCustomer />}
                      />
                      <Route path="/customers/:id" element={<ViewCustomer />} />
                      <Route
                        path="/customers/:id/edit"
                        element={<EditCustomer />}
                      />
                      <Route
                        path="/customer-directory"
                        element={<CustomerDirectory />}
                      />

                      {/* Aavak Routes */}
                      <Route path="/aavak" element={<AavakList />} />
                      <Route path="/aavak/payment" element={<AavakPayment />} />
                      <Route
                        path="/aavak/payment-history/:id"
                        element={<AavakPaymentHistory />}
                      />
                      <Route path="/aavak/create" element={<AavakCreate />} />

                      {/*Sale Routes */}
                      <Route path="/sale" element={<SaleList />} />
                      <Route path="/sale/create" element={<SaleCreate />} />
                      <Route path="/sale/payment" element={<SalePayment />} />
                      <Route
                        path="/sale/payment-history/:id"
                        element={<SalePaymentHistory />}
                      />

                      {/* <Route
                      path="/aavak/create-alt"
                      element={<AavakCreateAlt />}
                    /> */}
                      <Route path="/aavak/:id" element={<ViewAavak />} />
                      <Route path="/aavak/:id/edit" element={<EditAavak />} />
                      <Route path="/aavak/:id/print" element={<PrintAavak />} />

                      {/* Master Routes */}
                      <Route
                        path="/vegetable-master"
                        element={<VegetableMaster />}
                      />
                      <Route path="/farmer-master" element={<FarmerMaster />} />

                      {/* Product Routes */}
                      <Route path="/products" element={<ProductCatalog />} />
                      <Route path="/tax-rates" element={<TaxRates />} />

                      {/* Payment Routes */}
                      <Route path="/payments" element={<PaymentRecording />} />

                      {/* Admin Routes */}
                      <Route path="/users" element={<UserManagement />} />
                      <Route
                        path="/system-settings"
                        element={<SystemSettings />}
                      />
                      <Route path="/profile" element={<Profile />} />

                      {/* Catch all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                }
              />
            </Routes>
          </div>
        </SidebarProvider>
      </Router>
    </>
  );
}

export default App;
