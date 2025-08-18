import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import CreateReport from "./pages/CreateReport";
import ReportsList from "./pages/ReportsList";
import Dashboard from "./pages/Dashboard";
import ReportDetails from "./pages/ReportDetails";
import Reports from "./pages/Reports";
import WeeklyCalendar from "./pages/WeeklyCalendar";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/crear-denuncia" element={<CreateReport />} />
          <Route path="/denuncias" element={<ReportsList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/denuncia/:id" element={<ReportDetails />} />
          <Route path="/reportes" element={<Reports />} />
          <Route path="/calendario-semanal" element={<WeeklyCalendar />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
