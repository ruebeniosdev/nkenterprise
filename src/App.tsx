import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";

import AuthRedirect from "./contexts/AuthRedirect";

import Index from "./pages/Index";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Suppliers from "./pages/Suppliers";
import LowStock from "./pages/LowStock";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SidebarProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>

              {/* Default entry */}
              <Route
                path="/"
                element={<AuthRedirect />}
              />

              {/* Public */}
              <Route path="/login" element={<Login />} />

              {/* Protected */}
              <Route>
              {/* <Route element={<AuthRedirect />}> */}
                <Route path="/dashboard" element={<Index />} />
                <Route path="/products" element={<Products />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/low-stock" element={<LowStock />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
